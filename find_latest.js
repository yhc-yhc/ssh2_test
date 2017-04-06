const cp = require('child_process')

module.exports = function(project_name) {
	return new Promise((resolve, reject) => {
		cp.exec(`find ./tar -name ${project_name}*.tar.bz2`, function(err, rs) {
			// console.log(err, rs);
			if (err) {
				reject(err)
			} else {
				resolve(rs.replace('\n', ''))
			}
		})
	});

}