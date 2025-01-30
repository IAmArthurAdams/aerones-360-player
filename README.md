# 360-Degree Video Player with Metadata Overlays

## Overview

This project is a custom 360-degree video player developed to meet the requirements of the Aerones frontend developer assignment. The player allows you to:

- Access and display current frame numbers during video playback.
- Add metadata overlays, such as bounding boxes, based on a provided JSON file. The overlays appear at specified frames in the video.

## Project Setup

### 1. Clone the Repository

To get started, clone the repository to your local machine:
`git clone git@github.com:IAmArthurAdams/aerones-360-player.git`

### 2. Install Dependencies

Once you've cloned the repository, navigate to the project directory and install the necessary dependencies:
`npm install`

### 3. Start the Development Server

Run the development server to start the application:
`npm run dev  `

The video player will be available at [http://localhost:5173/](http://localhost:5173/) in your browser.

## Video and Metadata

- **Video File:** Due to the size of the video file, it has not been included in the repository. You can download the video from the following link:[Download Video](https://drive.google.com/file/d/1ziju7mIYDo5Zq6po8dNCiT7HRK_I8FqY/view)
- **Metadata JSON:** The required metadata JSON file is already included in the repository. No additional downloads are necessary for the metadata.

## How to Use the Video Player

1.  Upload the video file that you downloaded from the link above to the video player.
2.  Use the controls to play the video.
3.  As the video plays, the frame information will be displayed, and metadata overlays (bounding boxes) will appear at the designated frames based on the JSON metadata.

### Features:

- **Frame Information Access:** The current frame number is shown during video playback.
- **Metadata Overlays:** Bounding boxes will appear at specific frames as defined in the metadata JSON file.

## Design Decisions and Assumptions

- The project was built using a **React Vite** template for a quick development setup.
- To display the 360-degree video, the video is rendered in a spherical environment, and the overlays are positioned based on normalized coordinates from the metadata.
- The metadata JSON contains annotations for specific frames, and for each annotation, bounding boxes are drawn on the video player.
- **Custom controls** were added because the original video controls are not accessible, as the video is rendered in a sphere and the native controls are hidden.
- The **FPS (frames per second)** of the video was estimated by viewing the video in VLC and adjusting accordingly to ensure accurate frame retrieval.
- The code was structured with **component modularity** in mind. Reasonable components were split into smaller, reusable chunks to maintain clarity and ensure maintainability.
- **Global constants** were created where appropriate to avoid hardcoded values and to make the code more scalable.

## Conclusion

This is a proof of concept to demonstrate the functionality of a custom 360-degree video player with metadata overlays. It is not a fully-functional software project but showcases the main features requested by the assignment.

This project marked my first experience working with 360-degree videos and bounding boxes. It was a fun and rewarding challenge, and I thoroughly enjoyed diving into this new area. Through this experience, I gained valuable insights into how to handle spherical video rendering and precise placement of metadata overlays.

If this were to evolve into a production-ready application, I would focus on improving the code to be cleaner and more reusable, using even more precise calculations for bounding boxes. Additionally, I would create global styles that could be reused across similar components, further enhancing scalability and maintainability.
