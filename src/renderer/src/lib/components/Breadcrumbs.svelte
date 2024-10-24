<script lang="ts">
  import Icon from '@iconify/svelte'
  import { crumbtrail } from '$lib/navigation'
  import { link } from 'svelte-spa-router'
</script>

<ol class="flex h-10 flex-grow">
  {#each $crumbtrail as { crumb }, i}
    {#if i > 0}
      <li class="crumb-separator flex items-center px-2 text-primary-900">
        <Icon icon="icons8:chevron-right" height={24} />
      </li>
    {/if}
    <li class="flex flex-row items-center">
      <a use:link href={crumb.link} class:anchor={i < $crumbtrail.length - 1} class="align-center flex flex-row">
        {#if !!crumb.icon}
          <span class="mr-2 flex items-center">
            <Icon icon={crumb.icon} height={crumb.iconSize || 24} />
          </span>
        {/if}
        <span>{crumb.text}</span>
        <span class="sr-only">{crumb.text}</span>
      </a>
    </li>
  {/each}
</ol>
