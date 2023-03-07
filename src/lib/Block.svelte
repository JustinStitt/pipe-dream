<script>
  export let block;
  const click = () => {
    /**/
    block.style["background-color"] = "red";
  };

  export const reset = () => {
    block.style["background-color"] = "green";
  };
</script>

<div class="block" bind:this={block} on:click={click}>Test</div>

<style>
  .block {
    width: 50px;
    aspect-ratio: 1;
    background-color: green;
    border: 2px solid aliceblue;
    border-radius: 2%;
  }
</style>
