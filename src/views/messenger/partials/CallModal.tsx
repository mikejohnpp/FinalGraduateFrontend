import React, { useEffect, useRef } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";

const CallModal = () => {
  const {
    callState,
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoMuted,
    acceptCall,
    rejectCall,
    hangup,
    toggleMuteAudio,
    toggleMuteVideo,
  } = useWebRTC();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState === "IDLE") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative flex w-full max-w-4xl flex-col items-center overflow-hidden rounded-2xl bg-gray-900 p-4 shadow-2xl">
        {/* Call Status Overlay */}
        {callState === "RINGING" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/90 text-white">
            <h2 className="mb-2 animate-pulse text-3xl font-semibold">Có cuộc gọi đến...</h2>
            <p className="mb-8 text-gray-400">Bạn có muốn nhấc máy không?</p>
            <div className="flex gap-6">
              <Button
                onClick={acceptCall}
                size="lg"
                className="h-16 w-16 rounded-full bg-green-500 p-0 text-white hover:bg-green-600"
              >
                <Phone className="h-8 w-8" />
              </Button>
              <Button
                onClick={rejectCall}
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full p-0"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}

        {callState === "CALLING" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-900/90 text-white">
            <h2 className="mb-2 animate-pulse text-3xl font-semibold">Đang đổ chuông...</h2>
            <div className="mt-8">
              <Button
                onClick={hangup}
                size="lg"
                variant="destructive"
                className="h-16 w-16 rounded-full p-0"
              >
                <PhoneOff className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}

        {/* Video Streams */}
        <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-black">
          {/* Remote Video (Big) */}
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />

          {/* Local Video (Small, floating) */}
          <div className="absolute right-4 bottom-4 aspect-video w-48 overflow-hidden rounded-lg border-2 border-gray-600 bg-gray-800 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted // Always mute local video so you don't hear yourself
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Controls */}
        {callState === "IN_CALL" && (
          <div className="mt-6 flex gap-4">
            <Button
              onClick={toggleMuteAudio}
              variant={isAudioMuted ? "destructive" : "secondary"}
              className="h-14 w-14 rounded-full p-0"
            >
              {isAudioMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>

            <Button onClick={hangup} variant="destructive" className="h-14 rounded-full px-8">
              <PhoneOff className="mr-2 h-6 w-6" /> Kết thúc
            </Button>

            <Button
              onClick={toggleMuteVideo}
              variant={isVideoMuted ? "destructive" : "secondary"}
              className="h-14 w-14 rounded-full p-0"
            >
              {isVideoMuted ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallModal;
