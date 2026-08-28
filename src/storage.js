/**
 * Storage adapter.
 *
 * The app was originally built inside a Claude artifact, which provides a
 * `window.storage` key/value API. Outside that environment we fall back to
 * localStorage with the same async shape, so the component code is unchanged.
 *
 * To move to a real backend (Supabase, Firebase, your own API), swap the
 * bodies of get/set/remove/list — the signatures are all you need to keep.
 */

const PREFIX = "padel:";

export const storage = {
  async get(key) {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    return { key, value: raw };
  },

  async set(key, value) {
    localStorage.setItem(PREFIX + key, value);
    return { key, value };
  },

  async remove(key) {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true };
  },

  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX + prefix)) keys.push(k.slice(PREFIX.length));
    }
    return { keys, prefix };
  },
};

export default storage;
