<script lang="ts">
  import { crumbtrail, type Crumb } from '$lib/navigation'
  import { onMount } from 'svelte'
  export let text = ''
  export let link = ''
  export let icon = ''
  export let iconSize = 24
  let id = ''
  $: crumb = { text, link, icon, iconSize } as Crumb
  $: if (crumb) {
    crumbtrail.remove(id)
    id = crumbtrail.push(crumb)
  }
  onMount(() => {
    return () => {
      crumbtrail.remove(id)
    }
  })
</script>

<slot />
