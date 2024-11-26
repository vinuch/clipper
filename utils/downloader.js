const { exec } = require("child_process");
const path = require("path");

const downloadVideo = (videoUrl) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.resolve(
      __dirname,
      "../videos",
      `${Date.now()}.mp4`,
    );
    const command = `./bin/yt-dlp  -f best -o "${outputPath}" "${videoUrl}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error downloading video:", stderr);
        return reject(error);
      }
      console.log("Video downloaded successfully:", stdout);
      resolve(outputPath);
    });
  });
};

module.exports = { downloadVideo };
