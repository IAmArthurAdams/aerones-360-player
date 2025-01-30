import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { VideoSphere } from "./VideoSphere";
import { PlayerControls } from "./PlayerControls";
import { VideoUploader } from "./VideoUploader";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FPS } from "../utils/constants";

/**
 * VideoPlayer component manages the 360-degree video playback.
 * - Uses a hidden HTML video element to control playback.
 * - Renders the video onto a spherical surface using Three.js.
 * - Tracks the current frame based on FPS for metadata overlay.
 */
export const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  /**
   * Updates the current frame based on the video's playback time.
   */
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

  /**
   * Sets the video as ready once it can play.
   */
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
      {/* Upload button for selecting a video file */}
      <VideoUploader setVideoSrc={setVideoSrc} />

      <div>
        {/* Hidden video element for controlling playback */}
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          src={videoSrc}
          style={{ display: "none" }}
        ></video>

        {/* Three.js Canvas rendering the 360 video inside a sphere */}
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

      {/* Display the current frame count */}
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

      {/* Custom playback controls for the video */}
      <PlayerControls
        videoRef={videoRef}
        isMuted={isMuted}
        videoSrc={videoSrc}
        setIsMuted={() => setIsMuted((prev) => !prev)}
      />
    </div>
  );
};
