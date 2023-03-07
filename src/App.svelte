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

  let bindings = Array(n * n).fill(null);

  const newRound = () => {
    button_text = "Reset";
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
          is_piece={false}
          bind:block={bindings[block]}
          {addPiece}
          {img_paths}
        />
      {/each}
    </div>

    <!-- <input type="range" min="4" max="12" bind:value={n} /> -->
    <div class="pieces">
      {#each $piece_queue as piece (piece.id)}
        <Block is_piece={true} piece_type={piece.type} {img_paths}
          >{piece.id}</Block
        >
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
