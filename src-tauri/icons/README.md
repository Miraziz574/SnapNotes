# Tauri App Icons

This directory contains the app icon assets required by Tauri for bundling desktop apps.

## Required Files

| File | Size | Usage |
|------|------|-------|
| `32x32.png` | 32×32 px | System tray (Windows/Linux) |
| `128x128.png` | 128×128 px | App icon (Linux) |
| `128x128@2x.png` | 256×256 px | App icon @2x (macOS) |
| `icon.icns` | Multi-size | macOS app icon |
| `icon.ico` | Multi-size | Windows app icon |

## Generating Icons

Use the Tauri CLI to auto-generate all icon sizes from a single 1024×1024 PNG:

```bash
npx tauri icon path/to/your-icon-1024.png
```

This generates all required formats automatically.

Alternatively, place your app icon as `public/icon.svg` (already present) and convert it:

```bash
# Install imagemagick for conversion
# macOS:  brew install imagemagick
# Ubuntu: apt-get install imagemagick

convert public/icon.svg -resize 1024x1024 /tmp/icon-1024.png
npx tauri icon /tmp/icon-1024.png
```
