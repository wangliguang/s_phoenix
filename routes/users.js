var express = require('express');
var router = express.Router();
const exec = require('child_process').exec;

/* GET users listing. */
router.get('/getPatch', function(req, res, next) {
  const params = req.query
  console.log(params.bundleVersion);
  

  
  var cmdStr = 'cd ./public/bundle && ls -t * | head -1';
  exec(cmdStr, function(err,stdout,stderr){
    if(err) {
      console.log('get weather api error:'+stderr);
    } else {
      res.json({ name: stdout});
    }
  });

  
});

module.exports = router;
