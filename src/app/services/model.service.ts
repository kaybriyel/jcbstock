import { Injectable } from '@angular/core';
import { IModelCreateOpt, IModelFindOpt } from '../interfaces/helper-interfaces';
import { ITimestamp } from '../interfaces/model-interfaces';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor() { }

  static async getLocalData(key: string) {
    try {
      return { result: JSON.parse(localStorage.getItem(key)) }
    } catch (error) {
      return { error }
    }
  }

  static async getSessionData(key: string) {
    try {
      return { result: JSON.parse(sessionStorage.getItem(key)) }
    } catch (error) {
      return { error }
    }
  }

  static async saveLocalData(key: string, payload: any) {
    localStorage.setItem(key, JSON.stringify(payload))
  }

  static async saveSessionData(key: string, payload: any) {
    sessionStorage.setItem(key, JSON.stringify(payload))
  }

  static getAPIData(key: string, params?: URLSearchParams, opt?: RequestInit) {
    return ApiService.get(ApiService.API_URL + key, params, opt)
  }

  static async find(opt: IModelFindOpt) {
    const { result } = await ModelService.getLocalData(opt.model)
    const key = opt.search_key || 'id'
    if (result && opt.all) return result.filter(i => i[key] == opt.search_value)
    else if (result) return result.find(i => i[key] == opt.search_value)
    return opt.all ? [] : undefined
  }

  static async create(opt: IModelCreateOpt) {
    return ApiService.post(ApiService.API_URL + opt.name, { body: JSON.stringify(opt.object) })
  }

  static async delete(opt: { name: string; id: number; }) {
    return ApiService.delete(ApiService.API_URL + opt.name, opt.id)
  }

  static async update(opt: { name: string, object: any }) {
    return ApiService.put(ApiService.API_URL + opt.name, opt.object.id, { body: JSON.stringify(opt.object) })
  }

}



/*
static async create(opt: IModelCreateOpt) {
  const { result } = await ModelService.getLocalData(opt.name)
  
  const timestamp: ITimestamp = {
    created_at: new Date,
    updated_at: new Date,
    format: ''
  }
  opt.object.timestamp = timestamp

  if(result && result.length) {
    const last = result.pop()
    opt.object.id = last.id + 1
    result.push(last, opt.object)
    await ModelService.saveLocalData(opt.name, result)
  } else {
    opt.object.id = 0
    await ModelService.saveLocalData(opt.name, [opt.object])
  }
  return opt.object
}

  static async delete(opt: { name: string; id: number; }) {
    const { result } = await ModelService.getLocalData(opt.name)
    if(result) {
      const idx = result.findIndex(m => m.id === opt.id)
      if(idx > -1) {
        result.splice(idx, 1)
        ModelService.saveLocalData(opt.name, result)
        return true
      }
    }
  }

    static async update(opt: { name: string, object: any }) {
    const { result } = await ModelService.getLocalData(opt.name)
    if (result) {
      const idx = result.findIndex(i => i.id === opt.object.id)
      if (idx > -1) {
        opt.object.timestamp.updated_at = new Date
        result[idx] = opt.object
        await ModelService.saveLocalData(opt.name, result)
        return true
      }
    }
    return false
  }

*/