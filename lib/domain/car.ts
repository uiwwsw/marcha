import { Detail } from './detail'

export class Car {
  thumbnail: string
  logo: string
  spec: Set<string>
  constructor(
    public readonly name: string,
    public readonly brand: string,
    public readonly year: string,
    ...details: Detail[]
  ) {
    this.thumbnail = `/assets/${brand}/${name}/${year}/thumbnail.jpg`
    this.logo = `/assets/${brand}/logo.jpg`
    this.spec = new Set(details.map((x) => x.value).concat(name, brand, year))
  }
  onSearch(query: string) {
    return this.spec.has(query)
  }
}
