import * as csv from "csv-parser";
import * as fs from "fs";
import * as youtubedl from "youtube-dl";
import * as Listr from "listr";

interface IPlaylist {
  title: string;
  href: string;
}

const playlist: IPlaylist[] = [];

const downloadVideo = href => {
  return new Promise((resolve, reject) => {
    const video = youtubedl(
      href,
      // Optional arguments passed to youtube-dl.
      [],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname }
    );

    // Will be called when the download starts.
    video.on("info", function(info) {
      console.log("Download started");
      console.log("filename: " + info._filename);
      console.log("size: " + info.size);

      video.pipe(fs.createWriteStream(info._filename));
    });

    video.on("end", function() {
      resolve("finished downloading");
    });

    video.on("error", function error(err) {
      reject(`error downloading file ${href}`);
    });
  });
};

export const startDownloading = async filePath => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", ({ link: title, "link-href": href }) =>
      playlist.push({
        title,
        href
      })
    )
    .on("end", () => {
      createTasksList(playlist);
    });
};

const createTasksList = async playlist => {
  const tasks = new Listr(
    playlist.map(item => ({
      title: item.title,
      task: () => downloadVideo(item.href)
    }))
  );

  await tasks.run();
};
