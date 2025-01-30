import React, { useRef } from "react";

type Props = {
  setVideoSrc: (videoSrc: string) => void;
};

/**
 * VideoUploader component handles video file uploads.
 * - Allows the user to upload or replace a video.
 * - Creates a URL for the uploaded video and passes it to the parent component.
 * - Used to manually upload the video instead of pushing a large file to git.
 */
export const VideoUploader: React.FC<Props> = ({ setVideoSrc }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Handles video file upload and creates a URL for the video.
   * - Sets the created URL to the parent component's state.
   */
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
    }
  };

  /**
   * Triggers the file input element.
   */
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ margin: "10px 0 20px 0" }}>
      {/* Hidden file input for selecting video files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
      />

      {/* Button to trigger the file input */}
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

      {/* Display the uploaded file name or prompt the user to upload a video */}
      {fileInputRef.current?.files
        ? `File Name: ${fileInputRef.current.files[0].name}`
        : "Please upload the test video."}
    </div>
  );
};
