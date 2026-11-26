# Tessera High-Res • Community Cart Showcase & Store

[![Deploy Showcase to GitHub Pages](https://github.com/stephenwil/tessera-showcase/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/stephenwil/tessera-showcase/actions/workflows/deploy-pages.yml)

Welcome to the **Tessera High-Res Cartridge Showcase & Community Store**!

👉 **[Play Live in Browser (Zero Install)](https://stephenwil.github.io/tessera-showcase/)**

![Tessera Showcase Banner](assets/tessera-banner.png)

---

## What is Tessera High-Res?

Tessera is an original 3D voxel fantasy console:
- **Display:** 768×432 widescreen
- **Volume:** 256×256×128 voxel volume (8 MiB composited frame)
- **Renderer:** WebGL2 full-screen fragment raymarching
- **Scripting:** Lua 5.4 in WebAssembly
- **Sound:** Built-in 4-channel retro synthesizer
- **Cartridge Format:** Plain UTF-8 `.tess` text and steganographic `.tess.png` picture cartridges.

---

## Featured Cartridges in this Showcase

1. **Hat Chase** (*Stephen Wilson*) — Open-world beach exploration and runaway hat chase across three times of day.
2. **Turbo Circuit** — High-speed 3D arcade voxel racer with engine sound synth and lap timing.
3. **Bastion Siege** — 3D tactical voxel fortress defense with projectile arcs and aerial strikes.
4. **Crypt of the Voxel** — Atmospheric 3D dungeon crawler with dynamic torchlight shadows and keys.
5. **Void Drifter** — 3D space flight dodging procedural voxel asteroids with particle thrusters.
6. **Relic Shifter** — Spatial voxel puzzle challenge manipulating ancient magnetic stone blocks.
7. **Moonlit Garden** — Peaceful scenic diorama with fireflies and ambient night synth.
8. **Prism Relay** — 3D laser refraction puzzle using reflective voxel prisms.
9. **Bench & Hello** — Hardware benchmarks and clean starter boilerplate.

---

## Controls

| Action | Keyboard | Gamepad | Touch |
| :--- | :--- | :--- | :--- |
| **Move / Navigate** | WASD or Arrow Keys | Left Stick / D-Pad | Touch Stick |
| **A Button (Jump / Select)** | Z or Space | South Button (A) | A Button |
| **B Button (Action / Back)** | X or E | East Button (B) | B Button |
| **Pause Menu** | Enter or Esc | Start Button | Pause Icon |
| **In-Browser Code Editor** | **F4** | Pause Menu -> Edit | Pause Menu -> Edit |
| **Fullscreen** | **F** | - | - |

---

## Picture Carts (.tess.png)

Cartridges for Tessera can be shared as images! The complete game code and voxel models are deflate-compressed and embedded into the lowest 2 bits of the 256×256 RGBA label art.

**To play a picture cart:**
- Drag and drop any `.tess.png` image directly onto the [Showcase Webpage](https://stephenwil.github.io/tessera-showcase/) and it starts playing immediately!

---

## Submitting Your Cartridge

Have you made a 3D voxel cart for Tessera? We would love to feature it!

1. Open a **[Cart Submission Issue](https://github.com/stephenwil/tessera-showcase/issues/new?template=submit-cart.yml)**.
2. Paste your `.tess` code or attach your `.tess.png` picture cart.
3. Once reviewed, your game will be added directly to the live showcase store!


---

## Documentation & Developer Guide

Looking for full hardware specifications, memory architecture, and Lua 5.4 API documentation?
- 📖 **[Console & API Developer Guide](https://stephenwil.github.io/tessera-showcase/guide.html)** — Comprehensive reference on voxel volumes, 3D coordinate frames, raymarching pipeline, and built-in API functions.

---

## Build Your Own Cart (npm & MCP)

Develop locally with live reload, `.vox` import, `.tess.png` packing, offline HTML export, and an MCP server for AI coding agents:

```sh
npm create @stephenwil/tessera@latest my-game
cd my-game
npm install
npm run dev
```

Download any demo `.tess` or `.tess.png` from the [Showcase](https://stephenwil.github.io/tessera-showcase/) and open it directly with `npx @stephenwil/tessera@latest dev path/to/cart.tess`.
