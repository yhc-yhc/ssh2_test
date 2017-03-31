const path = require('path');
const ssh2 = require('./connFtp.js')

module.exports = async function(url) {

	let tar_path = path.join(__dirname, './tar/');
	let project_box_path = path.join(__dirname, './project/');
	// console.log(url, tar_path, project_box_path);
	const [code, project_name, tar_name] = await ssh2.pull_project(url, project_box_path, tar_path)
	console.log('====>  tar result:', code, project_name, tar_name);
	return [project_name, tar_name]
}