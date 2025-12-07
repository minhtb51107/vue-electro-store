import { Client } from '@stomp/stompjs';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useAppStore } from '@/store/app.store';

let client = null;

export function useWebSocket() {
  const authStore = useAuthStore();
  const appStore = useAppStore();

  // --- LOGIC URL DYNAMIC ---
  // Lấy URL API từ biến môi trường (ví dụ: http://localhost:8080/api/v1)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
  
  // Chuyển đổi sang WebSocket URL:
  // 1. http -> ws, https -> wss
  // 2. Bỏ suffix '/api/v1' nếu có, vì endpoint WS thường nằm ở root context (ví dụ: localhost:8080/ws)
  const wsUrl = apiUrl.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '/ws');
  // -------------------------

  const connect = () => {
    if (!authStore.accessToken || client?.active) return;

    client = new Client({
      brokerURL: wsUrl, // Sử dụng URL dynamic
      connectHeaders: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket at', wsUrl);
        
        client.subscribe('/user/queue/notifications', (message) => {
          try {
            const notification = JSON.parse(message.body);
            appStore.notify(notification.message, 'info');
          } catch (e) {
            console.error('Lỗi parse notification', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      }
    });
    
    client.activate();
  };

  const disconnect = () => {
    if (client) {
      client.deactivate();
      client = null;
    }
  };

  return { connect, disconnect };
}