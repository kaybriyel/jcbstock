import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  async get(url: string, params: {}, options: RequestInit) {
    if (params) {
      const urlParams = new URLSearchParams()
      for (const key in params) urlParams.append(key, params[key])
      if (urlParams.toString() !== '') url += '?' + urlParams.toString()
    }
    try {
      const res = await fetch(url, options)
      return { result: res.json() }
    } catch (error) {
      console.error(error)
      return { error }
    }
  }

}
