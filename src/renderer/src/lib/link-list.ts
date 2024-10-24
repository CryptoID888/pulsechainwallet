export type Action = {
  name: string
  click?: () => void
}
export type Section = {
  name: string
  actions: Action[]
}
