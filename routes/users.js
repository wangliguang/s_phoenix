var express = require('express');
var router = express.Router();
var { CMDPromise } = require('./tools');


const BUNDLE_URL_PREFIX = 'http://47.94.81.19:3000/bundle/';
const PATCH_URL_PREFIX = 'http://47.94.81.19:3000/patch/';
const BUNDLE_BASE = '/app/s_phoenix/public/bundle/';

router.get('/getPatch', async function(req, res, next) {
  try {
    const { currentBundleVersion } = req.query;
    let cmdStr = `pwd && cd ${BUNDLE_BASE} && ls -t * | head -1`
    
    const latestBundle = await CMDPromise(cmdStr);
    if(currentBundleVersion == 0) {
      res.json({ 
        bundleUrl: `${BUNDLE_URL_PREFIX}${latestBundle}`,
        code: 200,
      });
      return;
    }

    await CMDPromise(`diff ${BUNDLE_BASE}${currentBundleVersion}.bundle ${BUNDLE_BASE}${latestBundle} > ./public/patch/diff.patch`);
    res.json({
      code: 200,
      patchUrl: `${PATCH_URL_PREFIX}diff.patch`
    });
  } catch (error) {
    res.json(error);
  }

  
  

  
});

module.exports = router;
