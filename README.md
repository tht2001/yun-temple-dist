# Yun Temple / 云寺

Original, local single-player Three.js experience. All geometry is authored with primitives and audio is synthesized with Web Audio. No source-site assets or services are used.

Run `npm run dev`. Production: `npm run build`, then `npm run preview`. The build uses only Node.js and writes the static site to `dist/`; no package installation is required. Three.js 0.170.0 is included locally in `vendor/` under its MIT license, so the scene requires no external downloads.

## State interface
`state.js` owns avatar identity, language, position, target, cushion occupancy, current action and bead count. `emit({type, ...payload})` applies an event; `subscribe(listener)` observes events. Events: `language`, `walk` (with `position: {x,z}`), `palms`, `bow`, `fish`, `bead`, `tick`. A future transport can broadcast these events and hydrate state independently of `main.js`, which renders the scene. The rendering loop emits `tick` events with `dt` (seconds) and `now` (milliseconds); state.js owns movement, arrival, and action completion. Cushions are reserved on bow and released on completion or interruption. Only the local avatar’s reservations are released. Bead count cycles after 108.

## Checklist
- [x] Original wooden hall, primitive golden statue, courtyard, pond and moon
- [x] Random child monk and bilingual dharma name
- [x] Chinese default and English toggle
- [x] Drag camera and tap ground movement
- [x] Four practice controls and automatic cushion approach
- [x] Separate synthesized audio toggles and volume controls
- [x] Daily practice times, no backend or account flows
- [x] JavaScript syntax checks
- [x] State checks: bow arrival/completion, cushion ownership, interruption, walking, 108-bead cycle, and language toggle
- [x] Translated audio accessibility labels, touch cancellation, keyboard focus, and short-screen layout
- [x] Dependency-free production build creates `dist/`
- [ ] Browser visual and interaction verification

## Resume note
The resumed work fixed action timers, cancelled cushion approaches when switching actions, moved the correct hand for palms together, and put movement/action transitions in state.js. Removed the external font request so typography uses system fonts.

Verification: `node --check main.js` and `node --check state.js` pass. Node assertion checks of the state transitions listed above pass. The production build now uses Node.js to copy the application into `dist/`, with a local Three.js import map. `npm run build` succeeds without network access.

Build repair: replaced the unavailable Vite install with a Node.js static build and local preview server. Included the unmodified MIT-licensed Three.js r170 module and license in `vendor/`. Browser captures now show the 3D scene and translated controls at mobile size. The reference comparison also requests Korean source-site menus; those conflict with the requested original Chinese/English demo and are not part of this build repair.
