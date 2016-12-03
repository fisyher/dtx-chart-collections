var express = require('express');
var router = express.Router();

var dtxController = require('../controllers/songs.dtx.controllers.js');

//TODO: 1. Fully define and implement the controllers

router
  .route('/songs')
  .get(dtxController.songsGetAll)
  .post(dtxController.songsAdd);

router
  .route('/songs/:songID')
  .get(dtxController.songsGetByID)
  .put(dtxController.songsUpdateByID)
  .delete(dtxController.songsDeleteByID);

router
  .route('/songs/:songID/dtxList')
  .get(dtxController.songDtxListGet);

router
  .route('/songs/:songID/dtxList/:chartType')
  .get(dtxController.songDtxListGetByChartType)
  .put(dtxController.songDtxListUpdateByChartType)
  .delete(dtxController.songDtxListDeleteByChartType);

//Load test data route TODO: REMOVE After test
router
  .route('/addtestdata/songs')
  .post(dtxController.loadTestSongsData);

router
  .route('/addtestdata/users')
  .post(dtxController.loadTestUsersData);

module.exports = router;