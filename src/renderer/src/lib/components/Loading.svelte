<script lang="ts">
  import Loader from '$lib/components/Loader.svelte'
  import { loading as l } from '$lib/loading'
  export let size = 32
  export let loading = l
  export let key: string | string[] | undefined = undefined
  let className = ''
  export { className as class }
  export let keepSpace = false
  $: loaded = $loading.isResolved(key)
</script>

{#if loaded && !keepSpace}
  <slot />
{:else}
  <Loader class={className} {size} />
{/if}
