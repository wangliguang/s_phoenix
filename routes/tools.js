const exec = require('child_process').exec;


const CMDPromise = function(cmdStr) {
  return new Promise((resolve, reject) => {
    exec(cmdStr,function(err,stdout,stderr){
      if(stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout.replace(/[\r\n]/g,""));
    });
  })
}

module.exports = {
  CMDPromise
};
