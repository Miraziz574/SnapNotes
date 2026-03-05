# Building QuickNotes for Windows

This guide covers building, code-signing, and distributing the Windows `.exe` installer.

---

## Requirements

- Windows 10/11 or a CI runner with Windows environment
- [Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) with **Desktop development with C++**
- [Rust](https://rustup.rs/) (MSVC toolchain): `rustup target add x86_64-pc-windows-msvc`
- WebView2 (pre-installed on Windows 10 20H2+, otherwise bundled by Tauri)
- Node.js 18 LTS+

---

## 1. Install Dependencies

```powershell
npm install
```

---

## 2. Development Build (live-reload)

```powershell
npm run tauri:dev
```

---

## 3. Production Build

```powershell
npm run tauri:build:windows
# Equivalent to: tauri build --target x86_64-pc-windows-msvc
```

Build artefacts in:
```
src-tauri\target\x86_64-pc-windows-msvc\release\bundle\
├── nsis\QuickNotes_1.0.0_x64-setup.exe   ← NSIS installer
└── msi\QuickNotes_1.0.0_x64_en-US.msi   ← MSI installer
```

---

## 4. Code Signing

### Using a Code Signing Certificate

1. Obtain an **Authenticode** certificate (EV or standard) from a CA such as DigiCert, Sectigo, or GlobalSign.
2. Set environment variables:

```powershell
$env:TAURI_PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----..."
$env:TAURI_KEY_PASSWORD = "your-key-password"
```

For `.pfx` file signing, set in `tauri.conf.json`:
```json
"windows": {
  "certificateThumbprint": "YOUR_CERT_THUMBPRINT",
  "digestAlgorithm": "sha256",
  "timestampUrl": "http://timestamp.digicert.com"
}
```

---

## 5. NSIS Installer Features

The NSIS installer (`*-setup.exe`) provides:
- ✅ **Desktop shortcut** creation (optional during install)
- ✅ **Start menu** entry
- ✅ **System tray** on first launch
- ✅ **Uninstaller** registered in Control Panel
- ✅ **Auto-update** support via Tauri updater
- ✅ Windows 10+ target (WebView2 requirement)

---

## 6. System Tray

The app shows a system tray icon with:
- **Show QuickNotes** – brings window to front
- **Hide** – minimises to tray
- **Quit** – exits the app

This is configured in `src-tauri/src/main.rs`.

---

## 7. Auto-Update

Configure the update endpoint in `tauri.conf.json`:
```json
"updater": {
  "active": true,
  "dialog": true,
  "endpoints": ["https://releases.quicknotes.app/{{target}}/{{arch}}/{{current_version}}"],
  "pubkey": "<YOUR_TAURI_UPDATER_PUBKEY>"
}
```

Generate keys: `npx tauri signer generate -w ~/.tauri/quicknotes.key`

---

## 8. Distribution

- Distribute `QuickNotes_1.0.0_x64-setup.exe` directly.
- Upload to GitHub Releases for auto-update support.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `MSVC not found` | Install Visual Studio Build Tools with C++ workload |
| WebView2 missing | Add `"windowsRuntime": "fixedVersion"` in Tauri bundle config |
| Signing fails | Ensure certificate is trusted and timestamp URL is reachable |
| App blocked by SmartScreen | Sign with EV certificate or submit for Microsoft reputation analysis |
