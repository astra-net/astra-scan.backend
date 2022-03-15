import {Address} from 'src/types'
export const normalizeAddress = (address: Address) => {
  if (!address) {
    return null
  }
  // hex
  if (address[0] === '0' && address[1] === 'x') {
    return address.toLowerCase()
  }
}
