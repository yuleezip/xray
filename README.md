# XRAY Camera PWA — GitHub Pages version

Simulated skeleton camera effect (not a medical X-ray).

## Upload & publish on GitHub only
1. Create a **public** GitHub repository named `xray-camera-pwa` (or another name). Do not initialize it with README.
2. Unzip this project. Open Terminal in its root folder, then run:
   ```sh
   git init
   git add .
   git commit -m "Initial XRAY PWA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/xray-camera-pwa.git
   git push -u origin main
   ```
   Replace YOUR_USERNAME (and repository name, if changed). GitHub authentication is required. Alternatively upload the project **contents** using GitHub's Add file > Upload files; hidden `.github/workflows/deploy.yml` may need to be added using the GitHub web editor.
3. GitHub repository > Settings > Pages > Build and deployment > Source: **GitHub Actions**.
4. Repository > Actions > Deploy XRAY Camera to GitHub Pages. After successful deployment, open `https://YOUR_USERNAME.github.io/xray-camera-pwa/` on iPhone Safari, allow camera access.
5. Safari Share > Add to Home Screen.

The build workflow automatically uses the actual repo name as its Vite/PWA base path. You do not need to edit `vite.config.js`.

## Local desktop test
Requires Node.js 20.19+ or Node.js 22+.
```sh
npm install
npm run dev
```
Open the displayed localhost URL on your Mac. For iPhone camera testing use the HTTPS GitHub Pages URL. GitHub repository code view alone will not execute the React app.

## Caveats
- First use needs an internet connection to fetch MediaPipe model/WASM.
- Skeleton is a generated illustration aligned to pose landmarks; not real internal imaging.
- iPhone Safari performance depends on the phone and lighting. Not validated on real device.
- GitHub Pages may be unavailable for private repositories depending on account plan.
