import React, { useCallback, useState } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isMuted: boolean;
  setIsMuted: () => void;
  videoSrc?: string;
};

export const PlayerControls: React.FC<Props> = ({
  videoRef,
  isMuted,
  videoSrc,
  setIsMuted,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying((prev) => !prev);
    }
  }, [isPlaying, videoRef]);

  const handleReset = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [videoRef]);

  if (!videoSrc) {
    return null;
  }

  return (
    <div
      style={{
        width: 1344,
        backgroundColor: "#333",
        padding: "10px 0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ paddingLeft: 10 }}>
        <i
          className="ri-stop-circle-fill"
          style={{ cursor: "pointer" }}
          onClick={handleReset}
        />
        <i
          className={isPlaying ? "ri-pause-circle-fill" : "ri-play-circle-fill"}
          style={{ cursor: "pointer", marginLeft: 10 }}
          onClick={handlePlayPause}
        />
      </div>

      <div style={{ paddingRight: 10 }}>
        <i
          className={isMuted ? "ri-volume-mute-fill" : "ri-volume-up-fill"}
          style={{ cursor: "pointer" }}
          onClick={setIsMuted}
        />
      </div>
    </div>
  );
};
