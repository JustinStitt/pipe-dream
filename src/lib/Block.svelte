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

  const onPieceTypeChange = (pt) => {
    water_amount = 0.0;
  };

  $: onPieceTypeChange(piece_type);

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

  let water_overlay, water_overlay_02;
  $: has_left_to_right_water_overlay = piece_type == 4;

  // need map of from_delta and piece_id

  const handleAnimation = (from_delta) => {
    if (piece_type != 4 || Math.abs(from_delta) > 1)
      water_overlay.style.visibility = "visible";
    if (piece_type == 5) {
      water_overlay.src = "assets/pipe-y-w.png";
      water_overlay.classList.add("straight");
      if (from_delta > 0) {
        water_overlay.style["transform"] = "rotate(270deg)";
      } else {
        water_overlay.style["transform"] = "rotate(90deg)";
      }
    } else if (piece_type == 6) {
      water_overlay.src = "assets/pipe-y-w.png";
      water_overlay.classList.add("straight");
      // vertical bar
      if (from_delta < 0) {
        // going bottom to top (rotate 90deg)
        water_overlay.style["transform"] = "rotate(180deg)";
      }
    } else if (piece_type == 5) {
      if (from_delta > 0) {
        water_overlay.style["transform"] = "rotate(270deg)";
      } else {
        water_overlay.style["transform"] = "rotate(90deg)";
      }
    } else if (piece_type >= 0 && piece_type <= 3) {
      // curved
      water_overlay.classList.add("curved");
      water_overlay.src = "assets/pipe-bottom-left-w.png";
    } else if (piece_type >= 7) {
      water_overlay.classList.add("nub");
      water_overlay.src = "assets/nub-bottom-w.png";
    } else if (piece_type == 4) {
      if (Math.abs(from_delta) > 1) {
        water_overlay.classList.add("straight");
        water_overlay.src = "assets/pipe-x-y-w.png";
        water_overlay.style["transform"] = "rotate(180deg)";
      } else {
        // water_overlay.style.visibility = "hidden";
        water_overlay_02.classList.add("horizontal");
        water_overlay_02.style.visibility = "visible";
      }
      if (from_delta <= -1) {
        water_overlay.style["transform"] = "rotate(180deg)";
      } else if (from_delta == 1) {
        water_overlay_02.style["transform"] = "rotate(180deg)";
      } else if (from_delta == -1) {
        water_overlay_02.style["transform"] = "rotate(-90deg)";
      }
    }

    if (piece_type == 0) {
      if (from_delta > 0) {
        water_overlay.style["transform"] = "scale(-1, 1) rotate(-90deg)";
      }
    }

    if (piece_type == 1) {
      if (from_delta < -1) {
        // -n
        water_overlay.style["transform"] = "scale(-1, 1)";
      } else {
        water_overlay.style["transform"] = "rotate(-90deg)";
      }
    }

    if (piece_type == 2) {
      if (from_delta > 1) {
        // n coming down into
        water_overlay.style["transform"] = "scale(1, -1)";
      } else {
        water_overlay.style["transform"] = "rotate(90deg)";
      }
    }

    if (piece_type == 3) {
      if (from_delta > 1) {
        // come from top
        water_overlay.style["transform"] = "rotate(180deg)";
      } else {
        water_overlay.style["transform"] = "scale(1, -1) rotate(-90deg)";
      }
    }

    if (piece_type == 8) {
      water_overlay.style["transform"] = "rotate(90deg)";
    }

    if (piece_type == 9) {
      water_overlay.style["transform"] = "rotate(-90deg)";
    }

    if (piece_type == 10) {
      water_overlay.style["transform"] = "rotate(180deg)";
    }
  };

  export function enter(from_delta) {
    if (piece_type == 4 && water_amount > 0.01) {
      water_amount = 0; // cross
      // create new water overlay (left to right)
    }
    if (water_amount > 0.01 || !is_piece) {
      return;
    }
    handleAnimation(from_delta);
    // water_overlay.style["animation-play-state"] = "running";
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
  }

  const click = () => {
    if (is_piece || !$started) return;

    var place_sound = new Howl({
      src: ["assets/place.wav"],
      volume: 0.5,
    });

    place_sound.play();

    block.style["background-color"] = "#057705";
    block.setAttribute("id", "placed");

    is_piece = true;
    piece_type = front().type;
    piece_types[block_id] = piece_type;
    $piece_queue = [...$piece_queue.slice(0, $piece_queue.length - 1), ,];
    addPiece();
  };
</script>

<!-- style={`background-color:#0000${Math.floor(water_amount * 255).toString(16)}`} -->
<div
  on:keydown={() => {}}
  class="block"
  bind:this={block}
  on:click={click}
  in:slide
  on:contextmenu|preventDefault={destroyBlock}
>
  {#if is_piece}
    <img alt="none" src={`${img_paths[piece_type]}`} draggable="false" />
    <img
      bind:this={water_overlay}
      class="water-overlay"
      src="assets/pipe-bottom-left-w.png"
      draggable="false"
      alt="none"
    />
    {#if piece_type == 4}
      <img
        bind:this={water_overlay_02}
        class="water-overlay"
        src="assets/pipe-x-w.png"
        draggable="false"
        alt="none"
      />
    {/if}
  {/if}
</div>

<style>
  @keyframes _curved {
    0% {
      clip-path: polygon(59% 99%, 100% 99%, 100% 100%, 50% 100%, 0 100%, 0 99%);
    }
    32% {
      clip-path: polygon(100% 0, 100% 99%, 100% 100%, 50% 100%, 0 100%, 0 94%);
    }
    100% {
      clip-path: polygon(0 0, 100% 44%, 100% 100%, 50% 100%, 0 100%, 0 94%);
    }
  }

  .tmp {
    border: 2px solid red;
  }

  :global(.curved) {
    animation: _curved 1.75s linear;
  }

  :global(.straight) {
    animation: _pipe_6 1.75s;
  }

  :global(.nub) {
    animation: _pipe_6 1.75s;
  }

  :global(.horizontal) {
    animation: _horizontal 1.75s;
  }

  @keyframes _pipe_6 {
    0% {
      clip-path: polygon(0 0, 100% 0, 100% 1%, 0% 1%);
    }

    100% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  }

  @keyframes _horizontal {
    0% {
      clip-path: polygon(99% 0, 100% 0%, 100% 100%, 99% 100%);
    }
    100% {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    }
  }

  .water-overlay {
    position: absolute;
    top: 0;
    left: 0;
    filter: opacity(0.8);
    visibility: hidden;
  }

  .fill-level {
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    flex-shrink: 0;
    min-width: 100%;
    min-height: 100%;
    image-rendering: pixelated;
  }

  :global(#placed) {
    /* background-color: #057705 !important; */
  }

  .block {
    position: relative;
    width: 50px;
    height: 50px;
    background-color: green;
    /* border: 1px dotted aliceblue; */
    border: 1px dashed #333;
    border-radius: 2%;
    user-select: none;
  }
</style>
