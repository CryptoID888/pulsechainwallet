<script lang="ts">
  import type { Erc20Token } from '$common/token'
  import * as viem from 'viem'
  import Loading from './Loading.svelte'
  import Number from './Number.svelte'
  import { createEventDispatcher } from 'svelte'
  import { state } from '$lib/api'
  import { delay } from '$lib/state-delay'

  const dispatch = createEventDispatcher()

  export let token!: Erc20Token
  export let address!: viem.Hex
  export let balance: bigint | null = null

  const filter = delay(5_000)
  $: if (
    token &&
    filter({
      token: token.address,
    })
  ) {
    state.balance(token.chain.id, address, token).then((bal) => {
      // console.log('balance=%o', bal)
      balance = bal
      dispatch('balance', bal)
    })
  }
</script>

{#if balance === null}
  <Loading size={16} />
{:else}
  <Number x={balance} decimals={token.metadata?.decimals || 18} />
{/if}
