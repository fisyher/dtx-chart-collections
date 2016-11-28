var express = require('express');
var router = express.Router();

var dtxController = require('../controllers/songs.dtx.controllers.js');

//TODO: 1. Fully define and implement the controllers

router
  .route('/songs')
  .get(dtxController.songsGetAll)
  .post(dtxController.songsAdd);

router
  .route('/songs/:songTitle')
  .get(dtxController.songsGetByTitle)
  .put(dtxController.songsUpdateByTitle)
  .delete(dtxController.songsDeleteByTitle);

router
  .route('/songs/:songTitle/dtxList')
  .get(dtxController.songDtxListGet);

router
  .route('/songs/:songTitle/dtxList/:chartType')
  .get(dtxController.songDtxListGetByChartType)
  .put(dtxController.songDtxListUpdateByChartType)
  .delete(dtxController.songDtxListDeleteByChartType);

module.exports = router;