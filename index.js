// dependencies
const express = require("express");
const app = express();
const fs = require("fs");
const helpers = require("./helpers");

const port = 5000;
app.use("/tmp", express.static("tmp"));

app.listen(port);

// Clear tmp directory on server start
helpers.removeDir("./tmp", false);

app.get("/", function (req, res) {
	res.send("Api active");
});

app.post("/add_frame", function (req, res) {
	let dropbox = "";

	req.on("data", (chunk) => {
		dropbox += chunk.toString();
	});

	req.on("end", () => {
		const body = JSON.parse(dropbox);

		if (!body.data || !body.sessionId) {
			res.send({
				code: 400,
				message: "Missing data",
			});
		} else {
			// Create session dir and save to disk
			if (fs.existsSync(`./tmp/${body.sessionId}`)) {
				helpers.dataUriToDisk(body.data, `tmp/${body.sessionId}`);
				// Remove timeout delete
				eval(`var ${body.sessionId} = clearTimeout(${body.sessionId})`);
			} else {
				fs.mkdir(`./tmp/${body.sessionId}`, () => {
					helpers.dataUriToDisk(body.data, `tmp/${body.sessionId}`);

					// Create timeout delete
					eval(
						`var ${body.sessionId} = setTimeout(()=>{helpers.removeDir("./tmp/${body.sessionId}")},360000)`
					);
				});
			}

			res.send({ code: 200, message: "Frame added to batch" });
		}
	});
});

app.get("/process", async function (req, res) {
	const query = req.query;

	if (!query.sessionId) {
		res.send({
			code: 400,
			message: "No session id provided",
			url: null,
		});
	} else {
		if (!fs.existsSync(`./tmp/${query.sessionId}`)) {
			res.send({
				code: 400,
				message: "No such session",
				url: null,
			});
		} else {
			helpers
				.pngsToMp4(
					`./tmp/${query.sessionId}/%d.png`,
					`./tmp/${query.sessionId}/${query.sessionId}.mp4`,
					query.fps,
					query.duration
				)
				.then(() => {
					// Set delete timer
					setTimeout(() => {
						helpers.removeDir(`./tmp/${query.sessionId}`);
					}, 360000);

					res.send({
						code: 200,
						message: "Converted to mp4",
						url: `./tmp/${query.sessionId}/${query.sessionId}.mp4`,
					});
				})
				.catch(() => {
					// Set delete timer
					setTimeout(() => {
						helpers.removeDir(`./tmp/${query.sessionId}`);
					}, 360000);

					res.send({
						code: 400,
						message: "Problem converting images",
						url: null,
					});
				});
		}
	}
});

console.log(`Listening on port ${port}`);
