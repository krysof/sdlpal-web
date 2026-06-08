# Publish to GitHub Pages

```bash
cd /Volumes/2TB/Source/golang/PAL/sdlpal-gh-pages
git init
git add .
git commit -m "Publish SDLPAL Web MP4"
git branch -M main
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Then in GitHub:

1. Repository → Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, folder: `/root`
4. Open: `https://YOUR_USER.github.io/YOUR_REPO/`

Notes:

- AVI cutscenes were transcoded to H.264/AAC MP4.
- Largest file is now below 50MiB, so GitHub should not warn about oversized files.
- Do not use the GitHub web UI uploader for many files; use `git push`.
- Original game data is copyrighted. Only publish if you have distribution rights or keep the repository private/internal.
