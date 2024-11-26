const { exec } = require("child_process");
const path = require("path");

const clipVideo = (videoPath, startTime, endTime) => {
  return new Promise((resolve, reject) => {
    const clipPath = path.resolve(
      __dirname,
      "../videos",
      `clip_${Date.now()}.mp4`,
    );
    const command = `./bin/ffmpeg -i "${videoPath}" -ss ${startTime} -to ${endTime} -c copy "${clipPath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error clipping video:", stderr);
        return reject(error);
      }
      console.log("Video clipped successfully:", stdout);
      resolve(clipPath);
    });
  });
};

module.exports = { clipVideo };
