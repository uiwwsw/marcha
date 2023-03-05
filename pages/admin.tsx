import { carInfoAdapter } from '@lib/adapter/carInfoAdapter'
import { toastAdapter } from '@lib/adapter/toastAdapter'
import { CarSerSym, CarService } from '@lib/service/car'
import { container } from '@lib/service/container'
import { GetServerSideProps } from 'next'
import {
  ChangeEvent, FormEvent, useCallback, useEffect, useState
} from 'react'
const year = new Array(10).fill(null)
const nowYear = new Date().getFullYear()
interface Props {
  carBrand: string[]
  carInfo: string[]
}
const Admin = (props: Props) => {
  const {carBrand} = props
  const {carInfo, setCarInfo} = carInfoAdapter((state) => state);
  useEffect(() => {
    return () => setCarInfo(props.carInfo)
  }, [])
  const showMessage = toastAdapter((state) => state.showMessage)
  const [details, setDetails] = useState<{key:string;value:string}[]>([])
  const addHandleChange = useCallback(() => {
    setDetails([...details, { key: '', value: '' }])
  }, [details])
  const removeHandleChange = useCallback(() => {
    details.pop();
    setDetails([...details])
  }, [details])
  const keyInputHandleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, key: string, index: number) => {
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

      await carService.setCar(brand, name, year, details.reduce((a,v) => ({...a,[v.key]:v.value}), {}))
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
          <option selected={i === 0} key={nowYear - i} value={nowYear - i}>
            {nowYear - i}
          </option>
        ))}
      </select>
      <button type='button' onClick={addHandleChange}>더하기</button>
      <button type='button' onClick={removeHandleChange}>빼기</button>
      {details.map((x, i) => (
        <div key={i + 'customInput'}>
          {/* carInfo */}
          {carInfo.concat('').includes(x.key) ? 
            <select onChange={(e) => keyInputHandleChange(e, x.key, i)}>
              <option value="" selected={true}>키없음</option>
              <option value="신규">추가하기</option>
              {carInfo?.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
            :
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
          }
          
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
