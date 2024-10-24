<script lang="ts">
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
</script>

<Crumb {...crumbs.transactions} />
<slot />
