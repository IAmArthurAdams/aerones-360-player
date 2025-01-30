import React, { useEffect, useRef, useState } from "react";
import {
  VideoTexture,
  BackSide,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
} from "three";
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { CANVAS_HEIGHT, CANVAS_WIDTH, FPS } from "../utils/constants";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideoReady: boolean;
  currentFrame: number;
};

type MetadataEntry = {
  annotations: {
    category_name: string;
    bbox: number[];
  }[];
};

type Metadata = { [key: string]: MetadataEntry };

/**
 * VideoSphere component displays a 360-degree video inside a sphere
 * and overlays object detection bounding boxes from metadata.
 *
 * Features:
 * - Uses a video texture mapped onto an inverted sphere.
 * - Fetches and processes metadata to overlay bounding boxes.
 * - Updates dynamically based on the current video frame.
 */
export const VideoSphere: React.FC<Props> = ({
  videoRef,
  isVideoReady,
  currentFrame,
}) => {
  const { camera } = useThree();
  const meshRef = useRef<Mesh | null>(null);
  const [texture, setTexture] = useState<VideoTexture | null>(null);
  const [metadata, setMetadata] = useState<Metadata>({});

  // Fetch metadata for object detection bounding boxes
  useEffect(() => {
    fetch("/metadata/defects_coco_GS012237_1719791982345517.json")
      .then((res) => res.json())
      .then((data) => setMetadata(data))
      .catch((error) => console.error("Error fetching metadata:", error));
  }, []);

  // Create a video texture for the sphere when the video is ready
  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const videoTexture = new VideoTexture(videoElement);
      setTexture(videoTexture);

      return () => videoTexture.dispose(); // Cleanup when unmounting
    }
  }, [videoRef]);

  // Function to draw bounding boxes around detected objects in the video
  const drawBoundingBoxes = (currentFrame: number) => {
    const annotations = Object.values(metadata);
    const currentIndex = Math.floor(currentFrame / FPS);

    if (!annotations[currentIndex]) return null;
    const boundingBoxes = annotations[currentIndex].annotations;
    const boundingBoxMeshes: JSX.Element[] = [];

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
        <group key={Math.random()}>
          <primitive object={bboxMesh} />
          <Text
            position={[0, 2.5, 0]}
            color="red"
            fontSize={0.2}
            anchorX="center"
            anchorY="middle"
            onUpdate={(self) => self.lookAt(camera.position)}
          >
            {item.category_name}
          </Text>
        </group>
      );
    }

    return boundingBoxMeshes;
  };

  // Return null if video is not ready or texture is unavailable
  if (!isVideoReady || !texture) {
    return null;
  }

  return (
    <group>
      {/* Video sphere displaying the video as a texture */}
      <mesh ref={meshRef} scale={[5, 5, 5]}>
        <sphereGeometry args={[5, 60, 40]} />
        <meshBasicMaterial side={BackSide} map={texture} />
      </mesh>
      {/* Render bounding boxes if metadata is available */}
      {drawBoundingBoxes(currentFrame)}
    </group>
  );
};
