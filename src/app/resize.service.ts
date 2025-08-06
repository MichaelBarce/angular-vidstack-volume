import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResizeState } from '../app/resizeState';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  name: any = null;

  public resizeState = new BehaviorSubject<ResizeState>(this.name);
  public shareResizeState = this.resizeState.asObservable();

  constructor() { }

  setResizeState(data: ResizeState) {
    this.resizeState.next(data);
  }

  getResizeState(): any {
    return this.resizeState;
  }

}

