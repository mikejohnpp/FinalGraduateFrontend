import chatSlice from "@/stores/chatSlice";
import { stompClient } from "./stompClient";
import { store } from "@/stores/store";
export const connectSocket = () => {
  if (!stompClient.active) {
    stompClient.activate();
  }
};

export const disconnectSocket = () => {
  if (stompClient.active) {
    stompClient.deactivate();
  }
};

// export const subscribeConversation = (conversationId: number, callback: (message: any) => void) => {
//   return stompClient.subscribe(`/topic/conversation/${conversationId}`, (message: any) => {
//     callback(JSON.parse(message.body));
//   });
// };

export const sendMessage = (message: any) => {
  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(message),
  });
};

export const sendTypingIndicator = (payload: { conversationId: number; isTyping: boolean }) => {
  if (stompClient.active) {
    stompClient.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify(payload),
    });
  }
};
