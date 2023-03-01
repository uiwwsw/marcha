import { Car } from '@lib/domain/car'
import { Detail } from '@lib/domain/detail'
import { injectable, inject } from 'inversify'
import { FirebaseService, FirebaseSerSym } from './firebase'
export const CarSerSym = Symbol.for('CarSerSym')
// Observer
@injectable()
export class CarService {
  FirebaseSerSym: FirebaseService
  carInfo: string[] | undefined
  constructor(@inject(FirebaseSerSym) FirebaseSerSym: FirebaseService) {
    this.FirebaseSerSym = FirebaseSerSym
    // this.FirebaseSerSym.observeData('carBrand', (x: string[]) => this.carBrand = x)
  }
  async getCarBrand() {
    return this.FirebaseSerSym.readData<string[]>('carBrand')
  }
  async getCarInfo() {
    this.carInfo = await this.FirebaseSerSym.readData<string[]>('carInfo')
    return this.carInfo
  }
  updateCarInfo(carInfo: string) {
    this.carInfo?.push(carInfo)
    this.FirebaseSerSym.writeData('carInfo', this.carInfo)
    return this.carInfo;
  }
  async setCar(
    brand: string,
    name: string,
    year: string,
    ...details: Detail[]
  ) {
    await this.FirebaseSerSym.writeData(
      `${brand}/${name}/${year}`,
      new Car(name, brand, year, ...details),
    )
  }

  getCars(key: string) {
    return this.FirebaseSerSym.readData<Car>(key)
  }
}
