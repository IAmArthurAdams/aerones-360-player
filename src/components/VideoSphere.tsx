import React, { useEffect, useRef, useState } from "react";
import {
  VideoTexture,
  BackSide,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
} from "three";

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

  //TODO: Check box styling issue
  const drawBoundingBoxes = (currentFrame: number) => {
    const annotations = Object.values(metadata);
    const currentIndex = Math.floor(currentFrame / 30);

    const boundingBoxes = annotations[currentIndex].annotations;
    const boundingBoxMeshes: JSX.Element[] = [];

    if (boundingBoxes.length > 0) {
      for (const item of boundingBoxes) {
        const color = `red`;
        const [x, y, width, height] = item.bbox;

        console.log(
          `Drawing box at [x: ${x}, y: ${y}, width: ${width}, height: ${height}]`
        );

        const geometry = new BoxGeometry(width, height, 0.1);
        const material = new MeshBasicMaterial({
          color: color,
          wireframe: true,
        });
        const bboxMesh = new Mesh(geometry, material);

        bboxMesh.position.set(x, y, 0);

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
