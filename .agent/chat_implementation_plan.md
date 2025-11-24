# WEAV Real-Time Group Chat Implementation Plan

## Executive Summary
Transform the existing UI-first chat implementation into a fully functional real-time group chat system using **Firebase Firestore** for real-time messaging, presence tracking, and typing indicators.

---

## Why Firebase Firestore?

### ✅ Recommended: Firebase Firestore
**Best fit for your project because:**
1. **Already integrated** - You have Firebase setup in `lib/firebase/`
2. **Real-time by default** - Built-in `onSnapshot` listeners for instant updates
3. **Scalable** - Handles millions of messages with automatic indexing
4. **Offline support** - Messages sync when connection restored
5. **Security** - Firestore Security Rules for access control
6. **Cost-effective** - Free tier: 50K reads/day, 20K writes/day
7. **No backend needed** - Direct client-to-database communication

### ❌ Alternatives (Not Recommended for Now)
- **Socket.io / WebSockets** - Requires custom backend server
- **Pusher / Ably** - Third-party service, additional cost
- **Stream Chat API** - Expensive ($99/mo), overkill for your needs
- **Supabase Realtime** - Would require migration from Firebase

---

## Current State Analysis

### ✅ What You Have (Excellent UI)
- `ChatRoomView.tsx` - Main chat container
- `MessageList.tsx` - Message display with auto-scroll
- `MessageBubble.tsx` - Individual message styling
- `MessageComposer.tsx` - Text input with auto-resize
- `TypingIndicator.tsx` - Animated typing dots
- `ChatHeader.tsx` - Thread info display
- Sample data structure in `sampleChatMessages.ts`

### ❌ What's Missing (Backend Integration)
- Real-time message sync across users
- Message persistence in Firestore
- Typing indicator broadcasting
- Online presence tracking
- Message delivery/read receipts
- File/image sharing
- Message reactions (you have UI, need backend)

---

## Implementation Plan

### Phase 1: Core Messaging (Week 1)
**Goal:** Send and receive messages in real-time

#### 1.1 Create Firestore Data Structure
```
/threads/{threadId}/messages/{messageId}
  - id: string
  - authorId: string
  - content: string
  - timestamp: Timestamp
  - isEdited: boolean
  - reactions: { emoji: string, userIds: string[] }[]
```

#### 1.2 Create `lib/firebase/messages.ts`
Functions needed:
- `sendMessage(threadId, content)` - Add new message
- `subscribeToMessages(threadId, callback)` - Real-time listener
- `editMessage(threadId, messageId, newContent)` - Edit existing
- `deleteMessage(threadId, messageId)` - Soft delete
- `addReaction(threadId, messageId, emoji)` - Add emoji reaction

#### 1.3 Update `ChatRoomView.tsx`
- Replace `getChatMessages()` with `subscribeToMessages()`
- Replace local state with Firestore real-time updates
- Handle message sending through Firebase

**Files to create:**
- `lib/firebase/messages.ts` (new)

**Files to modify:**
- `components/ChatRoomView.tsx`
- `data/sampleChatMessages.ts` (keep for fallback/demo)

---

### Phase 2: Typing Indicators (Week 1)
**Goal:** Show when users are typing in real-time

#### 2.1 Create Presence System
```
/threads/{threadId}/presence/{userId}
  - userId: string
  - username: string
  - avatar: string
  - isTyping: boolean
  - lastSeen: Timestamp
```

#### 2.2 Create `lib/firebase/presence.ts`
Functions needed:
- `setTypingStatus(threadId, isTyping)` - Update typing state
- `subscribeToTypingUsers(threadId, callback)` - Listen for typers
- `updateLastSeen(threadId)` - Update activity timestamp
- `subscribeToOnlineUsers(threadId, callback)` - Track online members

#### 2.3 Update `MessageComposer.tsx`
- Debounce typing indicator (send after 500ms of typing)
- Clear typing status on send or 3s of inactivity

**Files to create:**
- `lib/firebase/presence.ts` (new)

**Files to modify:**
- `components/MessageComposer.tsx`
- `components/ChatRoomView.tsx`

---

### Phase 3: Enhanced Features (Week 2)
**Goal:** Add reactions, read receipts, and media sharing

#### 3.1 Message Reactions
- Update `addReaction()` in `messages.ts`
- Add reaction picker UI component
- Show reaction counts on messages

#### 3.2 Read Receipts
```
/threads/{threadId}/messages/{messageId}/reads/{userId}
  - userId: string
  - readAt: Timestamp
```

Functions:
- `markMessageAsRead(threadId, messageId)`
- `getMessageReads(threadId, messageId)`

#### 3.3 Image/File Sharing
- Use existing `lib/firebase/storage.ts`
- Add image upload to `MessageComposer`
- Display images in `MessageBubble`

**Files to create:**
- `components/ReactionPicker.tsx` (new)
- `components/ImageMessage.tsx` (new)

**Files to modify:**
- `components/MessageBubble.tsx`
- `components/MessageComposer.tsx`
- `lib/firebase/messages.ts`

---

