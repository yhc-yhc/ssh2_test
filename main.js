const down_tar = require('./down_tar.js')
const send_run = require('./send_run.js')
const find_latest = require('./find_latest.js')
const path = require('path')

module.exports = async function(project) {

	const [code, project_name, tar_name] = await down_tar(project.url);

	let send_tar = tar_name;
	if (code) {
		let latest_tar_name = await find_latest(project_name);
		latest_tar_name = latest_tar_name.replace('\n', '')
		latest_tar_name = path.basename(latest_tar_name);
		send_tar = latest_tar_name;
	}
	console.log(send_tar);
	await send_run(project.servers, project_name, send_tar)
}