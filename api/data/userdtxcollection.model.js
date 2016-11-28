var mongoose = require('mongoose');

var chartInfoSchema = new mongoose.Schema({
    title: String,
    artist: String,
	bpm: Number,//Initial/Fixed BPM
	level: String
}, {_id: false});

var metadataSchema = new mongoose.Schema({
    "totalNoteCount": Number,
    "LC_Count": Number,
    "HH_Count": Number,
    "LP_Count": Number,
    "LB_Count": Number,
    "SD_Count": Number,
    "HT_Count": Number,
    "BD_Count": Number,
    "LT_Count": Number,
    "FT_Count": Number,
    "RC_Count": Number,
    "RD_Count": Number
}, {_id: false});

var bpmMarkerSchema = new mongoose.Schema({
    pos: Number,
    bpm: Number
}, {_id: false});

var showHideLineMarkerSchema = new mongoose.Schema({
    pos: Number,
    show: Boolean
}, {_id: false});

var notesSchema = new mongoose.Schema({
    //"LC","HH","LP","LB","SD","HT","BD","LT","FT","RC","RD"
    LC: String,
    HH: String,
    LP: String,
    LB: String,
    SD: String,
    HT: String,
    BD: String,
    LT: String,
    FT: String,
    RC: String,
    RD: String
}, {_id: false});

var barGroupSchema = new mongoose.Schema({
    lines: {
        type: Number,
        required: true
    },
    bpmMarkerArray: [bpmMarkerSchema],
    showHideLineMarkerArray: [showHideLineMarkerSchema],
    notes: {
        type: notesSchema,
        require: true
    }
}, {_id: false});

var dtxDataSchema = new mongoose.Schema({
    chartInfo: chartInfoSchema,
    metadata: metadataSchema,
    barGroups: [barGroupSchema]
}, {_id: false});

var dtxSchema = new mongoose.Schema({
    mode: String,
    chartType: Number,
    difficulty: String,
    dtxdata: dtxDataSchema
    //dtxdata
});

/*
"mode": "Drum",
	"chartType": 4,//Runs from 1 to 15: 5 diffculty per type of chart Drum, Guitar, Bass
	"diffculty": "Master",	
*/


var songSchema = new mongoose.Schema({
    title: {type: String, required: true},
    artist: {type: String, required: true},
    length: Number,
    bpmInfo: String,
    description: String,
    dtxList: [dtxSchema]
});

/*
"title": "ABCD",
            "artist" "EFGHI",
            "length": 210,//Number in seconds
			"bpmInfo": "230 - 235",
			"description": "This song is created by EFGHI in the year XXXX"
*/


var userdtxcollectionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    user_id: String,
    songs: [songSchema]
});

//Register the schema into mongoose
mongoose.model('UserDtxCollection', userdtxcollectionSchema, 'dtxCollection');