import { createContext, useContext } from 'react'
import type { RegionId } from '../data/types'

export type BattleMode = { mode: 'minion'; region: RegionId; index: number } | { mode: 'boss'; region: RegionId } | { mode: 'final' } | { mode: 'review' }

export type Screen =
  | { name: 'title' }
  | { name: 'create' }
  | { name: 'map' }
  | { name: 'region'; id: RegionId }
  | { name: 'study'; id: RegionId }
  | { name: 'battle'; battle: BattleMode }
  | { name: 'memory'; id: RegionId }
  | { name: 'sort'; id: RegionId }
  | { name: 'grimoire' }
  | { name: 'shop' }
  | { name: 'ranking' }
  | { name: 'achievements' }
  | { name: 'oracle' }

export const NavCtx = createContext<(s: Screen) => void>(() => {})
export const useNav = () => useContext(NavCtx)
