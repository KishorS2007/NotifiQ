import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscribers = 0;
    this.onMessageReceivedCallback = null;
  }

  connect(onMessageReceived) {
    this.onMessageReceivedCallback = onMessageReceived;
    this.subscribers++;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    if (this.client && this.client.active) {
      return; // Already connecting or connected
    }

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
            if (this.onMessageReceivedCallback) {
              this.onMessageReceivedCallback(notification);
            }
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
    this.subscribers--;
    
    // Delay deactivation to handle React 18 Strict Mode double-invocations
    setTimeout(() => {
      if (this.subscribers <= 0) {
        this.subscribers = 0;
        if (this.client !== null) {
          this.client.deactivate();
        }
        this.connected = false;
        // console.log("Disconnected from WebSocket");
      }
    }, 100);
  }
}

export const wsService = new WebSocketService();
