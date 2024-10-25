<script lang="ts">
  import Icon from '@iconify/svelte'
  import TokenWithImage from './TokenWithImage.svelte'
  import type { Erc20Token } from '$common/token'
  import { tokensOnActiveChain } from '$lib/tokens'
  import { writable } from 'svelte/store'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  let entering = false

  export let token!: Erc20Token
  export let disabled = false

  const drawerStore = getDrawerStore()
  const openDrawer = () => {
    entering = !entering
    const current = writable(token)
    current.subscribe((tkn) => {
      token = tkn
      dispatch('change', tkn)
    })
    drawerStore.open({
      id: 'token',
      position: 'bottom',
      meta: {
        current,
        tokens: $tokensOnActiveChain,
      },
    })
  }
</script>

<button
  type="button"
  {disabled}
  class="token-selector btn flex flex-row items-center rounded-none leading-6 transition-all"
  on:click={openDrawer}>
  <TokenWithImage {token} />
  <span class="flex">
    <Icon icon="mdi:chevron-down" height={20} width={20} />
  </span>
</button>

<style lang="postcss">
  .token-selector {
    @apply py-0 pl-0 pr-4;
  }
</style>
