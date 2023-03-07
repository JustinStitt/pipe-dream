import { readable, writable, get } from 'svelte/store'

export const piece_queue = writable([]);

export const started = writable(false);
export const score = writable(0);

export const id = writable(0);

export const front = () => {
  return get(piece_queue)[get(piece_queue).length - 1]
}
