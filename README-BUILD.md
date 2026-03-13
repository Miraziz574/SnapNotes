# QuickNotes – Build Instructions

This guide explains how to build **QuickNotes** as a native desktop app (macOS & Windows) using Tauri, and as a native Android app using Capacitor.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18 LTS+ | JavaScript runtime |
| npm | 9+ | Package manager |
| Rust + Cargo | 1.70+ | Tauri desktop backend |
| Android Studio | Hedgehog+ | Android development |
| JDK | 17+ | Android build |

### Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

### Install project dependencies
```bash
npm install
```

---

## Web App (Development)

```bash
npm run dev        # start Vite dev server on http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build locally
```

---

## Desktop Apps (Tauri)

> See [BUILD-MAC.md](./BUILD-MAC.md) and [BUILD-WINDOWS.md](./BUILD-WINDOWS.md) for platform-specific signing details.

### Development (live-reload)
```bash
npm run tauri:dev
```

### Production build (current platform)
```bash
npm run tauri:build
```
Artefacts appear in `src-tauri/target/release/bundle/`.

### Cross-platform builds
| Platform | Command | Output |
|----------|---------|--------|
| macOS universal (M1+Intel) | `npm run tauri:build:mac` | `.dmg` |
| Windows x64 | `npm run tauri:build:windows` | `.exe` (NSIS) |

---

## Android App (Capacitor)

> See [BUILD-ANDROID.md](./BUILD-ANDROID.md) for full APK signing & distribution guide.

### 1. Build the web assets
```bash
npm run build
```

### 2. Sync to the Android project
```bash
npm run android:sync
```

### 3a. Open in Android Studio
```bash
npm run android:open
```

### 3b. Build debug APK from CLI
```bash
npm run android:build:debug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

### 3c. Build signed release APK
```bash
npm run android:build
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### 4. Run on device / emulator
```bash
npm run android:run
```

---

## Project Structure

```
QuickNotes/
├── src/                    # React source (shared web/desktop/mobile)
│   ├── main.tsx
│   └── App.tsx
├── public/                 # Static assets
├── dist/                   # Vite production build output
├── src-tauri/              # Tauri Rust backend
│   ├── src/main.rs         # Rust entry point & Tauri commands
│   ├── Cargo.toml          # Rust dependencies
│   ├── tauri.conf.json     # Tauri app settings
│   ├── build.rs            # Tauri build script
│   └── icons/              # App icon assets
├── android/                # Capacitor Android project
│   ├── app/
│   │   ├── build.gradle    # Android build config
│   │   ├── proguard-rules.pro
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/quicknotes/app/MainActivity.kt
│   │       └── res/        # Drawable, values, xml resources
│   ├── gradle/wrapper/
│   ├── build.gradle
│   ├── gradle.properties
│   └── settings.gradle
├── capacitor.config.json   # Capacitor settings
├── index.html              # Vite HTML entry
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # npm scripts and dependencies
├── README-BUILD.md         # ← You are here
├── BUILD-MAC.md            # macOS signing & distribution
├── BUILD-WINDOWS.md        # Windows installer & signing
└── BUILD-ANDROID.md        # Android APK & Play Store
```

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| `tauri: command not found` | `npm install` then use `npx tauri` |
| Rust not found | Run `rustup update stable` |
| Android build fails | Ensure `ANDROID_HOME` env var is set |
| `adb: device not found` | Enable USB Debugging on device |
| Capacitor sync fails | Run `npm run build` first, then sync |
