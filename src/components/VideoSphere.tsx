import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { VideoTexture, BackSide } from "three";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady: boolean;
};

export const VideoSphere: React.FC<Props> = ({ videoRef, isVideoReady }) => {
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const texture = new VideoTexture(videoRef.current);
      setVideoTexture(texture);

      return () => {
        texture.dispose();
      };
    }
  }, [videoRef]);

  useFrame(() => {
    if (videoTexture) {
      videoTexture.needsUpdate = true;
    }
  });

  if (!isVideoReady) {
    return null;
  }

  return (
    <mesh scale={[5, 5, 5]}>
      <sphereGeometry args={[5, 60, 40]} />
      <meshBasicMaterial side={BackSide} map={videoTexture} />
    </mesh>
  );
};
