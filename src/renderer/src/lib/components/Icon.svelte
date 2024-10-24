<!-- <script lang="ts">
  import Icon from '@iconify/svelte'
  import { iconData, loaded } from './icon-data'
  export let icon!: string
  export let height: number = 24
  export let width: number = 24
  export let scale: number = undefined
  $: prefix = icon.split(':')[0]
  $: name = icon.split(':')[1]
  const retrieve = () => {
    const data = iconData.get(prefix)?.get(name)!
    console.log(data)
    return iconToSVG(data)
  }
</script>

{#await loaded() then _data}
  {@const data = retrieve()}
  <Icon {...data} {height} {width} {scale} />
{/await} -->
