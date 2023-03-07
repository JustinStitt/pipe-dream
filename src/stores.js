import { readable, writable, get } from 'svelte/store'

export const piece_queue = writable([]);

export const front = () => {
  return get(piece_queue)[0]
}
