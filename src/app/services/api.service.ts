import { Injectable } from '@angular/core';

const defaultOptions = () => ({
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.token}`,
    'Content-Type': 'application/json'
  }
})

const request = async (url: string, options?: RequestInit) => {
  if(!options) options = defaultOptions()
  else if(!options.headers) options.headers = defaultOptions().headers
  else options.headers = { ...defaultOptions().headers, ...options.headers }
  try {
    const res = await fetch(url, options)
    if(res.ok)
      return { result: await res.json() }
    else return { error: await res.json() }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  static API_URL: string = 'https://jcbakery.herokuapp.com/api/'

  constructor() {}

  static get(url: string, params?: URLSearchParams, options?: RequestInit) {
    if (params) url += '?' + params.toString()
    if(options) options.method = 'GET'
    return request(url, options)
  }

  static post(url: string, options: RequestInit) {
    if(options) options.method = 'POST'
    else options = { method: 'POST' }
    return request(url, options)
  }

  static put(url: string, id: number, options: RequestInit) {
    if(options) options.method = 'PUT'
    else options = { method: 'PUT' }
    return request(`${url}/${id}`, options)
  }

  static delete(url: string, id: number, options?: RequestInit) {
    if(options) options.method = 'DELETE'
    else options = { method: 'DELETE' }
    return request(`${url}/${id}`, options)
  }

}
