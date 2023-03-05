import { realDB } from '@lib/firebase/initFirebase';
import 'firebase/database';
import { child, get, ref, set } from 'firebase/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

type Data = string[] | boolean

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  switch(req.method) {
    case 'GET':
      const snapshot = await get(child(ref(realDB), 'carInfo'))
      res.status(200).json(Object.values(snapshot.val()))
      break;
    case 'POST':
      const uuid = uuidv4(); 
      await set(ref(realDB, `carInfo/${uuid}` ), JSON.parse(req.body))
      res.status(200).json(true)
  }
}
