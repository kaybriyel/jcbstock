import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ApiService } from './services/api.service';
import { ModelService } from './services/model.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private notificationService: NotificationService, platform: Platform) {
    platform.ready().then(() => {
      window['notificationService'] = this.notificationService
      this.notificationService.initialOneSignal()
      console.log(platform)
      window['modelService'] = ModelService
      window['apiService'] = ApiService
    })
    // platform.backButton.subscribe(e => console.log('back button pressed', e))
  }
}
