import { Command, flags } from "@oclif/command";
import { startDownloading } from "./main";

class DownloadYoutubeVideos extends Command {
  static description =
    "Download ALL Youtube videos of ANY channel for FREE. Follow the tutorial here: {YouTubeLink}";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" })
  };

  static args = [
    {
      name: "file",
      description:
        "The output CSV file downloaded from running web scraper chrome extension. Check this tutorial: {YouTubeLink}",
      required: true
    }
  ];

  async run() {
    const { args } = this.parse(DownloadYoutubeVideos);

    if (args.file) {
      this.log(`Download Youtube Videos listed in this CSV file: ${args.file}`);
      startDownloading(args.file);
    }
  }
}

export = DownloadYoutubeVideos;
