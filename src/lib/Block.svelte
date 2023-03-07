<script>
  import * as util from "../utils.js";
  import { createEventDispatcher } from "svelte";
  import { Howl, Howler } from "howler";
  import { piece_queue, front, started, score } from "../stores";
  import { slide } from "svelte/transition";
  export let block;
  export let piece_type = -1;
  export let addPiece;
  export let img_paths;
  export let mappings;
  export let block_id;
  export let piece_types;

  let water_amount = 0.0;

  $: is_piece = piece_type != -1;

  const dispatch = createEventDispatcher();

  const destroyBlock = () => {
    if (water_amount > 0.01) return; // can't destroy water block
    if (piece_type >= 7) return; // cant destroy nubs
    if ($score < 5) return; // not enough score
    piece_type = -1;
    piece_types[block_id] = -1;
    $score -= 5; // cost to destroy pipe
  };

  export const enter = (from_delta) => {
    if (piece_type == 4) water_amount = 0; // cross
    if (water_amount > 0.01 || !is_piece) {
      return;
    }
    let water_interval = setInterval(() => {
      if (is_piece) water_amount += 0.1;
      if (water_amount >= 1.0) {
        let adjusted_mappings = [...mappings[piece_type]];
        let fidx = adjusted_mappings.indexOf(-1 * from_delta);
        if (fidx > -1) adjusted_mappings.splice(fidx, 1);
        if (piece_type == 4) {
          adjusted_mappings = [from_delta];
        }
        water_amount = 1.0;
        dispatch("exit", {
          neighbours: adjusted_mappings,
          block_id: block_id,
        });
        clearInterval(water_interval);
      }
    }, 175);
  };

  const click = () => {
    if (is_piece || !$started) return;

    var place_sound = new Howl({
      src: ["assets/place.wav"],
      volume: 0.5,
    });

    place_sound.play();

    block.setAttribute("id", "placed");

    is_piece = true;
    piece_type = front().type;
    piece_types[block_id] = piece_type;
    $piece_queue = [...$piece_queue.slice(0, $piece_queue.length - 1), ,];
    addPiece();
  };
</script>

<div
  class="block"
  bind:this={block}
  on:click={click}
  style={`background-color:#0000${Math.floor(water_amount * 255).toString(16)}`}
  in:slide
  on:contextmenu|preventDefault={destroyBlock}
>
  {#if is_piece}
    <img src={`${img_paths[piece_type]}`} draggable="false" />
  {/if}
</div>

<style>
  img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%;
    image-rendering: pixelated;
  }

  :global(#placed) {
    background-color: #057705 !important;
  }

  .block {
    width: 50px;
    height: 50px;
    background-color: green;
    /* border: 1px dotted aliceblue; */
    border: 1px dashed #343;
    border-radius: 2%;
    user-select: none;
  }
</style>
