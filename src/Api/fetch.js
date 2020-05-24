import { isCrossOrigin } from './utils'
import { memoizeWith, identity } from 'ramda'
import { ApiError } from './error'

const getMode = url => isCrossOrigin(url) ? 'cors' : 'no-cors'
const getModeC = memoizeWith(identity, getMode)

export const fetchGet = (url, isApi = true) => {
  return fetch(url, {
    method: 'GET',
    mode: getModeC(url)
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
    else {
      return new Error('net error')
    }
  }).then(res => {
    if (isApi) {
      if (res.ok) {
        return res.result
      } else {
        throw new ApiError('server error', res)
      }
    } else {
      return res
    }
  })
}
