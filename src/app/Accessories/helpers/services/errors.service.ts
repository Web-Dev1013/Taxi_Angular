import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor() { }
  notify: Subject<any> = new Subject<any>();
  data: Subject<any> = new Subject<any>();
    onNotify(event) {
            this.notify.next(event);
    }
}
