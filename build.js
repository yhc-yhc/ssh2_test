const path = require('path');
const ssh2 = require('./connFtp.js')
const loadDir = require('./load_dir');
const projects = loadDir('./conn');

async function build(project) {
	let url = project.url;
	let tar_path = path.join(__dirname, './tar/');
	let project_box_path = path.join(__dirname, './project/');
	// console.log(url, tar_path, project_box_path);
	const [code, project_name, tar_name] = await ssh2.build(url, project_box_path, tar_path)
	console.log('====>  tar result:', code, project_name, tar_name);
	return [code, project_name, tar_name]
}

if (process.argv[2]) {
	let project_name = Object.keys(projects).filter(project => !project.indexOf(process.argv[2]))
	console.log('build', project_name, projects[project_name]);
	if (projects[project_name]) {
		build(projects[project_name])
	}
} else {
	console.log('no project select ! program will build all projects');
	Object.keys(projects).forEach(project => {
		build(projects[project])
	})
}

module.exports = build;