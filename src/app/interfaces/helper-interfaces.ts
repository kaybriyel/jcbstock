
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

export interface OSDeviceState {
  hasNotificationPermission: boolean
  pushDisabled: boolean
  subscribed: boolean
  userId: string
  pushToken: string
}

export interface OSNotification {
  notificationId: string
  body: string
  title: string
  priority: string
  fromProjectNumber: number
  androidNotificationId: number
  additionalData: {}
  rawPayload: {
      "google.delivered_priority": number,
      "google.sent_time": number,
      "google.ttl": number,
      "google.original_priority": string,
      "custom": string,
      "from": number,
      "alert": string,
      "title": string,
      "google.message_id": string,
      "google.c.sender.id": number
  }
}