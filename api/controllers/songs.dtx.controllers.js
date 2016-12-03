//TODO: 1. Fully define and implement the controllers
//Require mongoose and get the data model for dtxcollection
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var SongDtxCollection = mongoose.model('SongDtxCollection');

var UsersCollection = mongoose.model('UsersCollection');

var MAXRESULTSPERPAGE = 1000;
var MINRESULTSPERPAGE = 1;

//Define a fixed guest user id for testing purpose
var guestuserid = "67a994d0-76a5-4f07-885f-90ed697c46d5";

function songsGetAll(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.query.userID;
    if(!userID){
        userID = guestuserid;
    }
    
    //Get Count and Offset
    var count = parseInt(req.query.count);
    var offset = parseInt(req.query.offset);
    
    //Check on count and offset value allowed range
    if(!count || count > MAXRESULTSPERPAGE){
        count = MAXRESULTSPERPAGE;
    } else if(count <= 0){
        count = MINRESULTSPERPAGE;
    }
    
    if(!offset || offset < 0){
        offset = 0;
    }
    
    //Find all songs from DB with given username, count and offset
    SongDtxCollection
        .find({owner_id: userID})
        .skip(offset)
        .limit(count)
        .select("-dtxList.dtxdata")
        .exec(function(err, songs){
        //Handle errors
        if(err){
            res.status(500);
            res.json({
                "message": "Server error " + err
            });
            return;
        }
        
        res.status(200);
        res.json(songs);
    });
}

function songsAdd(req, res, next){
    
}

function songsGetByID(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.query.userID;
    if(!userID){
        userID = guestuserid;
    }
    
    //Get the id from param
    var songID = req.params.songID;
    
    //Find song with given id from DB
    SongDtxCollection
        .findOne({owner_id: userID, _id: songID})
        .select("-dtxList.dtxdata")
        .exec(function(err, song){
        if(err){
            res.status(500);
            res.json({
                "message": "Server error " + err
            });
            return;
        }
        
        if(!song){
            res.status(404);
            res.json({
                "message": "Song not found"
            });
            return;
        }
        
        res.status(200);
        res.json(song);
    });
    
}

function songsUpdateByID(req, res, next){
    
}

function songsDeleteByID(req, res, next){
    
}

function songDtxListGet(req, res, next){
    
}

function songDtxListGetByChartType(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.query.userID;
    if(!userID){
        userID = guestuserid;
    }
    
    //var testtitle = "Astral Dogma";
    
    //Get the id and charttype from param
    var songID = req.params.songID;
    var chartType = parseInt(req.params.chartType);
    
    //Find song with given id from DB
    SongDtxCollection
        .findOne({owner_id: userID,
                  _id: songID})
        .exec(function(err, song){
        //Handle errors
        if(err){
            res.status(500);
            res.json({
                "message": "Server error " + err
            });
            return;
        }
        
        if(!song){
            res.status(404);
            res.json({
                "message": "Song not found"
            });
            return;
        }
        
        //Filter by chartType
        var chartDtx = song.dtxList.filter(function(el){
           console.log(el.chartType, ' vs ', chartType);
           return el.chartType === chartType; 
        }).pop();
        
        res.status(200);
        res.json(chartDtx);
    });
}

function songDtxListUpdateByChartType(req, res, next){
    
}

function songDtxListDeleteByChartType(req, res, next){
    
}

//USE FOR initial testing purposes only
function loadTestSongsData(req, res, next){
    //
    var songs = req.body;
    SongDtxCollection.collection
        .insert(songs, function(err, songs){
            if(err){
                res.status(500);
                res.json({message: "Error " + err});
                return;
            } else{
                res.status(201);
                res.json({message: "Created"});
            }  
        });
}

function loadTestUsersData(req, res, next){
    //
    var users = req.body;
    
    UsersCollection.collection
        .insert(users, function(err, users){
            if(err){
                res.status(500);
                res.json({message: "Error " + err});
            } else{
                res.status(201);
                res.json({message: "Created"});
            }        
        });
}

function handleError(err, req, res, next){
    //TODO: implement error handling here
}

module.exports = {
    songsGetAll: songsGetAll,
    songsAdd: songsAdd,
    songsGetByID: songsGetByID,
    songsUpdateByID: songsUpdateByID,
    songsDeleteByID: songsDeleteByID,
    songDtxListGet: songDtxListGet,
    songDtxListGetByChartType: songDtxListGetByChartType, 
    songDtxListUpdateByChartType: songDtxListUpdateByChartType,
    songDtxListDeleteByChartType: songDtxListDeleteByChartType,
    loadTestSongsData: loadTestSongsData,
    loadTestUsersData: loadTestUsersData
};