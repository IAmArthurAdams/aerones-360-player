import React, { useEffect, useRef, useState } from "react";
import { VideoTexture, BackSide, Mesh } from "three";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady: boolean;
  currentFrame: number;
};

type MetadataEntry = {
  video_time: string;
  annotations: {
    bbox?: number[];
  }[];
};

type Metadata = { [key: string]: MetadataEntry };

export const VideoSphere: React.FC<Props> = ({
  videoRef,
  isVideoReady,
  currentFrame,
}) => {
  const meshRef = useRef<Mesh | null>(null);
  const [texture, setTexture] = useState<VideoTexture | null>(null);
  const [metadata, setMetadata] = useState<Metadata>({});

  useEffect(() => {
    fetch("/metadata/defects_coco_GS012237_1719791982345517.json")
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((error) => console.error("Error fetching metadata:", error));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const videoTexture = new VideoTexture(videoElement);
      setTexture(videoTexture);

      return () => videoTexture.dispose();
    }
  }, [videoRef]);

  if (!isVideoReady || !texture) {
    return null;
  }

  return (
    <mesh ref={meshRef} scale={[5, 5, 5]}>
      <sphereGeometry args={[5, 60, 40]} />
      <meshBasicMaterial side={BackSide} map={texture} />
    </mesh>
  );
};
