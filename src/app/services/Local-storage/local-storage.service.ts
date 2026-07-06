import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getLocalStorageValue(key: string) {
    const localStorageValue = localStorage.getItem(key);
    return localStorageValue ? JSON.parse(localStorageValue) : null;
  }

  updateLocalStorage(key: string, data: any[] | string) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
