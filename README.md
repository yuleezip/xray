# Xray — V3 live preview

The Xray mode renders the simulated skeletal overlay **live on every camera preview frame**, without taking a photo. `ORIGINAL` presents an unmodified camera preview with no bone overlay. The header reads `Xray`.

## GitHub Pages

Replace the files in the existing `yuleezip/xray` local repository (keep its `.git` directory). Then:

```sh
git add .
git commit -m "Live Xray preview and title update"
git push
```

GitHub → Settings → Pages → Source: **GitHub Actions**. Test at https://yuleezip.github.io/xray/ on iPhone Safari over HTTPS. The camera requires permission; the pose model needs internet to load. The skeleton is illustrative, not a true X-ray.
