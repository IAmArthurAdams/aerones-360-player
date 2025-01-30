import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { VideoSphere } from "./VideoSphere";
import { PlayerControls } from "./PlayerControls";
import { VideoUploader } from "./VideoUploader";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FPS } from "../utils/constants";

export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        const currentTime = video.currentTime;
        const frame = Math.floor(currentTime * FPS);
        setCurrentFrame(frame);
      };

      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, []);

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
        padding: "10px 0",
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
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          }}
        >
          <VideoSphere
            videoRef={videoRef}
            isVideoReady={isVideoReady}
            currentFrame={currentFrame}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            rotateSpeed={-0.5}
          />
        </Canvas>
      </div>

      {videoSrc && (
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 55,
            color: "white",
          }}
        >
          Current Frame: {currentFrame}
        </div>
      )}

      <PlayerControls
        videoRef={videoRef}
        isMuted={isMuted}
        videoSrc={videoSrc}
        setIsMuted={() => setIsMuted((prev) => !prev)}
      />
    </div>
  );
};
