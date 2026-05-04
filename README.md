# 🪨 Ruins Writer

A browser-based inscription tool for composing mystical rune layouts. Add, arrange, rotate, scale, and export rune symbols onto a parchment canvas.

---

## 🗂️ Project Structure

```
ruins-writer/
├── index.html          ← Main page
├── style.css           ← Ancient parchment theme
├── app.js              ← Application logic
├── symbols.js          ← Symbol registry (edit to add your images)
└── assets/
    └── symbols/
        ├── knowledge/  ← Knowledge rune images (.png)
        ├── life/       ← Life rune images (.png)
        ├── light/      ← Light rune images (.png)
        ├── memory/     ← Memory rune images (.png)
        ├── sound/      ← Sound rune images (.png)
        ├── space/      ← Space rune images (.png)
        └── time/       ← Time rune images (.png)
```

---

## 🖼️ Adding Your Symbol Images

All symbol images go into **`assets/symbols/<category>/`**.

### Steps:
1. Export your symbol as a **PNG** (transparent background recommended, ideally 128×128px or larger).
2. Name the file **exactly** as listed in `symbols.js` — for example:
   - `assets/symbols/knowledge/arcane_script.png`
   - `assets/symbols/life/bloom_mark.png`
3. Push to GitHub. The site will automatically display your images.

### File naming reference:

Each category has **22 placeholder slots** pre-defined in `symbols.js`. The filenames are:

#### `knowledge/`
`arcane_script.png`, `bound_tome.png`, `cipher_lock.png`, `crescent_eye.png`, `deep_glyph.png`, `elder_mark.png`, `forbidden_seal.png`, `grand_lexicon.png`, `hidden_word.png`, `index_rune.png`, `judgment_sigil.png`, `key_of_knowing.png`, `lore_spiral.png`, `minds_eye.png`, `null_cipher.png`, `omen_glyph.png`, `pillar_of_truth.png`, `query_mark.png`, `relic_script.png`, `scholars_brand.png`, `tome_ward.png`, `unseen_verse.png`

#### `life/`
`bloom_mark.png`, `blood_sigil.png`, `breath_rune.png`, `cycle_glyph.png`, `deep_root.png`, `ember_seed.png`, `fern_spiral.png`, `growth_brand.png`, `heartbeat_seal.png`, `ikara_mark.png`, `joining_knot.png`, `kin_brand.png`, `living_coil.png`, `mending_sigil.png`, `nest_rune.png`, `origin_glyph.png`, `pulse_mark.png`, `quicken_seal.png`, `renewal_brand.png`, `sap_glyph.png`, `thorn_ring.png`, `vitae_knot.png`

#### `light/`
`aurora_mark.png`, `beacon_sigil.png`, `brilliance_rune.png`, `corona_glyph.png`, `dawn_brand.png`, `eclipse_seal.png`, `flare_mark.png`, `gilded_eye.png`, `halo_rune.png`, `ignition_sigil.png`, `judgment_ray.png`, `kindle_mark.png`, `lumen_brand.png`, `midnight_ward.png`, `nimbus_glyph.png`, `optic_seal.png`, `photon_ring.png`, `quasar_mark.png`, `radiant_cross.png`, `solar_brand.png`, `twilight_sigil.png`, `zenith_rune.png`

#### `memory/`
`amber_lock.png`, `bond_glyph.png`, `chronicle_seal.png`, `dream_brand.png`, `echo_rune.png`, `fade_mark.png`, `ghost_imprint.png`, `hollow_sigil.png`, `impression_glyph.png`, `journal_knot.png`, `keep_seal.png`, `lost_thread.png`, `mirror_brand.png`, `nostalgia_mark.png`, `omen_trace.png`, `past_sigil.png`, `quill_brand.png`, `remnant_glyph.png`, `soul_print.png`, `trace_mark.png`, `vestige_rune.png`, `witness_seal.png`

#### `sound/`
`bell_glyph.png`, `call_rune.png`, `chord_brand.png`, `discord_seal.png`, `echo_mark.png`, `frequency_glyph.png`, `groan_sigil.png`, `harmonic_brand.png`, `infra_rune.png`, `jangle_mark.png`, `keen_howl.png`, `low_drone.png`, `mute_glyph.png`, `note_seal.png`, `overtone_brand.png`, `pulse_rune.png`, `quake_mark.png`, `resonance_sigil.png`, `silence_brand.png`, `thunder_glyph.png`, `undertone_mark.png`, `vibration_rune.png`

#### `space/`
`abyss_glyph.png`, `boundary_seal.png`, `corridor_brand.png`, `depth_rune.png`, `expanse_mark.png`, `fold_sigil.png`, `gap_glyph.png`, `hollow_brand.png`, `interval_rune.png`, `junction_mark.png`, `knot_seal.png`, `liminal_glyph.png`, `meridian_brand.png`, `nexus_sigil.png`, `orbit_rune.png`, `portal_mark.png`, `quadrant_glyph.png`, `rift_brand.png`, `span_seal.png`, `threshold_rune.png`, `void_mark.png`, `warp_sigil.png`

#### `time/`
`age_brand.png`, `blink_rune.png`, `chronicle_glyph.png`, `decay_mark.png`, `epoch_seal.png`, `flow_brand.png`, `glacial_sigil.png`, `hasten_rune.png`, `interval_glyph.png`, `junction_mark.png`, `kin_of_hours.png`, `loop_seal.png`, `moment_brand.png`, `now_glyph.png`, `old_tongue.png`, `pause_rune.png`, `quicksand_mark.png`, `revert_sigil.png`, `slow_brand.png`, `tide_glyph.png`, `unend_seal.png`, `vestiges_rune.png`

---

## ➕ Adding More Symbols

To add a symbol beyond the 22 placeholders, open `symbols.js` and add an entry to the array:

```js
{ id: "kn_23", label: "Your Symbol Name", src: "assets/symbols/knowledge/your_file.png" },
```

---

## 🛠️ Features

| Feature | Details |
|---|---|
| **7 Categories** | Knowledge, Life, Light, Memory, Sound, Space, Time |
| **22 symbols each** | 154 total placeholder slots |
| **Drag & Drop** | Freely move symbols around the board |
| **Arrow Key Movement** | Arrow keys move selected symbol |
| **Rotation** | ↺ / ↻ buttons or `[` / `]` keys |
| **Scale** | + / − buttons or keyboard `+` / `-` |
| **Delete** | ✕ button on hover, or `Delete` / `Backspace` key |
| **Inscription Details** | Name, description, author, classification |
| **Export PNG** | Flat raster export with name watermark |
| **Export SVG** | Vector export with image references |
| **Save JSON** | Full state save including all positions/rotations |
| **Load JSON** | Restore a previously saved inscription |

---

## 🌐 Deployment (GitHub Pages)

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to **`main` branch / root folder**.
4. Your site will be live at `https://yourusername.github.io/ruins-writer/`.

> ⚠️ **Note:** PNG export requires symbols to be served from the same origin (or have CORS headers). When running locally via `file://`, PNG export may be blocked by the browser. Use a local server (`npx serve .`) or deploy to GitHub Pages.

---

## 🎨 Customization

- **Colors / Theme:** Edit CSS variables at the top of `style.css`
- **Board size:** The whiteboard scales to available space automatically
- **Move step size:** Edit `MOVE_STEP` in `app.js` (default: 10px)
- **Rotation step:** Edit `ROTATE_STEP` in `app.js` (default: 15°)

---

## 📜 License

MIT — free to use and modify.
