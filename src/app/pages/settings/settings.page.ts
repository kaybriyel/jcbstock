import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  searchEnable: boolean
  searchValue: string
  local: any[]
  session: any[]

  constructor() { }

  ngOnInit() {
    this.loadData()
  }

  async loadData() {
    const local = Object.keys(localStorage).map(k => {
      return {
        key: k,
        count: JSON.parse(localStorage.getItem(k)).length
      }
    })

    const session = Object.keys(sessionStorage).map(k => {
      return {
        key: k
      }
    })

    this.local = local
    this.session = session
  }


  get filtered() {
    const smallNoSpace = t => t ? t.toLowerCase().replace(/ /g, '') : t
    return this.local.filter(p => smallNoSpace(p.name).includes(smallNoSpace(this.searchValue)))
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }

  deleteLocal(key: string) {
    localStorage.removeItem(key)
    this.loadData()
  }

  deleteSession(key: string) {
    sessionStorage.removeItem(key)
    this.loadData()
  }

  format(key: string) {
    return key.replace(/-/g, ' ')
  }
}
