import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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
  startCall: (toUserId: number, isVideo?: boolean) => Promise<void>;
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
  // Dùng ref để tránh stale closure trong callbacks của PeerConnection
  const remoteUserIdRef = useRef<number | null>(null);

  const ringtoneAudio = useRef<HTMLAudioElement | null>(null);
  const callingAudio = useRef<HTMLAudioElement | null>(null);

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const isSocketConnected = useSelector((state: RootState) => state.socket.connected);

  // Đồng bộ remoteUserId vào ref
  useEffect(() => {
    remoteUserIdRef.current = remoteUserId;
  }, [remoteUserId]);

  // Initialize Audio Objects
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

  // Play/Pause Audio based on callState
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

  // Clean up streams and connection
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
  }, []);

  // Timeout 60s nếu không bắt máy
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (callState === "CALLING") {
      timeoutId = setTimeout(() => {
        toast.error("Người dùng không bắt máy.");
        if (remoteUserIdRef.current) {
          callService.sendSignal("HANGUP", { toUserId: remoteUserIdRef.current });
        }
        cleanup();
      }, 60000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [callState, cleanup]);

  // Initialize Peer Connection - nhận remoteId trực tiếp để tránh stale closure
  const initPeerConnection = useCallback((remoteId: number) => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // Handle ICE Candidates - dùng remoteId từ tham số, không từ state
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

  // START a call
  const startCall = async (toUserId: number, isVideo: boolean = true) => {
    setRemoteUserId(toUserId);
    remoteUserIdRef.current = toUserId;
    setCallState("CALLING");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;

      const pc = initPeerConnection(toUserId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      callService.sendSignal("OFFER", {
        toUserId,
        sdpOffer: offer.sdp,
        callType: isVideo ? "VIDEO" : "AUDIO",
      });
    } catch (error) {
      console.error("Error accessing media devices.", error);
      cleanup();
    }
  };

  // ACCEPT an incoming call
  const acceptCall = async () => {
    const currentRemoteId = remoteUserIdRef.current;
    if (!peerConnection.current || !currentRemoteId) return;

    setCallState("IN_CALL");

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

  // REJECT incoming call
  const rejectCall = () => {
    const currentRemoteId = remoteUserIdRef.current;
    if (currentRemoteId) {
      callService.sendSignal("REJECT", { toUserId: currentRemoteId });
    }
    cleanup();
  };

  // END ongoing call
  const hangup = () => {
    const currentRemoteId = remoteUserIdRef.current;
    if (currentRemoteId) {
      callService.sendSignal("HANGUP", { toUserId: currentRemoteId });
    }
    cleanup();
  };

  // Toggle Mute
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

  // Handle incoming STOMP signals - chỉ subscribe khi socket đã connected
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
          setCallState("RINGING");
          // Khởi tạo PeerConnection với id của người gọi
          const pc = initPeerConnection(callerId);
          await pc.setRemoteDescription(
            new RTCSessionDescription({ type: "offer", sdp: payload.sdpOffer }),
          );
          break;
        }

        case "ANSWER":
          if (peerConnection.current) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription({ type: "answer", sdp: payload.sdpAnswer }),
            );
            setCallState("IN_CALL");
          }
          break;

        case "ICE":
          if (peerConnection.current) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate({
                candidate: payload.candidate,
                sdpMid: payload.sdpMid,
                sdpMLineIndex: payload.sdpMLineIndex,
              }),
            );
          }
          break;

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
  }, [isSocketConnected, cleanup, currentUserId, initPeerConnection]);

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
