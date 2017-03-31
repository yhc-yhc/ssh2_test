const ssh2 = require('./connFtp.js')
const path = require('path');

module.exports = async function(project) {
	let = git_url = project.url;
	const servers = project.servers
	let tar_path = './tar/',
		project_box_path = './project/',
		serverdir = '/root',
		shelldir = './shell',
	run = 'server.sh';

	tar_path = path.join(__dirname, tar_path);
	project_box_path = path.join(__dirname, project_box_path);

	let upshell = path.join(shelldir, run)
	let runserver = path.join(serverdir, run)

	const [code, project_name, tar_name] = await ssh2.pull_project(git_url, project_box_path, tar_path)
	console.log(code, project_name, tar_name);

	const conn = await ssh2.init(server);
	const ftp = await ssh2.ftp(conn);

	const upload = await ssh2.ftp_sned(ftp, [
		[upshell, runserver],
		[path.join(tar_path, tar_name), path.join(serverdir, tar_name)]
	])
	console.log(upload);

	const datas = await ssh2.exec(conn, `chmod +x ${runserver}; ${runserver} ${tar_name} ${project_name}`)
	console.log(datas);
	conn.end();
}