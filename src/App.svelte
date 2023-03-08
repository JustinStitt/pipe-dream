<script>
  import * as util from "./utils.js";
  import { slide, fade } from "svelte/transition";
  import Block from "./lib/Block.svelte";
  import { piece_queue, id, started, score } from "./stores";
  let n = 12;

  let button_text = "Start";

  $: blocks = Array.from(Array(n * n).keys());

  $: bindings = Array(n * n).fill(null);
  $: piece_types = Array(n * n).fill(-1);
  $: enters = Array(n * n).fill(null);

  $: pieces = Array(5).fill(0);

  let mappings = [
    [-1, n],
    [1, n],
    [-1, -n],
    [1, -n],
    [-1, 1, n, -n],
    [-1, 1],
    [-n, n],
    // nubs
    [n],
    [-1],
    [1],
    [-n],
  ];

  let strt, end;

  let lost = false;
  let win = false;

  const ROUND_TIMER = 20;

  const isBadNubPlacement = (idx) => {
    return (
      idx % n == 0 ||
      idx % n == n - 1 ||
      Math.floor(idx / n) == 0 ||
      Math.floor(idx / n) == n - 1
    );
  };

  const newRound = () => {
    $started = true;
    lost = false;
    win = false;
    $score = 0;
    button_text = "Reset";
    timer = ROUND_TIMER;
    bindings.forEach((e) => {
      e.style["background-color"] = "green";
    });
    piece_types = Array(n * n).fill(-1);
    console.log(
      "piece_types: ",
      piece_types,
      " bindings: ",
      bindings,
      " blocks: ",
      blocks,
      " enters: ",
      enters,
      " pieces: ",
      pieces
    );
    strt = util.rand_range(0, n * n);
    while (isBadNubPlacement(strt)) strt = util.rand_range(0, n * n);
    end = util.rand_range(0, n * n);
    while (end == strt || isBadNubPlacement(end))
      end = util.rand_range(0, n * n);
    // bindings[strt].style["background-color"] = "blue";
    bindings[end].style["background-color"] = "orange";

    let start_orient = util.rand_range(0, 4);
    let end_orient = util.rand_range(0, 4);

    piece_types[strt] = 7 + start_orient;
    piece_types[end] = 7 + end_orient;

    setTimer(timer);
    // blocks = Array.from(Array(n * n).keys());
  };

  let timer = ROUND_TIMER;

  let countdown;

  const setTimer = (delay) => {
    clearInterval(countdown);

    countdown = setInterval(() => {
      timer -= 1;
      if (timer == 0) {
        enters[strt](); // start water flow
        clearInterval(countdown);
      }
    }, 1000);
  };

  const addPiece = () => {
    $id += 1;

    let new_piece = {
      type: util.rand_range(0, 7), // 0, 7
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

  const handleExit = (event) => {
    $score += 10;
    let neighbours = event.detail.neighbours;
    let block_id = event.detail.block_id;
    // start all neighbors
    let flowed_elsewhere = false;
    neighbours.forEach((delta) => {
      let idx = block_id + delta;
      if (idx < 0 || idx > n * n - 1) {
      } else if (piece_types[idx] != -1) {
        // start filling neighbour only if it lines up
        let other_mappings = mappings[piece_types[idx]];
        // check if -delta in other mappings
        let found = false;
        for (let i = 0; i < other_mappings.length; ++i) {
          if (other_mappings[i] == -1 * delta) found = true;
        }
        if (found) {
          flowed_elsewhere = true;
          if (piece_types[idx] >= 7) {
            // hit the goal
            console.log("YOU WIN");
            win = true;
            $started = false;
            return;
          }
          enters[idx](delta);
        }
      }
    });
    if (!flowed_elsewhere) {
      console.log("YOU LOST");
      $started = false;
      lost = true;
      return;
    }
  };

  $piece_queue = [];
  // starting pieces
  for (let i = 0; i < 5; ++i) addPiece();
</script>

<main>
  <div class="info">
    <h3>Score: {$score}</h3>
    <h2>PIPE DREAM</h2>
    <h3>Time: {timer}</h3>
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
          bind:enter={enters[block]}
          block_id={block}
          on:exit={handleExit}
          bind:piece_types
        />
      {/each}
    </div>

    <!-- <input type="range" min="4" max="12" bind:value={n} /> -->
    <div class="pieces">
      {#if $started}
        {#each $piece_queue as piece (piece.id)}
          <Block
            bind:block={pieces[piece]}
            piece_type={piece.type}
            {img_paths}
            {mappings}
            block_id={piece}
            {addPiece}
            {piece_types}
          />
        {/each}
      {/if}
    </div>
  </div>
  {#if lost || !$started || win}
    <button class="main-button" on:click={newRound}>{button_text}</button>
  {/if}
  {#if lost || win}
    <h1 class="big-text">YOU {lost ? "LOST" : win ? "WIN" : "WHAT"}</h1>
  {/if}
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
    min-width: 60px;
    width: 60px;
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

  .pieces > :global(*) {
    filter: opacity(0.65);
    transition: all 0.1s ease-in-out;
    margin-top: 3px;
  }

  .pieces > :global(:last-child) {
    margin-top: 10px;
    border: 2px solid aliceblue;
    transform: scale(1.2);
    filter: opacity(1);
  }

  button {
    border: 2px solid black;
    padding: 10px;
    user-select: none;
  }

  .big-text {
    position: absolute;
    top: 37%;
    left: 52%;
    transform: translateX(-50%) translateY(-50%);
  }

  .main-button {
    font-size: 2rem;
    width: 200px;
    position: absolute;
    top: 51%;
    left: 52%;
    transform: translateX(-50%) translateY(-50%);
  }
</style>
