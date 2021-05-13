const fs = require("fs");
const { execSync } = require("child_process");

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
		const dimensions = execSync(
			`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0  ${path}`
		).toString();

		//Convert pngs to video
		execSync(
			`ffmpeg -f image2 -framerate ${fps} -i ${inputPath} -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2" ${outputPath}`
		);

		// Resolve promise
		resolve();
	});

	return;
}

exports.pngsToMp4 = pngsToMp4;
