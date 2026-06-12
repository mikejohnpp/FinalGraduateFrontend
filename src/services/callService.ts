import { stompClient } from "@/websocket/stompClient";

export interface CallSignalPayload {
  toUserId: number;
  [key: string]: any;
}

export interface CallSignalRequest {
  type: "OFFER" | "ANSWER" | "ICE" | "REJECT" | "HANGUP" | "USER_OFFLINE";
  payload: CallSignalPayload;
}

class CallService {
  /**
   * Gửi một tín hiệu WebRTC qua WebSocket
   */
  public sendSignal(type: CallSignalRequest["type"], payload: CallSignalPayload) {
    if (stompClient.active) {
      const request: CallSignalRequest = {
        type,
        payload,
      };
      stompClient.publish({
        destination: "/app/call.signal",
        body: JSON.stringify(request),
      });
    } else {
      console.error("STOMP Client is not connected. Cannot send call signal.");
    }
  }

  /**
   * Lắng nghe các sự kiện gọi đến thông qua private queue của user
   */
  public subscribeToCallSignals(callback: (signal: CallSignalRequest) => void) {
    if (stompClient.active) {
      return stompClient.subscribe("/user/queue/call", (message) => {
        try {
          const signal: CallSignalRequest = JSON.parse(message.body);
          callback(signal);
        } catch (error) {
          console.error("Failed to parse incoming call signal:", error);
        }
      });
    }
    return null;
  }
}

export default new CallService();
