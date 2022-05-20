import { ITimestamp, IUnit, IUnitLoader } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";

export default class Unit implements IUnit, IUnitLoader {

  id: number;
  name: string;
  abbr: string;
  conversions: [];
  static key: string = 'units';

  constructor(u?: IUnit) {
    if (u && typeof u === 'object') {
      Object.keys(u).forEach(k => this[k] = u[k])
    }
  }
  timestamp: ITimestamp;

  static async load(): Promise<Unit[]> {
    const { result } = await ModelService.getLocalData(Unit.key)
    return result ? result.map(c => new Unit(c)) : []
  }

  get is_valid(): boolean {
    return this.name && this.abbr && !isNaN(this.id)
  }

  static async createUnit(u: IUnit): Promise<Unit> {
    return await ModelService.create({ name: Unit.key, object: u })
  }

  static default() {
    return new Unit({ name: 'Kilogram', abbr: 'kg', id: 0 })
  }
}

const data = localStorage.getItem('units')
if (!data) {
  (async () => {
    const list = [
      { id: 0, name: 'Kilogram', abbr: 'kg' },
      { id: 1, name: 'Liter', abbr: 'L' },
      { id: 2, name: 'Milliliter', abbr: 'ml' }
    ]
    for(const u of list)
      await ModelService.create({ name: Unit.key, object: u })
  })()
}