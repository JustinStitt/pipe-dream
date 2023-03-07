<script>
  import * as util from "../utils.js";
  import { Howl, Howler } from "howler";
  import { piece_queue, front, id } from "../stores";
  export let block;
  export let is_piece;
  export let piece_type = -1;
  export let addPiece;
  export let img_paths;

  const click = () => {
    if (is_piece) return;

    var place_sound = new Howl({
      src: ["assets/place.wav"],
      volume: 0.5,
    });

    place_sound.play();

    /**/
    block.style["background-color"] = "#057705";
    is_piece = true;
    piece_type = front().type;
    $piece_queue = [...$piece_queue.slice(0, $piece_queue.length - 1), ,];
    addPiece();

    console.log($piece_queue);
    console.log(front());
  };

  // TODO: Howler for sounds
</script>

<div class="block" bind:this={block} on:click={click}>
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

  .block {
    width: 50px;
    height: 50px;
    background-color: green;
    /* border: 1px dotted aliceblue; */
    border: 1px dashed #333;
    border-radius: 2%;
    user-select: none;
  }
</style>
