const cp = require('child_process');
const Client = require('ssh2').Client;
const fse = require('fs-extra');
const moment = require('moment')
const path = require('path');

exports.pull_project = async function(git_url, project_box_path, tar_path) {
  console.log('tar file ...');

  const pathary = git_url.split('/')
  let project_name = pathary[pathary.length - 1].split('.')[0];
  let project_path = path.join(project_box_path, project_name)
  const [exs1, exs2] = await this.bathEnsureDir([project_box_path, tar_path])
  let tar_name = `${project_name}_${moment().format("YYYYMMDD_HHmmss")}.tar.bz2`
    // console.log(exs1);
  if (exs1 && exs2) {
    return new Promise((resolve, reject) => {
      const ls = cp.spawn('./shell/pull_init_tar.sh', [git_url, project_box_path, project_path, project_name, tar_path, tar_name])
      ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      ls.stderr.on('data', (data) => {
        // reject(data)
        console.log(`stderr: ${data}`);
      });

      ls.on('close', (code) => {
        resolve([code, project_name, tar_name])
        console.log(`child process exited with code ${code}`);
      });
    });
  }
}

exports.ensureDir = async function(path) {
  return new Promise(function(resolve, reject) {
    fse.ensureDir(path, function(err) {
      if (err) {
        console.log(err);
        resolve(0)
      } else {
        // console.log(`${path} exsit`);
        resolve(1)
      }
    })
  })
}

exports.bathEnsureDir = async function(pathAry) {
  let self = this;

  let promises = pathAry.map((path) => self.ensureDir(path));
  // console.log(promises[0]);
  let results = await Promise.all(promises);
  return results;
}

exports.init = function(ip, port, userName, password) {
  var conn = new Client();
  conn.connect({
    host: ip,
    port: port,
    username: userName,
    password: password
  });

  return new Promise((resolve, reject) => {
    conn.on('ready', function() {
      console.log('SSH2 :: ready');
      resolve(conn)
    })
  });
}

// exports.key_init = function(ip, port, userName, keyUrl) {
//   console.log(require('fs').readFileSync(keyUrl));
//   var conn = new Client();
//   conn.connect({
//     host: ip,
//     port: port,
//     username: userName,
//     privateKey: require('fs').readFileSync(keyUrl)
//   });

//   return new Promise((resolve, reject) => {
//     conn.on('ready', function() {
//       console.log('SSH2 :: ready');
//       resolve(conn)
//     })
//   });
// }


exports.ftp = async function(conn) {
  return new Promise((resolve, reject) => {
    conn.sftp(function(err, sftp) {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log('FTP :: ready')
        resolve(sftp)
      }

    });
  });
}

exports.sendOrigin = function(FTP, fileUrl, originalUrl) {
  return new Promise((resolve, reject) => {
    FTP.fastPut(fileUrl, originalUrl, function(err, rs) {
      if (err) {
        console.log(`ftp upload the file: ${fileUrl} to  original:  ${originalUrl}`)
        console.log(err)
        reject(err)
      } else {
        resolve(1)
      }
    });
  });
}

exports.getOrigin = function(FTP, originalUrl, localUrl) {
  return new Promise((resolve, reject) => {
    FTP.fastGet(originalUrl, localUrl, function(err, rs) {
      if (err) {
        console.log(`ftp download the file: ${originalUrl} to  original:  ${localUrl}`)
        console.log(err)
        reject(err)
      } else {
        resolve(1)
      }
    });
  });
}

exports.exec = function(conn, shellUrl) {
  return new Promise((resolve, reject) => {
    conn.exec(shellUrl, function(err, stream) {
      if (err) {
        reject(err)
      } else {
        const datas = [];
        let size = 0;
        stream
          .on('data', function(data) {
            datas.push(data)
            size += data.length
          })
          .stderr.on('data', function(data) {
            console.log('STDERR: ' + data);
          })
          .on('close', function() {
            let buf = Buffer.concat(datas, size)
            console.log('Stream :: close\n');
            resolve(buf.toString())
          });
      }
    });
  });
}

exports.init_sned = async function(ip, port, userName, password, sendAry) {
  const conn = await this.init(ip, port, userName, password);
  const ftp = await this.ftp(conn);

  let promises = sendAry.map((waitFtp) => this.sendOrigin(ftp, waitFtp[0], waitFtp[1]));
  let results = await Promise.all(promises);
  return results;
}

exports.conn_sned = async function(conn, sendAry) {
  const ftp = await this.ftp(conn);
  let promises = sendAry.map((waitFtp) => this.sendOrigin(ftp, waitFtp[0], waitFtp[1]));
  let results = await Promise.all(promises);
  return results;
}

exports.ftp_sned = async function(ftp, sendAry) {
  let promises = sendAry.map((waitFtp) => this.sendOrigin(ftp, waitFtp[0], waitFtp[1]));
  let results = await Promise.all(promises);
  return results;
}