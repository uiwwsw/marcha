import { Car } from '@lib/domain/car'
import { realDB } from '@lib/firebase/initFirebase'
import 'firebase/database'
import { child, get, ref, set } from 'firebase/database'
import { NextApiRequest, NextApiResponse } from 'next'
type Data = boolean

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const {
    year, name, brand, details
  } = JSON.parse(req.body)
    await set(ref(realDB, `car/${brand}/${name}/${year}`), new Car(name,brand,year,details))
    res.status(200).json(true)
}
