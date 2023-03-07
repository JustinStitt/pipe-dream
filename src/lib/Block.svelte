<script>
  import * as util from "../utils.js";
  export let block;
  export let is_piece;
  const click = () => {
    if (is_piece) return;
    /**/
    block.style["background-color"] = "red";
  };

  let img_paths = [
    "/src/assets/pipe-x-y.png",
    "/src/assets/pipe-x.png",
    "/src/assets/pipe-top-left.png",
  ];
</script>

<div class="block" bind:this={block} on:click={click}>
  <img src={`${img_paths[util.rand_range(0, 3)]}`} />
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
