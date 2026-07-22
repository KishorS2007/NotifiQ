import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(onMessageReceived) {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.connected = true;
      // console.log('Connected to WebSocket: ' + frame);
      
      // Subscribe to personal queue for real-time notifications
      this.client.subscribe('/user/queue/notifications', (message) => {
        // console.log("Received raw STOMP message body:", message.body);
        if (message.body) {
          try {
            const notification = JSON.parse(message.body);
            // console.log("Parsed notification:", notification);
            onMessageReceived(notification);
          } catch (e) {
            // console.error("Failed to parse STOMP message body:", e);
          }
        }
      });
    };

    this.client.onStompError = (frame) => {
      // console.error('Broker reported error: ' + frame.headers['message']);
      // console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client !== null) {
      this.client.deactivate();
    }
    this.connected = false;
    // console.log("Disconnected from WebSocket");
  }
}

export const wsService = new WebSocketService();
