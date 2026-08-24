import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import callService from "@/services/callService";
import type { CallSignalRequest } from "@/services/callService";
import { ICE_SERVERS } from "@/config/webrtcConfig";
import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { toast } from "sonner";

export type CallState = "IDLE" | "CALLING" | "RINGING" | "IN_CALL";

interface CallContextType {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  remoteUserId: number | null;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  startCall: (toUserId: number, conversationId: number, isVideo?: boolean) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  hangup: () => void;
  toggleMuteAudio: () => void;
  toggleMuteVideo: () => void;
}

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  const remoteUserIdRef = useRef<number | null>(null);
  const conversationIdRef = useRef<number | null>(null);
  const callTypeRef = useRef<"AUDIO" | "VIDEO">("VIDEO");
  const callStartTimeRef = useRef<number | null>(null);

  const ringtoneAudio = useRef<HTMLAudioElement | null>(null);
  const callingAudio = useRef<HTMLAudioElement | null>(null);

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const isSocketConnected = useSelector((state: RootState) => state.socket.connected);

  useEffect(() => {
    remoteUserIdRef.current = remoteUserId;
  }, [remoteUserId]);

  useEffect(() => {
    ringtoneAudio.current = new Audio("/sounds/ringtone.mp3");
    ringtoneAudio.current.loop = true;

    callingAudio.current = new Audio("/sounds/calling.mp3");
    callingAudio.current.loop = true;

    return () => {
      ringtoneAudio.current?.pause();
      callingAudio.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (callState === "CALLING") {
      callingAudio.current?.play().catch((e) => console.log("Auto-play prevented:", e));
    } else {
      callingAudio.current?.pause();
      if (callingAudio.current) callingAudio.current.currentTime = 0;
    }

    if (callState === "RINGING") {
      ringtoneAudio.current?.play().catch((e) => console.log("Auto-play prevented:", e));
    } else {
      ringtoneAudio.current?.pause();
      if (ringtoneAudio.current) ringtoneAudio.current.currentTime = 0;
    }
  }, [callState]);

  const flushCandidates = useCallback(async () => {
    const pc = peerConnection.current;
    if (!pc || !pc.remoteDescription) return;
    const candidates = pendingCandidates.current;
    pendingCandidates.current = [];
    for (const candidate of candidates) {
      try {
        await pc.addIceCandidate(candidate);
      } catch (e) {
        console.warn("Failed to add buffered ICE candidate:", e);
      }
    }
  }, []);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallState("IDLE");
    setRemoteUserId(null);
    remoteUserIdRef.current = null;
    localStreamRef.current = null;
    peerConnection.current = null;
    conversationIdRef.current = null;
    callStartTimeRef.current = null;
    pendingCandidates.current = [];
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (callState === "CALLING") {
      timeoutId = setTimeout(() => {
        toast.error("Người dùng không bắt máy.");
        if (remoteUserIdRef.current && conversationIdRef.current) {
          callService.sendSignal("HANGUP", {
            toUserId: remoteUserIdRef.current,
            conversationId: conversationIdRef.current,
            callType: callTypeRef.current,
            durationSeconds: 0,
          });
        }
        cleanup();
      }, 60000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [callState, cleanup]);

  const initPeerConnection = useCallback((remoteId: number) => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        callService.sendSignal("ICE", {
          toUserId: remoteId,
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current = pc;
    return pc;
  }, []);

  const startCall = async (toUserId: number, conversationId: number, isVideo: boolean = true) => {
    setRemoteUserId(toUserId);
    remoteUserIdRef.current = toUserId;
    conversationIdRef.current = conversationId;
    callTypeRef.current = isVideo ? "VIDEO" : "AUDIO";
    setCallState("CALLING");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;

      const pc = initPeerConnection(toUserId);
      // Khúc này nghĩa là sẽ để cho webRTC biết là lấy stream từ nguồn nào
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      callService.sendSignal("OFFER", {
        toUserId,
        sdpOffer: offer.sdp,
        callType: isVideo ? "VIDEO" : "AUDIO",
        conversationId,
      });
    } catch (error) {
      console.error("Error accessing media devices.", error);
      cleanup();
    }
  };

  const acceptCall = async () => {
    const currentRemoteId = remoteUserIdRef.current;
    if (!peerConnection.current || !currentRemoteId) return;

    setCallState("IN_CALL");
    callStartTimeRef.current = Date.now();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;

      stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      callService.sendSignal("ANSWER", {
        toUserId: currentRemoteId,
        sdpAnswer: answer.sdp,
      });
    } catch (error) {
      console.error("Error accepting call.", error);
      rejectCall();
    }
  };

  const rejectCall = () => {
    const currentRemoteId = remoteUserIdRef.current;
    if (currentRemoteId) {
      callService.sendSignal("REJECT", {
        toUserId: currentRemoteId,
        conversationId: conversationIdRef.current,
        callType: callTypeRef.current,
        durationSeconds: 0,
      });
    }
    cleanup();
  };

  const hangup = () => {
    const currentRemoteId = remoteUserIdRef.current;
    if (currentRemoteId) {
      const durationSeconds = callStartTimeRef.current
        ? Math.floor((Date.now() - callStartTimeRef.current) / 1000)
        : 0;
      callService.sendSignal("HANGUP", {
        toUserId: currentRemoteId,
        conversationId: conversationIdRef.current,
        callType: callTypeRef.current,
        durationSeconds,
      });
    }
    cleanup();
  };

  const toggleMuteAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleMuteVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  useEffect(() => {
    if (!isSocketConnected) return;

    const subscription = callService.subscribeToCallSignals(async (signal: CallSignalRequest) => {
      const { type, payload } = signal;

      if (payload.fromUserId === currentUserId) return;

      switch (type) {
        case "OFFER": {
          const callerId = payload.fromUserId as number;
          setRemoteUserId(callerId);
          remoteUserIdRef.current = callerId;
          if (payload.conversationId) conversationIdRef.current = payload.conversationId as number;
          if (payload.callType) callTypeRef.current = payload.callType as "AUDIO" | "VIDEO";
          setCallState("RINGING");

          const pc = initPeerConnection(callerId);
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: "offer", sdp: payload.sdpOffer }),
          );
          await flushCandidates();
          break;
        }

        case "ANSWER":
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp: payload.sdpAnswer }),
            );
            await flushCandidates();
            setCallState("IN_CALL");
            callStartTimeRef.current = Date.now();
          }
          break;

        case "ICE": {
          const candidate = new RTCIceCandidate({
            candidate: payload.candidate,
            sdpMid: payload.sdpMid,
            sdpMLineIndex: payload.sdpMLineIndex,
          });

          if (peerConnection.current?.remoteDescription) {
            try {
              await peerConnection.current.addIceCandidate(candidate);
            } catch (e) {
              console.warn("Failed to add ICE candidate:", e);
            }
          } else {
            pendingCandidates.current.push(candidate);
          }
          break;
        }

        case "REJECT":
        case "HANGUP":
          cleanup();
          break;
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isSocketConnected, cleanup, currentUserId, initPeerConnection, flushCandidates]);

  const contextValue: CallContextType = {
    callState,
    localStream,
    remoteStream,
    remoteUserId,
    isAudioMuted,
    isVideoMuted,
    startCall,
    acceptCall,
    rejectCall,
    hangup,
    toggleMuteAudio,
    toggleMuteVideo,
  };

  return <CallContext.Provider value={contextValue}>{children}</CallContext.Provider>;
};

export const useWebRTC = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useWebRTC must be used within a CallProvider");
  }
  return context;
};
