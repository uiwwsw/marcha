import { ToastProps } from '@lib/domain/toast'
import { create } from 'zustand'
export type ToastAdapter = {
  messages: ToastProps[]
  showMessage: (toast: ToastProps) => void
  hideMessage: (current: ToastProps) => void
}
export const toastAdapter = create<ToastAdapter>((set) => ({
  messages: [],
  showMessage: (toast: ToastProps) =>
    set((state) => {
      const { messages } = state
      if (messages.includes(toast)) return { messages }
      return {
        messages: [
          ...messages,
          {
            key: new Date().valueOf().toString(),
            message: toast.message,
            theme: toast.theme ?? 'info',
          },
        ],
      }
    }),
  hideMessage: (current: ToastProps) =>
    set((state) => {
      const { messages } = state
      const index = messages.findIndex((x) => x === current)
      if (index >= 0) messages.splice(index, 1)
      return { messages }
    }),
}))
