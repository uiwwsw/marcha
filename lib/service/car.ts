import { Car } from '@lib/domain/car'
import { Detail } from '@lib/domain/detail'
import { injectable, inject } from 'inversify'
import { FirebaseService, FirebaseSerSym } from './firebase'
export const CarSerSym = Symbol.for('CarSerSym')
// Observer
@injectable()
export class CarService {
  FirebaseSerSym: FirebaseService
  constructor(@inject(FirebaseSerSym) FirebaseSerSym: FirebaseService) {
    this.FirebaseSerSym = FirebaseSerSym
    // this.FirebaseSerSym.observeData('carBrand', (x: string[]) => this.carBrand = x)
  }
  async getCarBrand() {
    return this.FirebaseSerSym.readData('carBrand')
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

  async getCars(key: string) {
    return await this.FirebaseSerSym.readData(key)
  }
}
