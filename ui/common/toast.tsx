import { toastAdapter } from '@lib/adapter/toastAdapter'
import { ToastProps } from '@lib/domain/toast'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
class Animate {
  #state?: boolean = undefined
  #request = 0
  #startTime = 0
  #pauseTime = 0
  #marginTime = 0
  #limitTime = 10000
  constructor(
    private setTime: Dispatch<SetStateAction<number>>,
    private hideMessage: () => void,
  ) {}
  #setValue(x: number) {
    this.setTime(100 - Math.floor(x / 100))
  }
  #performanceNow() {
    return new Date().valueOf()
  }
  #action() {
    if (!this.#startTime) this.#startTime = this.#performanceNow()

    const t = this.#performanceNow() - this.#startTime + this.#marginTime
    if (t >= this.#limitTime) {
      this.#setValue(this.#limitTime)
      this.#cancelAnimationFrame()
      this.hideMessage()
    } else {
      this.#setValue(t)
      this.#requestAnimationFrame()
    }
  }
  #requestAnimationFrame() {
    this.#request = requestAnimationFrame(() => this.#action())
  }
  #cancelAnimationFrame() {
    cancelAnimationFrame(this.#request)
  }
  onStart() {
    if (this.#state === undefined) {
      this.#state = true
      this.#requestAnimationFrame()
    }
  }
  onPause() {
    if (this.#state) {
      this.#state = false
      this.#pauseTime = this.#performanceNow()
      this.#cancelAnimationFrame()
    }
  }
  onResume() {
    if (this.#state === false) {
      this.#state = true
      this.#marginTime += this.#pauseTime - this.#performanceNow()
      this.#pauseTime = 0
      this.#requestAnimationFrame()
    }
  }
}
export function T({
  toast,
  pause,
  index,
  hideMessage,
  setPause,
}: {
  toast: ToastProps
  pause: boolean
  index: number
  hideMessage: (current: ToastProps) => void
  setPause: Dispatch<SetStateAction<boolean>>
}) {
  const [time, setTime] = useState(0)
  const onHideMessage = useCallback(() => hideMessage(toast), [])
  const animate = useMemo(() => new Animate(setTime, onHideMessage), [])

  useEffect(() => {
    return () => {
      if (pause) animate.onResume()
      else animate.onPause()
    }
  }, [pause])
  useEffect(() => {
    return () => {
      animate.onStart()
    }
  }, [])

  return (
    <div
      className="absolute right-0 pointer-events-auto transition-all m-3 animate-toast-show"
      style={{ bottom: `${index * 5}px` }}
      onMouseOver={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div className="relative transition-transform hover:-translate-x-full animate-toast-show">
        <div className="relative overflow-hidden rounded-xl shadow-lg border-solid border-2 border-slate-400 bg-slate-200 text-slate-900 p-5">
          {toast.message}
          <div className="absolute h-1 w-full left-0 top-0">
            <div
              className="bg-orange-700 h-full transition-all"
              style={{ width: time + '%' }}
            ></div>
          </div>
        </div>
        <div className="absolute inset-0 -right-full"></div>
      </div>
    </div>
  )
}
export default function Toast() {
  const { messages, hideMessage } = toastAdapter((state) => state)
  const [pause, setPause] = useState(false)
  return (
    <div className="fixed right-0 bottom-0 overflow-hidden w-full h-full pointer-events-none">
      {messages.map((x, i) => (
        <T
          key={x.key}
          pause={pause}
          setPause={setPause}
          index={messages.length - i}
          toast={x}
          hideMessage={hideMessage}
        />
      ))}
    </div>
  )
}
