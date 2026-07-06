import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  private stompClient: any;
  private messageSubject = new BehaviorSubject<any>(null);

  // Observable that components can subscribe to
  public messages$ = this.messageSubject.asObservable();

  constructor() { }

  connect() {

    const socket = new SockJS(this.webSocketEndPoint); // Replace with your server URL and endpoint
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({withCredentials:true}, (frame: any) => {

   

      // Subscribe to a topic
      this.stompClient.subscribe('/topic/order-report', (message: any) => {
        this.messageSubject.next({});        
      });

     

    }, (error: any) => {
      console.log('WebSocket connection error: ' + error);
      // Optional: Implement reconnection logic here
      setTimeout(() => {
        this.connect(); // Reconnect after a delay
      }, 5000); // Adjust the delay as needed
    });
  }


  public disconnect() {
    // if (this.stompClient.active) {
    //   this.stompClient.deactivate(() => {
    //     console.log('Disconnected');
    //   });
    // }
  }

}
