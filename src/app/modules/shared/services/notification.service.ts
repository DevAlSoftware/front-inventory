import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<string>();
  notifications$ = this.notificationSubject.asObservable();

  sendNotification(message: string) {
    this.notificationSubject.next(message);
  }
}
