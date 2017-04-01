const ssh2 = require('./connFtp.js')
const path = require('path');

module.exports = async function(servers, project_name, tar_name) {

	let tar_path = path.join(__dirname, './tar/');
	let shelldir = path.join(__dirname, './shell');
	let run = 'server.sh'
	let upshell = path.join(shelldir, run);

	servers.forEach(async function(server) {
		let serverroot = server.username == 'root' ? '/root/' : path.join('/home/', server.username);
		let runserver = path.join(serverroot, run)
		const [conn, up_rs] = await ssh2.server_send(server, [
			[upshell, runserver],
			[path.join(tar_path, tar_name), path.join(serverroot, tar_name)]
		]);
		console.log(conn.config.host, up_rs);
		upend([conn, runserver, server.fly_params.replace(';', ',').replace(' ', ','), up_rs])
	})

	let end = 0;
	const end_up = [];
	const conns = [];

	async function upend([conn, runserver, fly_params, up_rs]) {
		end++;
		end_up.push(up_rs);
		conns.push([conn, runserver, fly_params])
		if (end == servers.length) {
			console.log('====>   all server upload finished!!!');
			const ups = end_up.map(up_rs => up_rs.every(up => up))
			if (ups.every(up => up)) {
				serverwork(conns);
			} else {
				conns.map(conn => conn.end())
			}
		}
	}

	async function serverwork(conns) {
		conns.forEach(async function([conn, runserver, fly_params]) {
			console.log(conn.config.host, 'exec shell ....')
			const results_run = await ssh2.exec(conn, `chmod +x ${runserver}; ${runserver} ${tar_name} ${project_name} ${fly_params}`);
			// console.log(results_run);
			runEnd(conn)
		})
	}

	async function runEnd(conn) {
		console.log(conn.config.host, 'has benn sync and runing ...');
		conn.end()
		end--;
		if (!end) {
			console.log('all server synced and running ... ...');
		}
	}
}