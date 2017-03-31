const ssh2 = require('./connFtp.js')
const path = require('path');

module.exports = async function() {

	let tar_path = './tar/',
		project_box_path = './project/',
		serverdir = '/root',
		shelldir = './shell',
	run = 'server.sh';

	tar_path = path.join(__dirname, tar_path);
	project_box_path = path.join(__dirname, project_box_path);

	let upshell = path.join(shelldir, run)
	let runserver = path.join(serverdir, run)

	const [code, project_name, tar_name] = await ssh2.pull_project('git@172.16.60.9:josh/reports.git', project_box_path, tar_path)
	console.log(code, project_name, tar_name);

	const conn = await ssh2.init('192.168.8.58', 22, 'root', 'p@ssw0rd');
	const ftp = await ssh2.ftp(conn);

	const upload = await ssh2.ftp_sned(ftp, [
		[upshell, runserver],
		[path.join(tar_path, tar_name), path.join(serverdir, tar_name)]
	])
	console.log(upload);

	const datas = await ssh2.exec(conn, `chmod +x ${runserver}; ${runserver} ${tar_name} ${project_name}`)
	console.log(datas);

	// const rs = await ssh2.getOrigin(ftp, '/root/.ssh/id_rsa.pub', './keys/test_id_rsa.pub')
	// console.log(rs);

	conn.end();

	// const conn = await ssh2.key_init('192.168.8.58', 22, 'root', './keys/test_id_rsa.pub');
}