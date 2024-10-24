<!-- <script lang="ts">
  // import type { Erc20Token } from '$lib/tokens'
  import TokenIcon from '$lib/components/TokenIcon.svelte'
  import TokenBalance from '$lib/components/TokenBalance.svelte'
  import { currentAddress } from '$lib/wallets'
  import { createEventDispatcher } from 'svelte'
  import { createFloatingActions } from 'svelte-floating-ui'
  import { fade } from 'svelte/transition'
  import Icon from '@iconify/svelte'

  // export let tokens: Erc20Token[] = []
  // export let token!: Erc20Token

  type Option = {
    text: string
    click: () => void
  }

  export let options: Option[] = []
  export let current = options[0]

  const dispatch = createEventDispatcher()
  const dispatchSelect = (option: Option) => {
    dispatch('select', option)
    current = option
    entering = false
  }

  $: filtered = options.filter((opt) => opt !== current)

  const [floatingRef, floatingContent] = createFloatingActions({
    strategy: 'absolute',
    placement: 'bottom',
  })
  let entering = false
</script>

<div class="relative inline-block text-left">
  <div class="flex flex-col items-center">
    <button
      use:floatingRef
      type="button"
      class="inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      id="menu-button"
      aria-expanded="true"
      aria-haspopup="true"
      on:click={() => {
        entering = !entering
      }}
    >
      <slot name="button-content" />
    </button>
    {#if $currentAddress}
      <span class="ml-2 whitespace-pre py-2">
        <TokenBalance {token} address={$currentAddress} />
        {token.metadata?.symbol}
      </span>
    {/if}
  </div>

  <div
    class:opacity-0={!entering}
    class:scale-95={!entering}
    class:opacity-100={entering}
    class:scale-100={entering}
    class:pointer-events-none={!entering}
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 75 }}
    class="z-10 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
    role="menu"
    use:floatingContent
    aria-orientation="vertical"
    aria-labelledby="menu-button"
    tabindex="-1"
  >
    <div class="py-1" role="none">
      <ol>
        {#each filtered as token}
          <li>
            <button
              class="flex w-full items-center px-2 py-1 text-sm text-gray-700 active:bg-gray-100 active:text-gray-900"
              role="menuitem"
              tabindex="-1"
              type="button"
              on:click={() => dispatchSelect(token)}
            >
              <TokenIcon {token} />
              <span class="ml-1">
                {token.metadata?.name || ''}
              </span>
            </button>
          </li>
        {/each}
      </ol>
    </div>
  </div>
</div> -->
