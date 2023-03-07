<script>
  import * as util from "../utils.js";
  import { front } from "../stores";
  export let block;
  export let is_piece;
  export let piece_type;
  const click = () => {
    if (is_piece) return;
    /**/
    block.style["background-color"] = "red";
    is_piece = true;
    piece_type = front().type;
    console.log(front());
  };

  // TODO: Howler for sounds

  let img_paths = [
    "/src/assets/pipe-x-y.png",
    "/src/assets/pipe-x.png",
    "/src/assets/pipe-top-left.png",
    "/src/assets/pipe-x-y.png",
    "/src/assets/pipe-x.png",
    "/src/assets/pipe-top-left.png",
  ];
</script>

<div class="block" bind:this={block} on:click={click}>
  {#if is_piece}
    {piece_type}
  {/if}
  {#if is_piece}
    <img src={`${img_paths[piece_type]}`} />
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
    border: 3px solid #333;
    border-radius: 2%;
    user-select: none;
  }
</style>
