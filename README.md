# Xray v2.3 — Self-hosted pose tracking

This release fixes the previous `CPU: undefined | GPU: undefined` report by preserving JavaScript and MediaPipe thrown errors, pinning the npm package to the same version as the local WASM assets, and building the task model into GitHub Pages.

## Deploy to your existing yuleezip/xray repository

Replace the contents of your existing checkout with this archive (keep your `.git` folder), then:

```bash
cd ~/Downloads/xray-camera-pwa-github-pages
git add .
git commit -m "Self-host MediaPipe model and fix Xray tracker"
git push
```

GitHub Actions runs `npm run build`, which copies WASM from installed npm package and downloads the task model into `public/models` at build time. The iPhone then loads both from `https://yuleezip.github.io/xray/`. A build requires GitHub Actions network access to Google's model asset.

After deployment use Safari (not home screen shortcut) and refresh. Grant camera permission. Point camera at an entire person. The visual overlay is illustrative, not medical imaging.

If the model fails, capture the new full error message on screen.
