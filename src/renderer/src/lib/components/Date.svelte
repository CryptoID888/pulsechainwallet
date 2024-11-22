<script lang="ts">
  import { config } from '$lib/config'
  import { numberToTime, TimeUnit } from '$lib/time'
  import _ from 'lodash'
  export let value: bigint | string | null = null
  export let unit: TimeUnit = TimeUnit.Millisecond
  $: date = new Date(_.isString(value) ? value : Number(numberToTime(BigInt(value || 0n), unit)))
  $: iso = date.toISOString()
  $: locale = date.toLocaleString()
  $: display = $config.useISOTime ? iso : locale
  $: title = !$config.useISOTime ? iso : locale
</script>

<span class="contents" {title}>{display}</span>