### Phase 4: Optimization & Polish (Week 2)
**Goal:** Performance, security, and UX improvements

#### 4.1 Performance Optimizations
- Implement message pagination (load 50 at a time)
- Add infinite scroll for message history
- Optimize Firestore queries with indexes
- Cache user profiles to reduce reads

#### 4.2 Security Rules
Create `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Thread messages - only members can read/write
    match /threads/{threadId}/messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.resource.data.authorId == request.auth.uid;
      allow update: if request.auth != null && 
                      resource.data.authorId == request.auth.uid;
      allow delete: if request.auth != null && 
                      resource.data.authorId == request.auth.uid;
    }
    
    // Presence - users can only update their own
    match /threads/{threadId}/presence/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && userId == request.auth.uid;
    }
  }
}
```

#### 4.3 Error Handling
- Add retry logic for failed sends
- Show offline indicator
- Queue messages when offline
- Handle network errors gracefully

**Files to create:**
- `firestore.rules` (new)
- `lib/firebase/offline.ts` (new)

**Files to modify:**
- All Firebase integration files

---

## Firestore Data Schema (Complete)

### Collections Structure
```
/threads/{threadId}
  ├── /messages/{messageId}
  │     ├── id: string
  │     ├── authorId: string
  │     ├── content: string
  │     ├── timestamp: Timestamp
  │     ├── isEdited: boolean
  │     ├── editedAt?: Timestamp
  │     ├── type: 'text' | 'image' | 'file'
  │     ├── mediaUrl?: string
  │     └── reactions: { emoji: string, userIds: string[] }[]
  │
  ├── /presence/{userId}
  │     ├── userId: string
  │     ├── username: string
  │     ├── avatar: string
  │     ├── isTyping: boolean
  │     ├── lastSeen: Timestamp
  │     └── isOnline: boolean
  │
  └── /metadata
        ├── memberCount: number
        ├── lastMessageAt: Timestamp
        └── lastMessagePreview: string
```

---

## Cost Estimation (Firebase Free Tier)

### Free Tier Limits
- **Firestore Reads**: 50,000/day
- **Firestore Writes**: 20,000/day
- **Storage**: 1 GB
- **Bandwidth**: 10 GB/month

### Estimated Usage (100 active users)
- **Messages sent**: ~5,000/day (20 writes each) = 100,000 writes ❌ **Exceeds free tier**
- **Messages read**: ~50,000/day ✅ Within limit
- **Typing indicators**: ~10,000/day ✅ Within limit

### Optimization Strategies
1. **Batch writes** - Combine multiple updates
2. **Cache aggressively** - Store messages locally
3. **Limit real-time listeners** - Only active chats
4. **Use Cloud Functions** - Server-side aggregations

### Estimated Monthly Cost (if exceeding free tier)
- **100-500 users**: $5-15/month
- **500-1000 users**: $15-30/month
- **1000+ users**: $30-100/month

---

## Implementation Priority

### 🔴 Critical (Do First)
1. Message sending/receiving (`messages.ts`)
2. Real-time message sync (`ChatRoomView.tsx`)
3. Basic security rules

### 🟡 Important (Do Second)
4. Typing indicators (`presence.ts`)
5. Message pagination
6. Error handling

### 🟢 Nice-to-Have (Do Later)
7. Message reactions
8. Read receipts
9. Image sharing
10. Message search

---

## Next Steps

### Immediate Action Items
1. **Review this plan** - Confirm approach
2. **Set up Firestore indexes** - Create in Firebase Console
3. **Start with Phase 1** - I'll create `lib/firebase/messages.ts`
4. **Test with 2 browser windows** - Verify real-time sync

### Questions to Answer
1. Do you want to keep sample data for demo/testing?
2. Should we implement message pagination from the start?
3. Do you need message encryption (end-to-end)?
4. What's your target user count (affects optimization strategy)?

---

## File Structure After Implementation

```
lib/firebase/
├── config.ts (existing)
├── auth.ts (existing)
├── threads.ts (existing)
├── users.ts (existing)
├── storage.ts (existing)
├── messages.ts (NEW - Phase 1)
├── presence.ts (NEW - Phase 2)
├── reactions.ts (NEW - Phase 3)
└── offline.ts (NEW - Phase 4)

components/
├── ChatRoomView.tsx (MODIFY - Phase 1)
├── MessageList.tsx (MODIFY - Phase 1)
├── MessageComposer.tsx (MODIFY - Phase 2)
├── MessageBubble.tsx (MODIFY - Phase 3)
├── ReactionPicker.tsx (NEW - Phase 3)
├── ImageMessage.tsx (NEW - Phase 3)
└── OfflineIndicator.tsx (NEW - Phase 4)
```

---

## Ready to Start?

I can begin implementing **Phase 1** right now. This will give you:
- ✅ Real-time message sending/receiving
- ✅ Message persistence in Firestore
- ✅ Multi-user chat support
- ✅ Automatic sync across all connected clients

**Shall I proceed with creating `lib/firebase/messages.ts` and updating `ChatRoomView.tsx`?**
