const ssh2 = require('./connFtp.js')
const path = require('path');

module.exports = async function(servers, project_name, tar_name) {

	let tar_path = path.join(__dirname, './tar/');
	let shelldir = path.join(__dirname, './shell');
	let run = 'server.sh'
	let upshell = path.join(shelldir, run);

	servers.forEach(async function(server) {
		let serverroot = server.username == 'root' ? '/root/' : path.join('/root/', server.username);
		let runserver = path.join(serverroot, run)
		const [host, conn, ftp, up_rs] = await ssh2.server_sned(server, [
			[upshell, runserver],
			[path.join(tar_path, tar_name), path.join(serverroot, tar_name)]
		]);
		console.log(host, up_rs);
		upend([host, runserver, conn, ftp, up_rs])
	})

	let end = 0;
	const end_up = [];

	async function upend([host, runserver, conn, ftp, up_rs]) {
		end++;
		end_up.push([host, runserver, conn, ftp, up_rs])
		if (end == servers.length) {
			console.log('====>   all server upload finished!!!');
			const ups = end_up.map(([host, runserver, conn, ftp, up_rs]) => up_rs.every(up => up))
			if (ups.every(up => up)) {
				serverwork(end_up);
			} else {
				ups.forEach((up, index) => {
					if (!up) {
						console.log(`${end_up[index][0]} upload error!`);
						end_up.forEach(([host, runserver, conn, ftp, up_rs]) => {
							conn.end()
						})
					}
				})
			}
		}
	}

	async function serverwork(end_up) {
		end_up.forEach(async function([host, runserver, conn, ftp, up_rs]) {
			console.log(host, 'exec shell ....')
			const results_run = await ssh2.exec(conn, `chmod +x ${runserver}; ${runserver} ${tar_name} ${project_name}`);
			// console.log(results_run);
			runEnd([host, conn])
		})
	}

	async function runEnd([host, conn]) {
		console.log(host, 'has benn sync and runing ...');
		conn.end()
		end --;
		if(!end) {
			console.log('all server synced and running ... ...');
		}
	}
}