import { Injectable } from '@angular/core';
import { OSDeviceState } from '../interfaces/helper-interfaces';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  onesignalAppID: string
  ok: boolean
  constructor() {
    this.onesignalAppID = '648ebde3-b0c0-41d0-8640-9b7f5ef2eecb'
  }

  initialOneSignal() {
    window['plugins'].OneSignal.setAppId(this.onesignalAppID)
    window['plugins'].OneSignal.setNotificationOpenedHandler(data => console.log('os opened:', data))
    window['plugins'].OneSignal.setNotificationWillShowInForegroundHandler(data => console.log('os rec:', data))
  }
  
  info(): Promise<OSDeviceState> {
    return new Promise(res => {
      window['plugins'].OneSignal.getDeviceState(s => res(s))
    })
  }


}
