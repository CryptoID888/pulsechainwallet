<script lang="ts">
  export let text = ''
</script>

<div class="flex flex-row justify-between">
  <span class="font-bold capitalize">{text}</span>
  <span><slot /></span>
</div>
