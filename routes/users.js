var express = require('express');
var router = express.Router();
var { CMDPromise } = require('./tools');
var { logger } = require('./logs');
var DMP = require('./diff_match_patch_uncompressed');
var rf=require("fs");


const BUNDLE_URL_PREFIX = 'http://47.94.81.19:3000/bundle/';
const PATCH_URL_PREFIX = 'http://47.94.81.19:3000/patch/';
const BUNDLE_BASE = '/app/s_phoenix/public/bundle/';
const PATCH_BASE = '/app/s_phoenix/public/patch/';

// const BUNDLE_BASE = '/Users/wangliguang/Desktop/phoenix/s_phoenix/public/bundle/';
// const PATCH_BASE = '/Users/wangliguang/Desktop/phoenix/s_phoenix/public/patch/';
// const BUNDLE_URL_PREFIX = 'http://10.36.36.31:3000/bundle/';
// const PATCH_URL_PREFIX = 'http://10.36.36.31:3000/patch/';

router.get('/getPatch', async function(req, res, next) {
  try {
    const { currentBundleVersion } = req.query;
    let cmdStr = `cd ${BUNDLE_BASE} && ls -t * | head -1`
    
    const latestBundle = await CMDPromise(cmdStr);
    if(currentBundleVersion == 0) {
      res.json({ 
        bundleUrl: `${BUNDLE_URL_PREFIX}${latestBundle}`,
        code: 200,
        version: latestBundle.split('.')[0],
      });
      return;
    }
    
    var currentBundleVersionData = rf.readFileSync(`${BUNDLE_BASE}${currentBundleVersion}.bundle`,"utf-8");
    var latestBundleData = rf.readFileSync(`${BUNDLE_BASE}${latestBundle}`,"utf-8");

    var dmp = new DMP.diff_match_patch();
    var diff = dmp.diff_main(currentBundleVersionData, latestBundleData, true);
      
    if (diff.length > 2) {
      dmp.diff_cleanupSemantic(diff);
    }
    
    var patch_list = dmp.patch_make(currentBundleVersionData, latestBundleData, diff);
    const patch_text = dmp.patch_toText(patch_list);

    rf.writeFileSync(`${PATCH_BASE}diff.pat`, patch_text);

    res.json({
      code: 200,
      patchUrl: `${PATCH_URL_PREFIX}diff.pat`,
      version: latestBundle.split('.')[0],
    });
  } catch (error) {
    logger.error(error);
    res.json(error);
  }

  
  

  
});

module.exports = router;
