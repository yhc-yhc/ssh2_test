const down_tar = require('./down_tar.js')
const send_run = require('./send_run.js')
module.exports = async function(project) {

	const [project_name, tar_name] = await down_tar(project.url);
	await send_run(project.servers, project_name, tar_name)

}