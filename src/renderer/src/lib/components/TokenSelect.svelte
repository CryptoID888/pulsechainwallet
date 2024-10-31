<script lang="ts">
  import TokenWithImage from './TokenWithImage.svelte'
  import type { Erc20Token } from '$common/token'
  import { type Writable } from 'svelte/store'
  import Select from './Select.svelte'

  export let current!: Writable<Erc20Token>
  export let tokens: Erc20Token[] = []
  const matches = (token: Erc20Token) => token.address === $current.address && token.chain.id === $current.chain.id
</script>

<div class="p-4">
  <h3 class="h3 mb-4 text-center">Token Select</h3>
  <ol class="list">
    {#each tokens as token}
      <li class="flex w-full items-center justify-center">
        <button
          type="button"
          class="flex w-64 items-center justify-center"
          on:click={() => {
            current.set(token)
            // reflow the each loop
            tokens = tokens
          }}
        >
          <!-- <span class="flex flex-grow-[3]"></span> -->
          <span class="flex flex-grow-[1]">
            <Select show={matches(token)} />
            <span class="flex items-start justify-start">
              <TokenWithImage {token} />
            </span>
          </span>
          <!-- <span class="flex flex-grow-[2]"></span> -->
        </button>
      </li>
    {/each}
  </ol>
</div>
