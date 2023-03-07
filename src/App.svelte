<script>
  import * as util from "./utils.js";
  import { slide, fade } from "svelte/transition";
  import Block from "./lib/Block.svelte";
  import { onMount } from "svelte";
  import { piece_queue } from "./stores";
  let n = 12;

  $: blocks = Array.from(Array(n * n).keys());

  let bindings = Array(n * n).fill(null);

  const newRound = () => {
    bindings.forEach((e) => {
      e.style["background-color"] = "green";
    });
    let strt = util.rand_range(0, n * n);
    let end = util.rand_range(0, n * n);
    while (end == strt) end = util.rand_range(0, n * n);
    bindings[strt].style["background-color"] = "blue";
    bindings[end].style["background-color"] = "orange";
    blocks = Array.from(Array(n * n).keys());
  };

  let id = 0;
  const addPiece = (type) => {
    id += 1;
    return {
      type: type,
      id: id,
    };
  };

  $: pieces = $piece_queue;

  $piece_queue = [
    addPiece(0),
    addPiece(1),
    addPiece(2),
    addPiece(3),
    addPiece(4),
  ];

  onMount(() => {
    newRound();
  });
</script>

<main>
  <div class="container">
    <div
      class="board"
      style={`grid-template-columns: ${"1fr ".repeat(
        n
      )}; grid-template-rows: ${"1fr ".repeat(n)};`}
    >
      {#each blocks as block}
        <Block is_piece={false} bind:block={bindings[block]} />
      {/each}
    </div>

    <!-- <input type="range" min="4" max="12" bind:value={n} /> -->
    <div class="pieces">
      {#each pieces as piece (piece.id)}
        <Block is_piece={true} piece_type={piece.type}>{piece.id}</Block>
      {/each}
    </div>
  </div>
  <button on:click={newRound}>test</button>
</main>

<style>
  .container {
    background-color: yellow;
    padding: 10px;
    display: flex;
    display: flex;
    flex-direction: row-reverse;
  }

  .pieces {
    background-color: rebeccapurple;
  }

  .board {
    display: grid;
    background-color: orange;
    padding: 10px;
  }
</style>
