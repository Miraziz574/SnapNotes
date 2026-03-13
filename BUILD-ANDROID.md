# Building QuickNotes for Android

This guide covers building a signed APK for distribution and running on devices/emulators.

---

## Requirements

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18 LTS+ | |
| Android Studio | Hedgehog (2023.1.1)+ | Includes SDK & emulator |
| JDK | 17 | Bundled with Android Studio |
| Android SDK | API 34 | Target SDK |
| Android SDK | API 26 | Min SDK (Android 8.0) |

---

## 1. Environment Setup

### Set ANDROID_HOME
```bash
# macOS / Linux (~/.bashrc or ~/.zshrc)
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin"

# Windows (PowerShell)
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools\bin"
```

### Accept SDK licences
```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
```

---

## 2. Install Project Dependencies

```bash
npm install
```

---

## 3. Build Web Assets

```bash
npm run build
```

---

## 4. Sync to Android Project

```bash
npm run android:sync
# Equivalent to: npx cap sync android
```

This copies `dist/` into the Android project's web assets.

---

## 5. Development: Run on Device / Emulator

### Option A – Android Studio (recommended for UI work)
```bash
npm run android:open
```
Then press ▶ in Android Studio to build and run.

### Option B – CLI
```bash
npm run android:run
```
Capacitor auto-detects connected devices and emulators.

---

## 6. Build Debug APK

```bash
npm run android:build:debug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

Install on device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 7. Build Signed Release APK

### 7a. Generate a keystore (first time only)
```bash
keytool -genkey -v \
  -keystore quicknotes.jks \
  -alias quicknotes \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
**Keep `quicknotes.jks` secure – it cannot be recovered if lost.**

### 7b. Configure signing

**Option 1 – Gradle properties file** (`android/gradle.properties`):
```properties
KEYSTORE_FILE=../../quicknotes.jks
KEYSTORE_PASSWORD=your_store_password
KEY_ALIAS=quicknotes
KEY_PASSWORD=your_key_password
```

**Option 2 – Environment variables** (recommended for CI):
```bash
export KEYSTORE_FILE=/path/to/quicknotes.jks
export KEYSTORE_PASSWORD=your_store_password
export KEY_ALIAS=quicknotes
export KEY_PASSWORD=your_key_password
```

### 7c. Build release APK
```bash
npm run android:build
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 8. App Permissions

The app requests the following permissions (see `AndroidManifest.xml`):

| Permission | Usage |
|------------|-------|
| `INTERNET` | Load web assets in WebView |
| `CAMERA` | Capture photos for notes |
| `READ_EXTERNAL_STORAGE` | Import notes files (Android ≤ 12) |
| `WRITE_EXTERNAL_STORAGE` | Export notes files (Android ≤ 9) |
| `READ_MEDIA_IMAGES` | Access photos (Android 13+) |
| `POST_NOTIFICATIONS` | Local note reminders |
| `VIBRATE` | Haptic feedback |

---

## 9. App Icons & Splash Screen

Place custom icons in `android/app/src/main/res/mipmap-*/`:

| Folder | Size |
|--------|------|
| `mipmap-mdpi` | 48×48 px |
| `mipmap-hdpi` | 72×72 px |
| `mipmap-xhdpi` | 96×96 px |
| `mipmap-xxhdpi` | 144×144 px |
| `mipmap-xxxhdpi` | 192×192 px |

Splash screen colour is set to `#2d3748` in `res/values/colors.xml`.

---

## 10. Distribution

- **Direct download**: Share the `.apk` file. Users must enable *Install from unknown sources*.
- **Google Play Store**: Sign with the release keystore, then upload via [Google Play Console](https://play.google.com/console).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ANDROID_HOME not set` | Export the env variable (see Step 1) |
| `No connected devices` | Start an AVD emulator or connect a physical device with USB Debugging |
| `Gradle build fails` | Run `cd android && ./gradlew clean` then retry |
| `Keystore not found` | Check `KEYSTORE_FILE` path |
| Camera permission denied | User must grant permission at runtime |
