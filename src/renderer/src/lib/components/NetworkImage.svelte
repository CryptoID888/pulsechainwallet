<script lang="ts">
  import type { Chain } from '$common/token'

  let className = ''
  export let size = 12
  export let chain!: Chain
  export { className as class }
</script>

<img height={size} width={size} src={chain.logoURI} alt={chain.alt || ''} class={className} />
