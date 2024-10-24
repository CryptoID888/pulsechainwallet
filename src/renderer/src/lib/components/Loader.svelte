<script lang="ts">
  import Icon from '@iconify/svelte'

  let className = ''
  export { className as class }
  export let size = 32
</script>

<span class="flex flex-col items-baseline justify-end text-black">
  <Icon icon="svg-spinners:3-dots-bounce" class={className} height={size} />
</span>
