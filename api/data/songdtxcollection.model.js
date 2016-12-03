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

/*var dtxSchema = new mongoose.Schema({
    mode: String,
    chartType: Number,
    difficulty: String,
    dtxdata: dtxDataSchema
    //dtxdata
});*/

var SongDtxCollectionSchema = new mongoose.Schema({
    owner_id:{type: String, required: true},
    created_date: Date,
    modified_date: Date,
    title: {type: String, required: true},
    artist: {type: String, required: true},
    length: Number,
    bpmInfo: String,
    description: String,
    dtxList: [{
        mode: String,
        chartType: Number,
        difficulty: String,
        dtxdata: dtxDataSchema
        //dtxdata
    }]
});

//Register the schema into mongoose
mongoose.model('SongDtxCollection', SongDtxCollectionSchema, 'songDtxCollection');