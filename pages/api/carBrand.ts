import 'firebase/database'
import { ref, onValue, get, child } from 'firebase/database'
import { realDB } from '@lib/firebase/initFirebase'
import { NextApiRequest, NextApiResponse } from 'next'
type Data = string[]

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const dbRef = ref(realDB)
  const snapshot = await get(child(dbRef, 'carBrand'))
  res.status(200).json(snapshot.val())
}
