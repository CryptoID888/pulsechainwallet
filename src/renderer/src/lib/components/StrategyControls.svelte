<script lang="ts">
  import Icon from '@iconify/svelte'
  import { Strategy } from '$common/pools'
  import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton'

  export let strategy: Strategy = Strategy.OLDEST_FIRST
</script>

<RadioGroup border="border-0" active="variant-filled-primary" hover="hover:variant-soft-primary" padding="px-1 py-0.5">
  <RadioItem bind:group={strategy} name="strategy" value="oldest-first">
    <Icon icon="lucide:chevron-first" class="h-5" height={20} />
  </RadioItem>
  <RadioItem bind:group={strategy} name="strategy" value="recent-first">
    <Icon icon="lucide:chevron-last" class="h-5" height={20} />
  </RadioItem>
  <RadioItem bind:group={strategy} name="strategy" value="random">
    <Icon icon="ri:dice-line" class="h-5" height={20} />
  </RadioItem>
</RadioGroup>
