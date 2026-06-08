# SDLPAL Web

Static GitHub Pages package for SDLPAL WebAssembly.

This build uses browser-native MP4 playback for the original Win95 AVI cutscenes:
`PAL_PlayAVI("1.avi")` maps to `data/1.mp4` in the Emscripten build.
Native/macOS builds still use the original AVI decoder.

## Run locally

```bash
python3 -m http.server 8000
open http://localhost:8000/
```

The page automatically downloads files from `data/` into browser IndexedDB on first run.

## GitHub Pages

Push this directory to a repository and enable Pages for the branch/root.

> Note: Original game data is copyrighted. Only publish this repository if you have the rights to distribute the bundled data.
