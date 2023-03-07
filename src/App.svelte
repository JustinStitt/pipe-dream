<script>
  import * as util from "./utils.js";
  import { slide, fade } from "svelte/transition";
  import Block from "./lib/Block.svelte";
  import { piece_queue, id } from "./stores";
  let n = 12;

  let score = 0;
  let time_remaining = 5;

  let button_text = "Start";

  $: blocks = Array.from(Array(n * n).keys());

  $: bindings = Array(n * n).fill(null);
  $: piece_types = Array(n * n).fill(-1);

  let mappings = [
    [-1, n],
    [1, n],
    [-1, -n],
    [1, -n],
    [-1, 1, n, -n],
    [-1, 1],
    [-n, n],
  ];

  const newRound = () => {
    button_text = "Reset";
    bindings.forEach((e) => {
      e.style["background-color"] = "green";
    });
    piece_types = Array(n * n).fill(-1);
    let strt = util.rand_range(0, n * n);
    let end = util.rand_range(0, n * n);
    while (end == strt) end = util.rand_range(0, n * n);
    bindings[strt].style["background-color"] = "blue";
    bindings[end].style["background-color"] = "orange";

    let start_orient = util.rand_range(0, 4);
    let end_orient = util.rand_range(0, 4);

    piece_types[strt] = 7 + start_orient;
    piece_types[end] = 7 + end_orient;

    // blocks = Array.from(Array(n * n).keys());
  };

  const addPiece = () => {
    $id += 1;
    console.log("id: ", $id);

    let new_piece = {
      type: util.rand_range(0, 7),
      id: $id,
    };

    $piece_queue = [new_piece, ...$piece_queue];
  };

  let img_paths = [
    "assets/pipe-bottom-left.png",
    "assets/pipe-bottom-right.png",
    "assets/pipe-top-left.png",
    "assets/pipe-top-right.png",
    "assets/pipe-x-y.png",
    "assets/pipe-x.png",
    "assets/pipe-y.png",
    "assets/knub-bottom.png", // 7
    "assets/knub-left.png",
    "assets/knub-right.png",
    "assets/knub-top.png",
  ];

  $piece_queue = [];
  for (let i = 0; i < 5; ++i) addPiece();
</script>

<main>
  <div class="info">
    <h3>Score: {score}</h3>
    <h3>Time: {time_remaining}</h3>
  </div>
  <div class="container">
    <div
      class="board"
      style={`grid-template-columns: ${"1fr ".repeat(
        n
      )}; grid-template-rows: ${"1fr ".repeat(n)};`}
    >
      {#each blocks as block}
        <Block
          piece_type={piece_types[block]}
          bind:block={bindings[block]}
          {addPiece}
          {img_paths}
          {mappings}
        />
      {/each}
    </div>

    <!-- <input type="range" min="4" max="12" bind:value={n} /> -->
    <div class="pieces">
      {#each $piece_queue as piece (piece.id)}
        <Block piece_type={piece.type} {img_paths} {mappings}>{piece.id}</Block>
      {/each}
    </div>
  </div>
  <div class="buttons">
    <button on:click={newRound}>{button_text}</button>
  </div>
</main>

<style>
  main {
    border: 3px solid black;
  }

  .info {
    display: flex;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
    background-color: #aaa;
    border-bottom: 3px solid black;
  }

  .container {
    background-color: #bbb;
    padding: 10px;
    display: flex;
    flex-direction: row-reverse;
  }

  .pieces {
    background-color: #bbb;
  }

  .board {
    display: grid;
    background-color: #bbb;
    padding: 10px;
  }

  .buttons {
    border-top: 3px solid black;
    padding: 10px;
    display: flex;
    justify-content: center;
    gap: 10vw;
    background-color: #aaa;
  }

  button {
    border: 2px solid black;
    padding: 10px;
    user-select: none;
  }
</style>
