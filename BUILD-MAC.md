# Building QuickNotes for macOS

This guide covers building, code-signing, and distributing the macOS `.dmg` installer.

---

## Requirements

- macOS 12+ build machine (Monterey or later recommended)
- Xcode 14+ with Command Line Tools: `xcode-select --install`
- Rust toolchain: `rustup target add aarch64-apple-darwin x86_64-apple-darwin`
- Apple Developer account (for notarization)

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Development Build (live-reload)

```bash
npm run tauri:dev
```

The app opens with hot-reload. Rust code changes require a full rebuild.

---

## 3. Production Build

### Universal binary (Apple Silicon + Intel)
```bash
npm run tauri:build:mac
# Equivalent to: tauri build --target universal-apple-darwin
```

### Intel only
```bash
npx tauri build --target x86_64-apple-darwin
```

### Apple Silicon only
```bash
npx tauri build --target aarch64-apple-darwin
```

Build artefacts are in:
```
src-tauri/target/universal-apple-darwin/release/bundle/
├── dmg/QuickNotes_1.0.0_universal.dmg   ← installer
└── macos/QuickNotes.app                  ← app bundle
```

---

## 4. Code Signing

### Prerequisites
1. In [Apple Developer Portal](https://developer.apple.com), create a **Developer ID Application** certificate.
2. Export it to your Keychain.
3. Get your **Signing Identity**: `security find-identity -v -p codesigning`

### Set signing identity in `tauri.conf.json`
```json
"macOS": {
  "signingIdentity": "Developer ID Application: Your Name (XXXXXXXXXX)"
}
```

Or set via environment variable (recommended for CI):
```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (XXXXXXXXXX)"
```

---

## 5. Notarization

Notarization allows macOS Gatekeeper to accept your app without warnings.

### Set credentials
```bash
export APPLE_ID="your@apple.id"
export APPLE_PASSWORD="xxxx-xxxx-xxxx-xxxx"   # App-specific password
export APPLE_TEAM_ID="XXXXXXXXXX"
```

### Enable in `tauri.conf.json`
```json
"macOS": {
  "signingIdentity": "Developer ID Application: ...",
  "notarizationAppleId": "your@apple.id",
  "notarizationTeamId": "XXXXXXXXXX",
  "notarizationPassword": "@env:APPLE_PASSWORD"
}
```

Tauri automatically submits to Apple's notarization service and staples the ticket.

---

## 6. Distribution

After a successful build:
- Distribute `QuickNotes_1.0.0_universal.dmg` directly (drag-to-Applications).
- Upload to GitHub Releases for auto-update support.

### Auto-update
The app is configured to check for updates at:
```
https://releases.quicknotes.app/{{target}}/{{arch}}/{{current_version}}
```
Set `"updater.pubkey"` in `tauri.conf.json` to your Tauri updater public key.

---

## Minimum macOS Version

The app targets **macOS 10.13 (High Sierra)** and later as set in:
```json
"macOS": { "minimumSystemVersion": "10.13" }
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `error: could not find Xcode` | Run `xcode-select --install` |
| Universal binary fails | `rustup target add aarch64-apple-darwin x86_64-apple-darwin` |
| Notarization timeout | Check Apple's system status page |
| Gatekeeper blocks app | Ensure notarization completed successfully |
