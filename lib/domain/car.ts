import { Detail } from './detail'

export class Car {
  thumbnail: string
  logo: string
  constructor(
    public readonly name: string,
    public readonly brand: string,
    public readonly year: string,
    public readonly details: Detail
  ) {
    this.thumbnail = `/assets/${brand}/${name}/${year}/thumbnail.jpg`
    this.logo = `/assets/${brand}/logo.jpg`
  }
  get keywords() {
    return Object.keys(this.details).concat(this.name, this.brand, this.year)
  }
  onSearch(query: string) {
    return this.keywords.includes(query)
  }
}
