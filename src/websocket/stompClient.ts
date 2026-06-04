import { Client } from "@stomp/stompjs";
import socketSlice from "@/stores/socketSlice";
import { store } from "@/stores/store";
import { AUTH_TOKEN_NAME } from "@/common/constants";

export const stompClient = new Client({
  brokerURL: "ws://localhost:9091/app_socket",

  reconnectDelay: 5000,

  beforeConnect: async () => {
    const data = await refreshToken();
    console.log(data);
    if (data.code === 200 && data.success === true) {
      let token = data.data.token;
      let userId = data.data.userId;
      localStorage.setItem(AUTH_TOKEN_NAME, token);
      localStorage.setItem("user_id", userId);
    }
    const token = localStorage.getItem("access_token");

    stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
  },

  debug: (str) => {
    console.log(str);
  },

  onConnect: () => {
    console.log("WebSocket Connected");

    store.dispatch(socketSlice.actions.setConnected(true));
  },

  onDisconnect: () => {
    console.log("WebSocket Disconnected");

    store.dispatch(socketSlice.actions.setConnected(false));
  },

  onWebSocketClose: (event) => {
    console.log("WebSocket Closed", event);

    store.dispatch(socketSlice.actions.setConnected(false));
  },

  onWebSocketError: (event) => {
    console.error("WebSocket Error", event);

    store.dispatch(socketSlice.actions.setConnected(false));
  },

  onStompError: (frame) => {
    console.error("Broker error", frame);

    store.dispatch(socketSlice.actions.setConnected(false));
  },
});

async function refreshToken(): Promise<any> {
  const response = await fetch(`http://localhost:9093/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  return await response.json();
}
