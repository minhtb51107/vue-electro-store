import { ref } from 'vue';
import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';

// URL của Backend WebSocket
const WS_ENDPOINT = 'http://localhost:8080/ws'; 

export function useWebSocket() {
  const stompClient = ref(null);
  const isConnected = ref(false);

  const connect = (onConnectedCallback) => {
    // Nếu đã kết nối rồi thì thôi
    if (stompClient.value && stompClient.value.connected) return;

    const socket = new SockJS(WS_ENDPOINT);
    stompClient.value = Stomp.over(socket);
    
    // Tắt log debug của Stomp để đỡ rối console
    stompClient.value.debug = () => {};

    stompClient.value.connect(
      {}, // Headers (nếu cần token thì thêm vào đây: { 'Authorization': 'Bearer ...' })
      (frame) => {
        isConnected.value = true;
        console.log('WS Connected: ' + frame);
        if (onConnectedCallback) onConnectedCallback();
      },
      (error) => {
        console.error('WS Error:', error);
        isConnected.value = false;
        // Tự động reconnect sau 5s nếu mất kết nối
        setTimeout(() => connect(onConnectedCallback), 5000);
      }
    );
  };

  const subscribe = (topic, callback) => {
    if (stompClient.value && isConnected.value) {
      stompClient.value.subscribe(topic, callback);
      console.log('Subscribed to:', topic);
    } else {
      console.warn('WS not connected. Cannot subscribe to', topic);
    }
  };

  const disconnect = () => {
    if (stompClient.value) {
      stompClient.value.disconnect(() => {
        console.log('WS Disconnected');
        isConnected.value = false;
      });
    }
  };

  return {
    connect,
    subscribe,
    disconnect,
    isConnected
  };
}