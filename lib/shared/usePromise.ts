import { useEffect, useState } from 'react'

export default function usePromise<T>(promiseCreator: () => Promise<T>) {
  // 대기/완료/실패에 대한 상태 관리
  const [loading, setLoading] = useState(false)
  const [resolved, setResolved] = useState<T | null>(null)
  const [error, setError] = useState<unknown | null>(null)

  // useEffect에 등록하는 함수는 async로 작성하면 안됨
  // 함수 내부에 async 함수를 따로 만들어야 함
  // useEffect에서 반환하는 함수는 뒷정리 함수이기 때문
  useEffect(() => {
    const process = async () => {
      setLoading(true)
      try {
        const resolved = await promiseCreator()
        console.log(resolved)
        setResolved(resolved)
      } catch (e) {
        setError(e)
      }
      setLoading(false)
    }
    process()
  }, [])
  return [loading, resolved, error]
}
