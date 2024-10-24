<script lang="ts">
  import { lazyload } from '$lib/modifiers/lazyload'
  export let height = 1
  let className = ''
  let load = false
  export let visible = (e: CustomEvent) => {
    load = !!e.detail
  }
  export { className as class }
</script>

<div class={className} use:lazyload on:visible={visible} style={`height: ${height}px`}>
  <slot {load} />
</div>
