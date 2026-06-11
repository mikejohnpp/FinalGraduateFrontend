export const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" }, // STUN miễn phí Google
  { urls: "stun:stun.metered.ca:80" }, // STUN Metered
  {
    urls: "turn:turn.metered.ca:80", // TURN Metered (relay fallback)
    username: import.meta.env.VITE_TURN_USERNAME || "<METERED_USERNAME>",
    credential: import.meta.env.VITE_TURN_CREDENTIAL || "<METERED_CREDENTIAL>",
  },
  {
    urls: "turn:turn.metered.ca:443", // TURN qua HTTPS port
    username: import.meta.env.VITE_TURN_USERNAME || "<METERED_USERNAME>",
    credential: import.meta.env.VITE_TURN_CREDENTIAL || "<METERED_CREDENTIAL>",
  },
];
