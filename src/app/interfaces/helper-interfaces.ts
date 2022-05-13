
export interface IModelFindOpt {
  model: string
  search_key?: string
  search_value: number | string
  all?: boolean
}

export interface IProductNotification {
  is_enable: boolean
  trigger: number
}

export interface IModelCreateOpt {
  name: string,
  object: { id } | any
}