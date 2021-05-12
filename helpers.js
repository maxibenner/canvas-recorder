const fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");

const removeDir = function (path, deleteParentDir) {
	if (fs.existsSync(path)) {
		const files = fs.readdirSync(path);

		if (files.length > 0) {
			files.forEach(function (filename) {
				if (fs.statSync(path + "/" + filename).isDirectory()) {
					removeDir(path + "/" + filename);
				} else {
					fs.unlinkSync(path + "/" + filename);
				}
			});
			if (deleteParentDir !== false) {
				fs.rmdirSync(path);
			}
		} else {
			if (deleteParentDir !== false) {
				fs.rmdirSync(path);
			}
		}
	} else {
		console.log("[Server] User directory has been deleted.");
	}
};
exports.removeDir = removeDir;

async function dataUriToDisk(data, path) {
	//const fileName = path.split('/')
	fs.readdir(path, (err, files) => {
		fs.writeFile(
			`${path}/${files.length}.png`,
			data.split(";base64,").pop(),
			{ encoding: "base64" },
			(err) => {
				return;
			}
		);
	});
}
exports.dataUriToDisk = dataUriToDisk;

async function pngsToMp4(inputPath, outputPath, fps, duration) {
	// Get path for first image
	const path = inputPath.replace("%d", "1");

	// Get image dimensions
	await new Promise((resolve, reject) => {
		ffmpeg(path).ffprobe(0, (err, data) => {
			if (err) {
				console.log(err);
				reject();
			}
			if (data) {
				const width = data.streams[0].width;
				const height = data.streams[0].height;

				//Convert pngs to video
				ffmpeg(inputPath)
					.fps(fps)
					.outputOptions("-pix_fmt yuv420p")
					.size(`${width}x${height}`)
					.videoBitrate("8000k", true)
					.on("end", () => {
						console.log("[Server] File has been converted successfully");
						resolve();
					})
					.save(outputPath);
			}
		});
	});

	return;
}
exports.pngsToMp4 = pngsToMp4;
