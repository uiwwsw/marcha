import { realDB } from '@lib/firebase/initFirebase'
import { carInfoAdapter } from '@lib/store/carInfoAdapter'
import { toastAdapter } from '@lib/store/toastAdapter'
import { useQueries } from '@tanstack/react-query'
import { child, get, onValue, ref } from 'firebase/database'
import { GetServerSideProps } from 'next'
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
const year = new Array(10).fill(null)
const nowYear = new Date().getFullYear()
// interface Props {
//   carBrand: string[]
//   carInfo: string[]
// }
const Admin = () => {
  const [carBrand, carInfo] = useQueries({
    queries: [
      {
        queryKey: ['carBrand'],
        queryFn: async () => {
          const res = fetch('/api/carBrand')
          return (await res).json() as Promise<string[]>
        },
        staleTime: Infinity,
      },
      {
        queryKey: ['carInfo'],
        queryFn: async () => {
          const res = fetch('/api/carInfo')
          return (await res).json() as Promise<string[]>
        },
        staleTime: Infinity,
      },
    ],
  })
  const showMessage = toastAdapter((state) => state.showMessage)
  const [details, setDetails] = useState<{ key: string; value: string }[]>([])
  const addHandleChange = useCallback(() => {
    setDetails([...details, { key: '', value: '' }])
  }, [details])
  const removeHandleChange = useCallback(() => {
    details.pop()
    setDetails([...details])
  }, [details])
  const keyInputHandleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      key: string,
      index: number,
    ) => {
      details[index].key = e.target.value
      setDetails([...details])
    },
    [details],
  )
  const valueInputHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: string, index: number) => {
      details[index].value = e.target.value
      setDetails([...details])
    },
    [details],
  )
  // During hydration `useEffect` is called. `window` is available in `useEffect`. In this case because we know we're in the browser checking for window is not needed. If you need to read something from window that is fine.
  // By calling `setColor` in `useEffect` a render is triggered after hydrating, this causes the "browser specific" value to be available. In this case 'red'.
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const form = event.target as HTMLFormElement
      const brand = form.carBrand.value as string
      const name = form.carName.value as string
      const year = form.carYear.value as string
      const detailsObj = details.reduce((a,v) => ({...a,[v.key]:v.value}), {})
      const newDetails = details.map(x => x.key).filter(x => !carInfo.data?.includes(x))
      await fetch('/api/car', {
        method: 'POST',
        body: JSON.stringify({brand,name,year,details: detailsObj})
      })
        while (newDetails.length) {
          await fetch('/api/carInfo', {
            method: 'POST',
            body: JSON.stringify(newDetails.pop())
          })
        }
        
        setDetails([])
      carInfo.refetch()
      showMessage({ message: '작성완료' })
      form.reset()
    },
    [details],
  )
  return (
    <form onSubmit={handleSubmit}>
      {carBrand.isSuccess ? (
        <select defaultValue={carBrand.data[0]} name="carBrand" id="carBrand">
          {carBrand.data.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      ) : (
        '로딩중'
      )}
      <br />
      <label htmlFor="carName">이름</label>
      <input type="text" id="carName" name="carName" required />
      <br />
      {carInfo.isSuccess ? (
        <select defaultValue={nowYear} name="carYear" id="carYear" required>
          {year.map((_, i) => (
            <option key={nowYear - i} value={nowYear - i}>
              {nowYear - i}
            </option>
          ))}
        </select>
      ) : (
        '로딩중'
      )}
      <button type="button" onClick={addHandleChange}>
        더하기
      </button>
      <button type="button" onClick={removeHandleChange}>
        빼기
      </button>
      {details.map((x, i) => (
        <div key={i + 'customInput'}>
          {/* carInfo */}
          {carInfo.data?.concat('').includes(x.key) ? (
            <select
              defaultValue=""
              onChange={(e) => keyInputHandleChange(e, x.key, i)}
            >
              <option value="">키없음</option>
              <option value="신규">추가하기</option>
              {carInfo.data?.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          ) : (
            <>
              <label htmlFor={x.key}>{x.key}</label>
              <input
                type="text"
                id={x.key}
                name={x.key}
                required
                onChange={(e) => keyInputHandleChange(e, x.key, i)}
              />
            </>
          )}

          <label htmlFor={x.value}>{x.value}</label>
          <input
            type="text"
            id={x.value}
            name={x.value}
            required
            onChange={(e) => valueInputHandleChange(e, x.value, i)}
          />
        </div>
      ))}
      <br />
      <button type="submit">생성하기</button>
    </form>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const [carBrand, carInfo] = await Promise.all([fetch('/api/carBrand'),fetch('/api/carInfo')])
//   return {
//     props: {
//       carBrand: carBrand,
//       carInfo: carInfo
//     },
//   }
// }

export default Admin
