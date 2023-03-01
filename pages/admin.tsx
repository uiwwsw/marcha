import { toastAdapter } from '@lib/adapter/toastAdapter'
import { Detail } from '@lib/domain/detail'
import { CarSerSym, CarService } from '@lib/service/car'
import { container } from '@lib/service/container'
import { GetServerSideProps } from 'next'
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
const year = new Array(10).fill(null)
const nowYear = new Date().getFullYear()
interface Props {
  carBrand: string[]
  carInfo: string[]
}
const Admin = (props: Props) => {
  const {carBrand,carInfo} = props
  const showMessage = toastAdapter((state) => state.showMessage)
  const [details, setDetails] = useState<Detail[]>([])
  const btnHandleChange = useCallback(() => {
    setDetails([...details, { key: '키없음', value: '값없음' }])
  }, [])
  const keyInputHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, key: string, index: number) => {
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
      const carService = container.get<CarService>(CarSerSym)

      await carService.setCar(brand, name, year, ...details)
      showMessage({ message: '작성완료' })
      form.reset()
    },
    [details],
  )
  return (
    <form onSubmit={handleSubmit}>
      <select name="carBrand" id="carBrand">
        {carBrand.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      <br />
      <label htmlFor="carName">이름</label>
      <input type="text" id="carName" name="carName" required />
      <br />
      <select name="carYear" id="carYear" required>
        {year.map((_, i) => (
          <option key={nowYear - i} value={nowYear - i}>
            {nowYear - i}
          </option>
        ))}
      </select>
      <button onClick={btnHandleChange}>ddd</button>
      {details.map((x, i) => (
        <div key={i + 'customInput'}>
          <label htmlFor={x.key}>{x.key}</label>
          <input
            type="text"
            id={x.key}
            name={x.key}
            required
            onChange={(e) => keyInputHandleChange(e, x.key, i)}
          />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const carService = container.get<CarService>(CarSerSym)
  const [carBrand, carInfo] = await Promise.all([carService.getCarBrand(), carService.getCarInfo()])
  if (!carBrand || !carInfo) throw new Error('데이터가 없어요.')
  return {
    props: {
      carBrand,
      carInfo
    },
  }
  // try {
  //   const { brand, name, year } = context.query
  //   const car = container.get<CarService>(CarSerSym)
  //   const response = await car.getCars(`${brand}/${name}/${year}`)
  //   if (!response) throw new Error('데이터가 없어요.')
  //   return {
  //     props: {
  //       data: response,
  //     },
  //   }
  // } catch {
  //   return {
  //     props: {},
  //   }
  // }
}

export default Admin
