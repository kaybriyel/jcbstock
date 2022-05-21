import { ICurrency, ICurrencyLoader } from "../interfaces/model-interfaces";
import { ModelService } from "../services/model.service";

export default class Currency implements ICurrency, ICurrencyLoader {
  id: number;
  code: string;
  symbol: string;
  name: string;
  conversions?;

  static key: string = 'currencies'

  constructor(cur?: ICurrency) {
    if (cur && typeof cur === 'object') {
      Object.keys(cur).forEach(k => this[k] = cur[k])
    }
  }

  static async load(): Promise<Currency[]> {
    const { result } = await ModelService.getLocalData(Currency.key)
    return result ? result.map(c => new Currency(c)) : []
  }

  async save(): Promise<Currency> {
    let data
    if(isNaN(this.id)) {
      const { result } = await ModelService.create({ name: Currency.key, object: this })
      if(result) data = result.data
    } else {
      const { result } = await ModelService.update({ name: Currency.key, object: this })
      if(result) data = result.data
    }
    if(data) return new Currency(data)
  }


}

const s = localStorage.getItem(Currency.key)
if (!s) {
  (async () => {
    const currencies: ICurrency[] = [
      { id: 0, code: 'KHR', symbol: '៛', name: 'Riel' },
      { id: 1, code: 'USD', symbol: '$', name: 'US Dollar' }
    ]
    for (const cur of currencies)
      await ModelService.create({ name: Currency.key, object: cur })
  })()
}