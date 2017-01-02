var express = require('express');
var router = express.Router();

var dtxController = require('../controllers/songs.dtx.controllers.js');

var userController = require('../controllers/users.controller.js');

//TODO: 1. Fully define and implement the controllers
var authenticateUserMiddleware = userController.authenticateUser;

router
  .route('/songs')
  .get(authenticateUserMiddleware, dtxController.songsGetMultiple)
  .post(authenticateUserMiddleware, dtxController.songsAdd);

router
  .route('/songs/count')
  .get(authenticateUserMiddleware, dtxController.songsGetCount);

router
  .route('/songs/:songID')
  .get(authenticateUserMiddleware, dtxController.songsGetByID)
  .put(authenticateUserMiddleware, dtxController.songsUpdateByID)
  .delete(authenticateUserMiddleware, dtxController.songsDeleteByID);

router
  .route('/songs/:songID/dtxList')
  .get(authenticateUserMiddleware, dtxController.songDtxListGet)
  .put(authenticateUserMiddleware, dtxController.songDtxListUpdateByChartType);

router
  .route('/songs/:songID/dtxList/:chartType')
  .get(authenticateUserMiddleware, dtxController.songDtxListGetByChartType)
  .delete(authenticateUserMiddleware, dtxController.songDtxListDeleteByChartType);


//User related API
/*
*/

router.route('/users/login')
    .post(userController.loginUser);

router.route('/users/register')
    .post(userController.registerUser);
//router.route('/users/logout')

router.route('/users/profile')
    .get(authenticateUserMiddleware, userController.getUserProfile)
    .put(authenticateUserMiddleware, userController.updateUserPassword);

router.route('/users/password')
    .put(authenticateUserMiddleware, userController.updateUserPassword);

router.route('/users/requestnewtoken')
    .get(authenticateUserMiddleware, userController.requestNewToken);

module.exports = router;