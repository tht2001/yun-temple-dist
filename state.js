const names = [['清风', 'Clear Wind'], ['明月', 'Bright Moon'], ['静莲', 'Quiet Lotus'], ['云心', 'Cloud Heart']];
export const state = {
  language: 'zh',
  avatar: {id: crypto.randomUUID(), name: names[Math.floor(Math.random() * names.length)], robe: Math.random() > .5 ? 0x9b7350 : 0x879783},
  position: {x: 0, z: 7}, target: null,
  cushions: Array.from({length: 6}, (_, id) => ({id, occupant: null})),
  action: 'idle', beads: 0, actionUntil: 0
};
const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function releaseCushions() { state.cushions.forEach(c => { if (c.occupant === state.avatar.id) c.occupant = null; }); }
export function emit(event) {
  const now = event.now ?? performance.now();
  switch (event.type) {
    case 'language': state.language = state.language === 'zh' ? 'en' : 'zh'; break;
    case 'walk':
      if (!Number.isFinite(event.position?.x) || !Number.isFinite(event.position?.z)) return;
      releaseCushions();
      state.target = {x: Math.max(-5, Math.min(5, event.position.x)), z: Math.max(-5, Math.min(17, event.position.z))};
      state.action = 'walk'; state.actionUntil = Infinity; break;
    case 'bow': {
      const cushion = state.cushions.find(c => c.occupant === state.avatar.id) || state.cushions.find(c => !c.occupant);
      if (!cushion) return;
      cushion.occupant = state.avatar.id;
      state.target = {x: (cushion.id % 3 - 1) * 1.8, z: -2 + Math.floor(cushion.id / 3) * 1.7};
      state.action = 'bow'; state.actionUntil = Infinity; break;
    }
    case 'palms': case 'fish': case 'bead':
      state.target = null; releaseCushions(); state.action = event.type;
      if (event.type === 'bead') state.beads = state.beads % 108 + 1;
      state.actionUntil = now + (event.type === 'bead' ? 800 : 2200); break;
    case 'tick': {
      const dt = Math.max(0, Math.min(event.dt || 0, .05));
      if (state.target) {
        const dx = state.target.x - state.position.x, dz = state.target.z - state.position.z, distance = Math.hypot(dx, dz);
        if (distance <= Math.max(.08, dt * 2.8)) {
          state.position = {...state.target}; state.target = null;
          if (state.action === 'bow') state.actionUntil = now + 3000;
          else { state.action = 'idle'; state.actionUntil = 0; }
        } else {
          state.position.x += dx / distance * dt * 2.8;
          state.position.z += dz / distance * dt * 2.8;
        }
      }
      if (state.action !== 'idle' && now >= state.actionUntil) {
        state.action = 'idle'; state.actionUntil = 0; releaseCushions();
      }
      break;
    }
    default: return;
  }
  listeners.forEach(fn => fn(state, event));
}
