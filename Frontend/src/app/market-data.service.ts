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
    
  }

  public connect(url: string): void {
    this.socket$ = webSocket(url);
      this.socketSubscription = this.receiveMessage().subscribe((msg) => {
        // this.messages.push(msg.message);
        this.sendData.emit(msg)
      })
  }

  public sendMessage(message: any): void {
    this.socket$.next({ message });
  }

  public receiveMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  public closeConnection(): void {
    if (this.socket$) {
      this.socketSubscription.unsubscribe(); // Unsubscribe from the subscription
      this.socket$.complete(); // Complete the socket
      console.log("Connection closed");
    } else {
      console.log("Socket not initialized");
    }
  }  
}