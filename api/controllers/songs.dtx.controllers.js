
//TODO: 1. Fully define and implement the controllers
//Require mongoose and get the data model for dtxcollection
var mongoDB = require('mongodb');
var mongoose = require('mongoose');

//Import uuid generator from uuid module
//We need to generate uuid for songs
var uuidgen = require('node-uuid');

//Import momentjs
var moment = require('moment');
//Import our own business logic functions


var SongDtxCollection = mongoose.model('SongDtxCollection');

var UsersCollection = mongoose.model('UsersCollection');

var MAXRESULTSPERPAGE = 1000;
var MINRESULTSPERPAGE = 1;

//Define a fixed guest user id for testing purpose
var guestuserid = "nonuser";

function songsGetMultiple(req, res, next){
    //Get username from property set by middleware
    var userID = req.username;
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

function songsGetCount(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username;
    if(!userID){
        userID = guestuserid;
    }
    
    //Get songs count for the current user
    SongDtxCollection
        .find({owner_id: userID})
        .count(function(err, count){
        //Handle errors
        if(err){
            res.status(500);
            res.json({
                "message": "Server error" + err
            });
            return;
        }
        
        res.status(200);
        res.json({"count": count});
        
    });
}

function songsAdd(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    //
    var songDtxObject = req.body;
    //console.log(songDtxObject);
    if(isEmptyObject(songDtxObject)){
        res.status(400);
        res.json({
                "message": "Bad request. JSON body is required!"
            });
        return;
    }
    
    //TODO: Perform logic checks if song has at least one dtx item 
    if(songDtxObject.dtxList.length === 0){
        res.status(400);
        res.json({
            "message": "Bad request. Song must have at least one dtx chart."
        })
    }
    
    //Add/Overwrite body with current data
    songDtxObject.owner_id = userID;
    songDtxObject.created_date = moment().format();//use the standard ISO 8601 string for now
    songDtxObject.modified_date = songDtxObject.created_date;
    
    SongDtxCollection
        .create(songDtxObject, function(err, song){
        if(err){
            res.status(500);
            res.json({
                "message": "Server error " + err
            });
            return;
        }
        
        if(!song){
            res.status(400);
            res.json({
                "message": "Bad request"
            });
            return;
        }
        
        res.status(201);
        res.json(song);
        
    });
    
}

function songsGetByID(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    //Get the id from param
    var songID = req.params.songID;
    
    //Find song with given id from DB
    SongDtxCollection
        .findOne({owner_id: userID, _id: songID})
        .select("-dtxList.dtxdata.barGroups")
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
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    //Get the id from param
    var songID = req.params.songID;
    
    //Get data from body
    var metadata = req.body;
    if(isEmptyObject(metadata)){
        res.status(400);
        res.json({
                "message": "Bad request. JSON body is required!"
            });
        return;
    }
    
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
        
        //TODO: Put the logic of updating song metadata elsewhere later
        song.title = !metadata.title ? song.title : metadata.title;
        song.artist = !metadata.artist ?  song.artist : metadata.artist;
        song.length = !metadata.length ?  song.length : metadata.length;
        song.bpmInfo = !metadata.bpmInfo ?  song.bpmInfo : metadata.bpmInfo;
        song.description = !metadata.description ?  song.description : metadata.description;
        
        //Save
        song.save(function(err){
            if(err){
                res.status(500);
                res.json({
                    "message": "Server error " + err + ". Data not saved"
                });            
            } else{
                res.status(200);
                res.json({
                    "message": "Song metadata updated"
                });
            }
        });      
        
    });
    
    
    //
    
}

function songsDeleteByID(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    //Get the id from param
    var songID = req.params.songID;
    
    //Find song with given id from DB and delete it from DB
    SongDtxCollection
        .findByIdAndRemove({owner_id: userID, _id: songID})
        .exec(function(err, removed){
            if(err){
                res.status(500);
                res.json({
                    "message": "Server error " + err
                });
                return;
            }
        
            if(!removed){
                res.status(404);
                res.json({
                    "message": "Song not found"
                });
                return;
            }
        
            res.status(202);
            res.json({
                "message": "Song with title: " + removed.title +" and ID: " + songID + " removed"
            });
    });
}

function songDtxListGet(req, res, next){
    
}

