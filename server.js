const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { downloadVideo } = require("./utils/downloader");
const { clipVideo } = require("./utils/clipper");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// // Route: Download and clip a video
// app.post("/download", async (req, res) => {
//   const { videoUrl, startTime, endTime } = req.body;

//   if (!videoUrl || !startTime || !endTime) {
//     return res.status(400).json({ error: "Missing required parameters" });
//   }

//   try {
//     const videoPath = await downloadVideo(videoUrl);
//     const clipPath = await clipVideo(videoPath, startTime, endTime);

//     // Serve the clipped file as a response
//     res.download(clipPath, (err) => {
//       if (err) {
//         console.error("Error sending the file:", err);
//       }
//       // Clean up files after sending
//       fs.unlinkSync(videoPath);
//       fs.unlinkSync(clipPath);
//     });
//   } catch (error) {
//     console.error("Error processing video:", error);
//     res.status(500).json({ error: "Failed to process video" });
//   }
// });



// const fs = require('fs');
// const path = require('path');

app.post('/download', async (req, res) => {
  const { videoUrl, startTime, endTime } = req.body;

  try {
    // Temporary paths for original video and clipped video
    const videoPath = path.join(__dirname, 'temp_video.mp4');
    const clipPath = path.join(__dirname, 'videos', `clip_${Date.now()}.mp4`); // Save in 'videos' directory

    // Download video using yt-dlp
    await execPromise(`./bin/yt-dlp -f best -o "${videoPath}" ${videoUrl}`);

    // Use ffmpeg to clip the video
    await execPromise(`./bin/ffmpeg -i "${videoPath}" -ss ${startTime} -to ${endTime} -c copy "${clipPath}"`);

    // Clean up the temporary original video file
    fs.unlinkSync(videoPath);

    console.log(`Clipped video saved at: ${clipPath}`);

    // Respond with success message and clip path
    res.status(200).send({ message: 'Video clipped successfully', clipPath });
  } catch (err) {
    console.error('Error processing the video:', err);
    res.status(500).send({ error: 'An error occurred while processing the video' });
  }
});

// Helper function to wrap exec in a promise
function execPromise(command) {
  const { exec } = require('child_process');
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`, stderr);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}


// // Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
