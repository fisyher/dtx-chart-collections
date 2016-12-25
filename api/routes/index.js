var express = require('express');
var router = express.Router();

var dtxController = require('../controllers/songs.dtx.controllers.js');

//TODO: 1. Fully define and implement the controllers

router
  .route('/songs')
  .get(dtxController.songsGetMultiple)
  .post(dtxController.songsAdd);

router
  .route('/songs/count')
  .get(dtxController.songsGetCount);

router
  .route('/songs/:songID')
  .get(dtxController.songsGetByID)
  .put(dtxController.songsUpdateByID)
  .delete(dtxController.songsDeleteByID);

router
  .route('/songs/:songID/dtxList')
  .get(dtxController.songDtxListGet)
  .put(dtxController.songDtxListUpdateByChartType);

router
  .route('/songs/:songID/dtxList/:chartType')
  .get(dtxController.songDtxListGetByChartType)
  .delete(dtxController.songDtxListDeleteByChartType);

//Load test data route TODO: REMOVE After test
router
  .route('/addtestdata/songs')
  .post(dtxController.loadTestSongsData);

router
  .route('/addtestdata/users')
  .post(dtxController.loadTestUsersData);

module.exports = router;