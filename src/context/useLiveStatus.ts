import { useContext } from 'react'
import { LiveStatusContext } from './liveStatusState'

export function useLiveStatus() {
  return useContext(LiveStatusContext)
}
