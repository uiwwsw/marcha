export const ToastThemes = ['positive', 'negative', 'info', 'error'] as const
export type ToastTheme = (typeof ToastThemes)[number]
export interface ToastProps {
  message: string
  key?: string
  theme?: ToastTheme
}
