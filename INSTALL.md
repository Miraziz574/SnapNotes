# QuickNotes – Installation Guide

Download the latest installer from the [Releases page](../../releases/latest) and follow the steps for your platform.

---

## Table of Contents
- [macOS](#macos)
- [Windows](#windows)
- [Android](#android)
- [System Requirements](#system-requirements)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

---

## macOS

**File:** `QuickNotes-1.0.0-universal.dmg`  
**Supports:** macOS 11 Big Sur or later · Intel & Apple Silicon (M1/M2/M3)

### Steps

1. **Download** `QuickNotes-1.0.0-universal.dmg` from the [Releases page](../../releases/latest).
2. **Open** the DMG file by double-clicking it.
3. In the window that appears, **drag QuickNotes** to the **Applications** folder.
4. **Eject** the DMG (drag it to the Trash or press ⌘E).
5. Open **Applications** (Finder → Go → Applications) and **launch QuickNotes**.

> **First launch tip:** macOS may show a security warning because the app is downloaded from the internet.  
> Right-click (or Control-click) the app icon → **Open** → click **Open** in the dialog.

### Uninstall

Drag `QuickNotes.app` from the Applications folder to the Trash.

---

## Windows

**File:** `QuickNotes-1.0.0-x64-setup.exe`  
**Supports:** Windows 10 (64-bit) or later

### Steps

1. **Download** `QuickNotes-1.0.0-x64-setup.exe` from the [Releases page](../../releases/latest).
2. **Double-click** the installer to start it.
3. Follow the **installation wizard** (click *Next* to accept defaults).
4. Click **Install** and wait for the progress bar to complete.
5. Click **Finish** – a desktop shortcut is created automatically.
6. Launch QuickNotes from the desktop shortcut or the Start menu.

> **SmartScreen notice:** Windows may show a SmartScreen prompt.  
> Click **More info** → **Run anyway** to proceed.

### Uninstall

Open **Settings → Apps → Installed apps**, find *QuickNotes*, click the ⋯ menu, and select **Uninstall**.

---

## Android

**File:** `QuickNotes-1.0.0-release.apk`  
**Supports:** Android 8.0 (Oreo, API 26) or later

### Steps

1. **Download** `QuickNotes-1.0.0-release.apk` from the [Releases page](../../releases/latest).
   - You can download directly on your device using its browser, or transfer the file from your computer via USB / cloud storage.
2. Open the **Files** (or My Files) app on your Android device and navigate to the downloaded APK.
3. **Tap the APK file** to start installation.
4. If prompted, enable **Install from unknown sources**:
   - Android 8+: tap **Settings** in the prompt → enable *Allow from this source* → go back and tap **Install**.
5. Tap **Install** and wait for the installation to complete.
6. Tap **Open** or find QuickNotes in your app drawer.

> **Security note:** The APK is unsigned. Only install APKs you trust and have downloaded from the official Releases page.

### Uninstall

Long-press the QuickNotes icon in your app drawer → **Uninstall** (or go to Settings → Apps → QuickNotes → Uninstall).

---

## System Requirements

| Platform | Requirement |
|----------|-------------|
| **macOS** | macOS 11 Big Sur or later, 64-bit (Intel or Apple Silicon) |
| **Windows** | Windows 10 (64-bit) or later |
| **Android** | Android 8.0 (API 26) or later |

---

## FAQ

**Q: Is QuickNotes free?**  
A: Yes, QuickNotes is free and open-source.

**Q: Can I use QuickNotes offline?**  
A: Yes, all notes are stored locally on your device.

**Q: Where are my notes stored?**  
A: Notes are stored in the application's local data directory on each platform.

**Q: Will my notes sync across devices?**  
A: Cross-device sync is planned for a future release.

---

## Troubleshooting

### macOS – "App is damaged and can't be opened"
Run the following command in Terminal and try again:
```bash
xattr -cr /Applications/QuickNotes.app
```

### Windows – Installer blocked by antivirus
Some antivirus programs may flag unsigned installers. Temporarily disable real-time protection, run the installer, then re-enable protection.

### Android – "App not installed"
- Make sure you have enough storage space.
- Check that *Install from unknown sources* is enabled for the app you used to open the APK.
- Try downloading the APK again – the file may have been corrupted.

---

## Support

- 🐛 **Bug reports & feature requests:** [Open an issue](../../issues)
- 💬 **Questions:** [Start a discussion](../../discussions)
