<!-- <script lang="ts">
  import { currentPublicClient, currentBlock } from '$lib/chain-state'
  import { onMount } from 'svelte'
  let unwatch = () => {}
  const cleanup = () => {
    currentBlock.set(null)
    unwatch()
  }
  $: if ($currentPublicClient) {
    cleanup()
    unwatch = $currentPublicClient?.watchBlocks({
      emitOnBegin: true,
      onBlock: (block) => {
        currentBlock.set(block)
      },
    })
  }
  onMount(() => () => {
    cleanup()
  })
</script>

<slot /> -->
