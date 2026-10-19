# Omar — Creative Web Developer Portfolio

A personal portfolio built with **Vite**, **Three.js**, **GSAP & ScrollTrigger**, and **Lenis** smooth scrolling.

## 🚀 Features

- **Cinematic Welcome Intro**:
  - Interactive 3D morphing core and particle field reacting to mouse movement.
  - Smooth progress counter and stylized typography reveal.
  - Warp-out portal transition into the main portfolio.
  - `sessionStorage` support: plays once per session with an instant "Skip Intro" option and a "Replay Intro" button in the contact section.
- **Interactive 3D Elements**:
  - **Hero Centerpiece**: 3D geometric artifact with orbital rings, core gem, orbiting nodes, and drag/inertia interaction.
  - **About Constellation**: Orbiting 3D skills satellite system with real-time tag synchronization.
- **Motion & Interaction**:
  - Custom dynamic cursor with magnetic attraction on buttons, tags, and links.
  - Lenis smooth inertia scroll synchronized with GSAP ScrollTrigger.
  - 3D card tilt with perspective and lighting on hover.
  - Responsive floating navigation bar with scrollspy link highlighting.
- **Showcase Sections**:
  - **Client Work**: Real delivered projects (Aya Accessories, Festival Five Star Pastry).
  - **Ready-Made Designs**: Fast-delivery customizable concept platforms (Elmo7taref Restaurant, Kayan Luxury Fashion, El Veranda Workspace).
  - **Services**: 4 clear, honest offerings (Website from Scratch, Bug Fixing & Repairs, Site Customization & Edits, Animations & 3D Polish).
  - **Process**: Brief → Design → Build → Launch timeline.
  - **Contact**: Direct WhatsApp (`01221576360`), phone, email (`om058166@gmail.com`), Instagram (`@omar_thegratt`), one-click copy buttons with toasts, and an interactive form with confetti celebration.

## 🛠️ Tech Stack

- **Framework / Bundler**: Vite
- **3D Graphics**: Three.js
- **Animations**: GSAP + ScrollTrigger
- **Smooth Scrolling**: Lenis
- **Confetti**: canvas-confetti
- **Typography**: Syne, Space Grotesk, Inter, Cairo, JetBrains Mono
- **Hosting Ready**: Vercel

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deploy to Vercel

Push to GitHub and import into Vercel, or run:
```bash
npx vercel
```
Vercel will automatically detect `vite` and output to `dist`.
