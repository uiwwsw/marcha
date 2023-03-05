import { toastAdapter } from '@lib/store/toastAdapter'
import { Car } from '@lib/domain/car'
import { CarSerSym, CarService } from '@lib/service/car'
import { container } from '@lib/service/container'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
export interface Props {
  data: Car
}

const Post = (props: Props) => {
  const showMessage = toastAdapter((state) => state.showMessage)
  useEffect(() => {
    return () => {
      if (!props?.data) showMessage({ message: '오류발생' })
      console.log(props?.data)
    }
  }, [])
  return <p></p>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { brand, name, year } = context.query
  const carService = container.get<CarService>(CarSerSym)
  const response = await carService.getCars(`${brand}/${name}/${year}`)
  if (!response) throw new Error('데이터가 없어요.')
  return {
    props: {
      data: response as Car,
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
export default Post
