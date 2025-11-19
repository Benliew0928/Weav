# WEAV — The Mind Garden

A pixel-perfect, production-quality web application built with Next.js 14, React Three Fiber, and Framer Motion. Explore conversation threads visually in a 3D interactive **Weav Garden Ring** — a toroidal ring layout where ideas bloom and intertwine.

## 🎨 Features

- **3D Weav Garden Ring**: Interactive toroidal ring with evenly distributed thread nodes
- **Smooth Animations**: Framer Motion transitions with exact timing specifications
- **Performance Monitoring**: Automatic FPS tracking with 2D fallback for poor performance
- **Responsive Design**: Fully responsive down to 360px width
- **Dark Mode**: Beautiful dark theme with nebula gradient accents
- **Thread Management**: Create, view, and interact with conversation threads
- **WebGL Fallback**: Graceful 2D fallback when WebGL is not available
- **Accessibility**: Full keyboard navigation, ARIA labels, and high contrast support
- **Debug Overlay**: Toggleable performance metrics (Ctrl+D / Cmd+D)

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **React 18** with Server + Client Components
- **TypeScript** (strict mode)
- **Tailwind CSS** with custom design tokens
- **React Three Fiber** + Drei for 3D graphics
- **Framer Motion** for animations
- **Zustand** for state management
- **Radix UI** for accessible primitives

## 📋 Prerequisites

- **Node.js >= 20**
- npm, yarn, or pnpm (pnpm recommended)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. Run Development Server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
/app
  /layout.tsx              # Root layout with Header/Footer
  /page.tsx                # Main WeavRing feed
  /login/page.tsx          # Login/Welcome screen
  /thread/[id]/page.tsx    # Thread detail view (legacy route)
  /profile/page.tsx        # User profile
  /notifications/page.tsx  # Notifications

/components
  Header.tsx               # Navigation header
  Footer.tsx               # Footer component
  WeavRing.tsx             # Main 3D ring container
  RingScene.tsx            # R3F scene with camera/lighting
  RingNode.tsx             # Individual 3D node with HTML overlay
  WeavRing2D.tsx           # 2D fallback implementation
  ThreadDetailPanel.tsx    # Slide-in panel for thread details
  ThreadCard.tsx           # 2D thread card
  FloatingFAB.tsx          # FAB for creating threads
  GradientBackground.tsx   # Animated gradient background
  ReactionBar.tsx          # Comment reactions
  CommentBubble.tsx        # Comment display
  CreateThreadModal.tsx    # Thread creation modal
  Avatar.tsx               # User avatar
  DebugOverlay.tsx         # Performance debug overlay

/lib
  ring.ts                  # Toroidal ring generator
  perf.ts                  # WebGL detection & FPS monitoring
  utils.ts                 # Utility functions

/store
  useWeavStore.ts          # Zustand store

/data
  sampleThreads.ts         # Sample data

/styles
  globals.css              # Global styles & Tailwind
```

## 🎯 Key Components

### WeavRing

The 3D ring uses React Three Fiber to render thread nodes in a toroidal ring layout. Nodes are distributed using parametric torus equations for even spacing.

**Features:**
- Drag to rotate (horizontal & vertical, clamped to ±35°)
- Scroll/pinch to zoom
- Click node to view thread detail
- Smooth camera transitions with inertia
- Automatic 2D fallback for non-WebGL devices or poor performance

### RingScene

R3F scene component with:
- Perspective camera (fov=50)
- Custom drag controls with inertia
- Performance monitoring
- Automatic fallback triggering

### ThreadDetailPanel

Slide-in panel (right side on desktop, full-screen on mobile) with:
- Thread header with icon, title, author
- Scrollable comments list
- Reaction bar for each comment
- Fixed reply input at bottom
- Smooth animations (280ms easeOut)

### CreateThreadModal

Glassmorphism modal with:
- Title input (max 60 chars)
- Description textarea (max 400 chars)
- Tag selection chips
- Icon picker
- Success animation on submit

## 🎨 Design System

### Colors

- **Primary Gradient**: `from-[#7F7FFF] via-[#A06CFF] to-[#FF88C6]`
- **Secondary Gradient**: `from-[#00E6FF] via-[#8A9EFF] to-[#C2E9FB]`
- **Nebula Palette**: `#A58CFF`, `#85E1F8`, `#FFB3C6`, `#B8FFD1` (subtle, low-saturation)

### Spacing

All spacing uses Tailwind's 4px grid system (no arbitrary values).

### Typography

- Page titles: `32px / 2rem / font-semibold`
- Section titles: `20px / 1.25rem / font-semibold`
- Body: `16px / 1rem / regular`
- Small/caption: `13px / 0.8125rem / medium`

### Motion

- Spring physics: `stiffness: 240, damping: 28`
- Node hover: `1.00 → 1.12 in 140ms, cubic-bezier(.22,1,.36,1)`
- Node select: `1.00 → 1.14 in 80ms easeOut`
- Camera zoom: `450ms spring (stiffness 400, damping 28)`
- Panel slide: `280ms easeOut`
- Unread pulse: `1.6s loop (ease-in-out)`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure build settings
4. Deploy!

**Build Command**: `npm run build`  
**Output Directory**: `.next`

### Environment Variables

No environment variables required for this UI-first implementation.

### Performance

- 3D WeavRing targets 45-60 FPS on mid-range devices
- Automatic fallback if average FPS < 40 over 2 seconds
- Optimized with React Three Fiber's built-in optimizations
- Automatic 2D fallback for devices without WebGL support

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⌨️ Keyboard Navigation

- **Left/Right Arrow**: Rotate ring in 12° steps
- **Enter/Space**: Select focused node
- **Ctrl+D / Cmd+D**: Toggle debug overlay

## 🔧 Development

### Code Style

- TypeScript strict mode enabled
- ESLint configured for Next.js
- Components are client components where needed (`'use client'`)

### Debug Overlay

Press `Ctrl+D` (or `Cmd+D` on Mac) to toggle the debug overlay showing:
- Current FPS
- Average FPS
- Number of nodes
- Ring rotation
- Camera position
- Angular velocity

### Adding New Features

1. Update Zustand store in `/store/useWeavStore.ts` for new state
2. Add sample data in `/data/sampleThreads.ts` if needed
3. Create components in `/components`
4. Add pages in `/app` directory

## 📝 Notes

- This is a **UI-first implementation** with sample data
- No backend connectivity yet
- All state is managed locally with Zustand
- Threads and comments are stored in memory (reset on refresh)
- Performance monitoring automatically switches to 2D fallback if needed

## 🧪 Testing

Test on the following devices for optimal experience:
- **Desktop**: MacBook Air M1, Windows PC
- **Mobile**: Pixel 6, iPhone SE 2nd gen

## 🤝 Contributing

This is a production-ready template. Feel free to extend it with:
- Backend API integration
- Real authentication
- Database persistence
- Real-time updates
- Advanced 3D effects

## 📄 License

MIT

---

**Built with ❤️ using Next.js 14, React Three Fiber, and Framer Motion**

**Theme: "Mind Garden" — soft bloom, glass surfaces, living gradients**
