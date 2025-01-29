import React from "react";

type Props = {
  setVideoSrc: (videoSrc: string) => void;
};

export const VideoUploader: React.FC<Props> = ({ setVideoSrc }) => {
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
    }
  };

  return (
    <input
      type="file"
      accept="video/*"
      onChange={handleVideoUpload}
      style={{ marginBottom: "20px" }}
    />
  );
};
