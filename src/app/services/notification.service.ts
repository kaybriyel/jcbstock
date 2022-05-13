import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx'
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  ok: boolean

  constructor(private oneSignal: OneSignal, private platform: Platform) {
    this.platform.ready().then(() => {
      this.initNotificationAPI()
    })
  }

  private initNotificationAPI() {
    this.ok = false
    this.oneSignal.startInit('648ebde3-b0c0-41d0-8640-9b7f5ef2eecb', '352082364088');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      alert('Receive Notification')
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
      alert('Open Notification')
    });

    this.oneSignal.endInit();
    this.ok = true
  }
}
