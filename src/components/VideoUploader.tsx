import React, { useRef } from "react";

type Props = {
  setVideoSrc: (videoSrc: string) => void;
};

export const VideoUploader: React.FC<Props> = ({ setVideoSrc }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ margin: "10px 0 20px 0" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />

      <button
        onClick={triggerFileInput}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3399CC",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          marginRight: 10,
        }}
      >
        {fileInputRef.current ? "Replace Video" : "Upload Video"}
      </button>
      {fileInputRef.current?.files
        ? `File Name: ${fileInputRef.current.files[0].name}`
        : "Please select a video to upload from your computer."}
    </div>
  );
};
