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

  static async createCurrency(cat: ICurrency): Promise<Currency> {
    return await ModelService.create({ name: Currency.key, object: cat })
  }


}

const s = localStorage.getItem(Currency.key)
if (!s) {
  (async () => {
    const currencies: Currency[] = [
      { id: 0, code: 'KHR', symbol: '៛', name: 'Riel' },
      { id: 1, code: 'USD', symbol: '$', name: 'US Dollar' }
    ]
    for (const cur of currencies)
      await ModelService.create({ name: Currency.key, object: cur })
  })()
}