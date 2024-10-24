<script lang="ts">
  let hovering = false
  const handleMouseenter = () => {
    hovering = true
  }
  const handleMouseleave = () => {
    hovering = false
  }
</script>

<div class="contents" on:mouseenter={handleMouseenter} on:mouseleave={handleMouseleave} role="menuitem" tabindex={-1}>
  <slot {hovering} />
</div>
