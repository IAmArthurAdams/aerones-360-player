import React, { useEffect, useRef, useState } from "react";
import {
  VideoTexture,
  BackSide,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
} from "three";
import { useThree } from "@react-three/fiber";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FPS } from "../utils/constants";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady: boolean;
  currentFrame: number;
};

type MetadataEntry = {
  annotations: {
    bbox: number[];
  }[];
};

type Metadata = { [key: string]: MetadataEntry };

export const VideoSphere: React.FC<Props> = ({
  videoRef,
  isVideoReady,
  currentFrame,
}) => {
  const { camera } = useThree();
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

  const drawBoundingBoxes = (currentFrame: number) => {
    const annotations = Object.values(metadata);
    const currentIndex = Math.floor(currentFrame / FPS);

    const boundingBoxes = annotations[currentIndex].annotations;
    const boundingBoxMeshes: JSX.Element[] = [];

    if (boundingBoxes.length > 0) {
      for (const item of boundingBoxes) {
        const [x, y] = item.bbox;

        const geometry = new BoxGeometry(1.5, 1.5, 0);
        const material = new MeshBasicMaterial({
          color: "red",
          wireframe: true,
        });
        const bboxMesh = new Mesh(geometry, material);

        bboxMesh.position.set(x / CANVAS_WIDTH, y / CANVAS_HEIGHT, 0);
        bboxMesh.lookAt(camera.position);
        boundingBoxMeshes.push(
          <primitive key={Math.random()} object={bboxMesh} />
        );
      }
    }

    return boundingBoxMeshes;
  };

  if (!isVideoReady || !texture) {
    return null;
  }

  return (
    <group>
      <mesh ref={meshRef} scale={[5, 5, 5]}>
        <sphereGeometry args={[5, 60, 40]} />
        <meshBasicMaterial side={BackSide} map={texture} />
      </mesh>
      {drawBoundingBoxes(currentFrame)}
    </group>
  );
};
