import 'reflect-metadata'
import { Container } from 'inversify'
import { CarSerSym, CarService } from './car'
import { FirebaseSerSym, FirebaseService } from './firebase'

const container = new Container()

container.bind<CarService>(CarSerSym).to(CarService).inSingletonScope()
container
  .bind<FirebaseService>(FirebaseSerSym)
  .to(FirebaseService)
  .inSingletonScope()
export { container }