function songDtxListGetByChartType(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    var songID = req.params.songID;
    var chartType = parseInt(req.params.chartType);
    
    //var testtitle = "Astral Dogma";
    
    //Get the id and charttype from param
    /*var songID = req.params.songID;
    var chartType = parseInt(req.params.chartType);
    console.log("charType is ", chartType);
    
    //Find song with given id from DB
    SongDtxCollection.find({owner_id: userID,
                           _id: songID,
                           'dtxList.$.chartType': chartType}
    
    ).exec(function(err, song){
        if(err){
            console.log(err);
            res.status(500);
            res.json({
                "message": "Server error " + err
            });
            return;
        }
        
        console.log(song);
        res.status(200);
        res.json(song);
    });*/
    
    
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
        
        //Filter by chartType, can't find a way to use mongoose model to do this filtering...
        var chartDtx = song.dtxList.filter(function(el){
           return el.chartType === chartType; 
        }).pop();
        
        if(!chartDtx){
            res.status(404);
            res.json({
                "message": "DTX not found"
            });
            return;
        }
        
        res.status(200);
        res.json(chartDtx);
    });
    
}

function songDtxListUpdateByChartType(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    //Get songID
    var songID = req.params.songID;
    
    //Get data from body
    var dtx = req.body;
    if(isEmptyObject(dtx)){
        res.status(400);
        res.json({
                "message": "Bad request. JSON body is required!"
            });
        return;
    }
    
    //
    if(!dtx){
        res.status(400);
        res.json({
                "message": "Bad request. JSON format invalid"
            });
        return;
    }
    
    //TODO: Move the data processing logic to another file later
    var chartType = dtx.chartType;
    if(!chartType || chartType<=0 || chartType>5){
        res.status(400);
        res.json({
                "message": "Bad request. ChartType value invalid"
            });
        return;
    }
    
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
        
        //Create or replace the dtx chart if song is found
        var updatedDtxList = song.dtxList.filter(function(el){
           return el.chartType !== chartType; 
        });
        
        var message = "Song Dtx updated";
        var status = 200;
        
        //If same length after filter, means this dtx did not exist before
        if(updatedDtxList.length === song.dtxList.length){
            message = "Song Dtx created";
            status = 201;
        }
        
        //Add in the new dtx item
        updatedDtxList.push(dtx);
        
        //Update the song.dtxList with this new dtxlist
        song.dtxList = updatedDtxList;
        
        //Save
        song.save(function(err){
            if(err){
                res.status(500);
                res.json({
                    "message": "Server error " + err + ". Data not saved"
                });            
            } else{
                res.status(status);
                res.json({
                    "message": message
                });
            }
        });
        
    });
    
}

function songDtxListDeleteByChartType(req, res, next){
    //TEMP: Get userID from request query param
    var userID = req.username
    if(!userID){
        userID = guestuserid;
    }
    
    var songID = req.params.songID;
    var chartType = parseInt(req.params.chartType);
    
    
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
        
        //Find all dtx not equal to chartType
        var updatedDtxList = song.dtxList.filter(function(el){
           return el.chartType !== chartType; 
        });
        
        //Early exit to avoid unnecessary save to database
        if(updatedDtxList.length === song.dtxList.length){
            res.status(404);
            res.json({
                "message": "Song Dtx not found"
            });
            return;
        }
        
        //Update the song.dtxList with this new dtxlist
        song.dtxList = updatedDtxList;
        
        //Save
        song.save(function(err){
            if(err){
                res.status(500);
                res.json({
                    "message": "Server error " + err + ". Data not saved"
                });            
            } else{
                res.status(202);
                res.json({
                    "message": "Song Dtx removed"
                });
            }
        });
    });
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

//Helper functions
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

module.exports = {
    songsGetMultiple: songsGetMultiple,
    songsAdd: songsAdd,
    songsGetByID: songsGetByID,
    songsUpdateByID: songsUpdateByID,
    songsDeleteByID: songsDeleteByID,
    songsGetCount: songsGetCount,
    songDtxListGet: songDtxListGet,
    songDtxListGetByChartType: songDtxListGetByChartType, 
    songDtxListUpdateByChartType: songDtxListUpdateByChartType,
    songDtxListDeleteByChartType: songDtxListDeleteByChartType
    //loadTestSongsData: loadTestSongsData,
    //loadTestUsersData: loadTestUsersData
};