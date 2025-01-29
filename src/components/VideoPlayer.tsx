import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { VideoSphere } from "./VideoSphere";
import { PlayerControls } from "./PlayerControls";
import { VideoUploader } from "./VideoUploader";

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setIsVideoReady(true);
      };

      video.addEventListener("canplay", handleCanPlay);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <VideoUploader setVideoSrc={setVideoSrc} />
      <div>
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          src={videoSrc}
          style={{ display: "none" }}
        ></video>

        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          style={{
            width: 1600,
            height: 750,
            marginTop: 40,
            cursor: "pointer",
          }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <VideoSphere videoRef={videoRef} isVideoReady={isVideoReady} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            rotateSpeed={-0.5}
          />
        </Canvas>
      </div>

      <PlayerControls
        videoRef={videoRef}
        isMuted={isMuted}
        videoSrc={videoSrc}
        setIsMuted={() => setIsMuted((prev) => !prev)}
      />
    </div>
  );
};
