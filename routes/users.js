var express = require('express');
var router = express.Router();
var { CMDPromise } = require('./tools');
var log4js = require('log4js');



log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');


const BUNDLE_URL_PREFIX = 'http://47.94.81.19:3000/bundle/';
const PATCH_URL_PREFIX = 'http://47.94.81.19:3000/patch/';
const BUNDLE_BASE = '/app/s_phoenix/public/bundle/';
const PATCH_BASE = '/app/s_phoenix/public/patch/';

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

    await CMDPromise(`diff ${BUNDLE_BASE}${currentBundleVersion}.bundle ${BUNDLE_BASE}${latestBundle} > ${PATCH_BASE}diff.pat`);
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
