export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun.metered.ca:80" },
  {
    urls: "turn:turn.metered.ca:80",
    username: import.meta.env.VITE_TURN_USERNAME || "<METERED_USERNAME>",
    credential: import.meta.env.VITE_TURN_CREDENTIAL || "<METERED_CREDENTIAL>",
  },
  {
    urls: "turn:turn.metered.ca:443",
    username: import.meta.env.VITE_TURN_USERNAME || "<METERED_USERNAME>",
    credential: import.meta.env.VITE_TURN_CREDENTIAL || "<METERED_CREDENTIAL>",
  },
];
