import _ from 'lodash'

/**
 * Delay the function call until the object changes or the delay expires
 * @param ms - delay in milliseconds
 * @param _filter - object to compare to the current object
 * @returns true if the filters have sufficiently changed
 * and the function should be called, false otherwise
 */
export const delay = (ms: number, _filter: object = {}) => {
  let last = 0
  let filter = _filter
  return (current: object = {}) => {
    const now = Date.now()
    if (!_.isEqual(current, filter)) {
      last = now
      filter = current
      return true
    }
    if (now - last > ms) {
      last = now
      filter = current
      return true
    }
    return false
  }
}
