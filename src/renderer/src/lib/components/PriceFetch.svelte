<script lang="ts">
  import { onMount } from 'svelte'

  import { currentBlock } from '$lib/chain-state'
  import type { Erc20Token } from '$common/token'
  import { state } from '$lib/api'
  import { delay } from '$lib/state-delay'

  export let price = 0n
  export let token!: Erc20Token
  export let blockOffset = 0n

  let cleanup = () => {}
  const updateToken = () => {
    if (!$currentBlock) {
      return () => {}
    }
    let cancelled = false
    const num = $currentBlock.number!
    const blockNumber = BigInt(num) - BigInt(blockOffset)
    state.price(token, blockNumber).then((p) => {
      if (cancelled) return
      if (!p) return
      price = p
    })
    return () => {
      cancelled = true
    }
  }
  const filter = delay(5_000)
  $: if (
    token &&
    $currentBlock &&
    filter({
      token: token.address,
      block: $currentBlock.number,
    })
  ) {
    cleanup()
    cleanup = updateToken()
  }
  onMount(() => () => {
    cleanup()
  })
</script>

<slot />
