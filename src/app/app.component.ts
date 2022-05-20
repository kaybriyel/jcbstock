import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private notificationService: NotificationService, platform: Platform) {
    platform.ready().then(e => {
      window['notificationService'] = this.notificationService
      this.notificationService.initialOneSignal()
      console.log('Platform is ready', e)
    })
  }
}
