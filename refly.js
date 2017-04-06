const ssh2 = require('./connFtp.js')
const path = require('path');
const find_latest = require('./find_latest.js')
const loadDir = require('./load_dir');
const projects = loadDir('./conn');

async function refly(project) {

	const servers = project.servers.filter(server => server.host)

	servers.forEach(async server => {
		const conn = await ssh2.init(server);
		await ssh2.exec(conn, server.reflly);
		console.log(conn.config.host, 'has benn reflyed !');
		conn.end();
	})
}

if (process.argv[2]) {

	let project_name = Object.keys(projects).filter(project => !project.indexOf(process.argv[2]))
	console.log('fly:', project_name, projects[project_name]);
	if (projects[project_name]) {
		refly(projects[project_name])
	}
} else {
	console.log('no project select ! plase give a project name to fly');
}

module.exports = refly;