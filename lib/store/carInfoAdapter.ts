import { ToastProps } from '@lib/domain/toast'
import { create } from 'zustand'
export type CarInfoAdapter = {
  carInfo: string[]
  setCarInfo: (carInfo: string[]) => void
}
export const carInfoAdapter = create<CarInfoAdapter>((set) => ({
  carInfo: [] as string[],
  setCarInfo: (carInfo: string[]) =>
    set((state) => {
      return {
        carInfo: Array.from(
          new Set([...state.carInfo, ...carInfo]),
        ) as string[],
      }
    }),
}))
