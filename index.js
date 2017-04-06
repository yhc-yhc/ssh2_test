
if (process.argv[2]) {
	const loadDir = require('./load_dir');
	const projects = loadDir('./conn');
	let project_name = Object.keys(projects).filter(project => !project.indexOf(process.argv[2]))
	console.log(project_name, projects[project_name]);
} else {
	console.log('no project select ! program will build all projects, but no project will fly');
}

require('./build.js')
require('./fly.js')