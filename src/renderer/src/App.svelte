<script lang="ts">
  import Dependencies from '$lib/components/Dependencies.svelte'
  import Routing from '$lib/routes/index.svelte'
  import { config } from '$lib/config'
  console.log($config)
</script>

{#if $config}
  <Dependencies>
    <main class="flex h-full w-full flex-col">
      <Routing />
    </main>
  </Dependencies>
{/if}
