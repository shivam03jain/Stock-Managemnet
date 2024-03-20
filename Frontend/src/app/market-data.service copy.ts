import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subscription } from 'rxjs';

@Injectable({
 providedIn: 'root',
})
export class MarketDataService {
  private socket$!: WebSocketSubject<any>;
  socketSubscription!: Subscription;
  sendData : EventEmitter<any> = new EventEmitter<any>;

  constructor() {
    this.connect('ws://localhost:3001/ws');
      this.socketSubscription = this.receiveMessage().subscribe((msg) => {
        // this.messages.push(msg.message);
        this.sendData.emit(msg)
      })
  }

  public connect(url: string): void {
    this.socket$ = webSocket(url);
  }

  public sendMessage(message: any): void {
    this.socket$.next({ message });
  }

  public receiveMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  public closeConnection(): void {
    this.socket$.complete();
    this.socketSubscription.unsubscribe();
  }
}