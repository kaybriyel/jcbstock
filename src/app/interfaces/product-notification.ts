import { IProductNotification } from "./helper-interfaces";

export default class ProductNotification implements IProductNotification {
  is_enable: boolean;
  trigger: number;

  constructor(noti?: ProductNotification) {
    if(noti && typeof noti === 'object') {
      this.is_enable = noti.is_enable
      this.trigger = noti.trigger
    }
  }

  toggle(state?: boolean) {
    if (state !== undefined)
      this.is_enable = state
    else
      this.is_enable = !this.is_enable
  }
}