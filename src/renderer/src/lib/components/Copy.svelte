<script lang="ts">
  export let text = ''

  let copied = false
  let id: ReturnType<typeof setTimeout> | null = null

  const copyText = () => {
    navigator.clipboard.writeText(text)
    copied = true
    if (id) {
      clearTimeout(id)
    }
    const localId = setTimeout(() => {
      copied = false
    }, 5_000)
    id = localId
    // toastStore.trigger({
    //   message: 'Copied!',
    //   background: 'bg-success-300',
    // })
  }
</script>

<slot copy={copyText} {copied} />
