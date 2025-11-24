# Phase 4: Optimization & Voice Messages

## Objectives
Focus on Offline Support and Performance Optimization, followed by the implementation of Voice Messages.

## Tasks

### 1. Offline Support & Persistence
- **Goal**: Robust offline experience with visual indicators.
- **Implementation**:
    - Verify/Enable Firestore offline persistence in `lib/firebase/config.ts`.
    - Add a connection status indicator in `ChatHeader.tsx` (e.g., "Offline" badge).
    - Ensure messages sent while offline are queued and visually distinct (e.g., slightly transparent or "pending" icon).

### 2. Performance Optimization
- **Goal**: Minimize re-renders for a smoother experience.
- **Implementation**:
    - Wrap `MessageBubble` in `React.memo`.
    - Wrap `MessageList` in `React.memo`.
    - Optimize `ChatRoomView` state updates to prevent unnecessary re-renders of the entire list.

### 3. Voice Message Implementation
- **Goal**: Allow users to record and send voice notes.
- **Implementation**:
    - **Backend**: Update `ChatMessage` type to include `'audio'` and `metadata` (duration).
    - **Storage**: Ensure `uploadChatAttachment` handles audio files correctly.
    - **UI - Composer**:
        - Add Mic button to `MessageComposer`.
        - Implement `MediaRecorder` logic (Start, Stop, Cancel).
        - Show recording timer and visual feedback.
    - **UI - Bubble**:
        - Create `AudioPlayer` component (or inline in Bubble).
        - Render audio player for `type: 'audio'` messages.
