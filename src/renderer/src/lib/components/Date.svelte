<script lang="ts">
  import { settings } from '$lib/settings'
  import { numberToTime, TimeUnit } from '$lib/time'
  import _ from 'lodash'
  export let value: bigint | string | null = null
  export let unit: TimeUnit = TimeUnit.Millisecond
  $: date = new Date(_.isString(value) ? value : Number(numberToTime(BigInt(value), unit)))
  $: iso = date.toISOString()
  $: locale = date.toLocaleString()
  $: display = $settings.useISOTime ? iso : locale
  $: title = !$settings.useISOTime ? iso : locale
</script>

<span class="contents" {title}>{display}</span>
