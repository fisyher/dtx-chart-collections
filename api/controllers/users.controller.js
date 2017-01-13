var mongoose = require('mongoose');
var User = mongoose.model('UsersCollection');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('node-uuid');
var moment = require('moment');
var jwt = require('jsonwebtoken');

//
var secret = process.env.SECRET_STRING || 'test1234';
//console.log(secret);

function loginUser(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    
    //Check if properties are valid
    if(!(username && password)){
        res.status(400).json({
            message: 'Bad request. No username or password provided.'
        });
    }
    
    
    //Find user and compare the password with the saved password hash
    User.findOne({
        username: username
    }, function(err, user){
        if(err){
            res.status(500).json(err);
            return;
        }
        
        if(!user){
            res.status(401).json({
                message: "Unauthorized"
            })//This hide the fact that there is no such user
        } else{
            //Proceed to compare the input password with the hash
            if(comparePassword(password, user.password)){
                console.log('User is found with correct password');
                //Create access and refresh token and send it back to client
                var clientID = generateRandomUUID();//This can be used to save into DB for blacklist token
                var token = createAndSignAccessToken(user);
                var refreshToken = createAndSignRefreshToken(user, clientID);
                res.status(200).json({
                    message: 'ok',
                    accessToken: token,
                    refreshToken: refreshToken
                });
            } else{
                console.log('Wrong password');
                res.status(401).json({
                    message:'Unauthorized'
                });
            }
        }
    });
}


function registerUser(req, res, next){
    console.log('Register new user');
    
    var username = req.body.username;
    var name = req.body.name;
    var password = req.body.password;
    //var uuid = generateUUID();
    
    //Check if properties are valid
    if(!(username && name && password)){
        res.status(400).json({
            message: 'Bad request. No username, name or password provided.'
        });
    }
    
    //Check if username is already taken
    User.findOne({
        username: username
    }, function(err, user){
        if(err){
            console.log(err);
            res.status(500).json({
                message: 'Internal Server error'
            });
            return;
        }
        //If yes, return an error
        if(user){
            res.status(400).json({
                message: "User already exists"
            });
        } else{
            //Otherwise proceed to create the new user
            User.create({
                username: username,
                name: name,
                password: encryptPassword(password),
                _id: generateUUID(),
                join_date: moment().format()
            }, function(err, user){
                if(err){
                    console.log(err);
                    res.status(500).json({
                        message: 'Internal Server error'
                    });
                    return;
                }
                
                if(user){
                    res.status(201).json({
                        message: 'OK',
                        user: {
                            username: user.username,
                            name: user.name,
                            join_date: user.join_date
                        }
                    })
                }
            });
        }
    });
    
    
    
    
}

function getUserProfile(req, res, next){
    
}

function updateUserProfile(req, res, next){
    
}

function updateUserPassword(req, res, next){
    //
    var username = req.username;//From authenticate middleware
    var password = req.body.password;
    var newpassword = req.body.newpassword;
    //console.log(username);
    //
    if(!(password && newpassword)){
        res.status(400).json({
            message: 'Bad request. Passwords are not provided.'
        });
    }
    
    User.findOne({
        username: username
    }, function(err, user){
        if(err){
            res.status(500).json({
                message: 'Internal Server Error'
            });
            return;
        }
        
        if(!user){
            res.status(404).json({
                message: 'User not found'
            });
        } else{
            //Check password
            if(comparePassword(password, user.password)){
                console.log('User is found with correct password');
                //Update password with new password
                var newpasswordhash = encryptPassword(newpassword);
                
                //Update the user object with the new password hash
                user.password = newpasswordhash;
                
                user.save(function(err){
                    if(err){
                        res.status(500).json({
                            message: 'Internal Server error. Password not changed'
                        });
                    } else{
                        
                        //TODO: Current refresh token should be put in a blacklist                        
                        res.status(200).json({
                            message: 'ok'
                        });
                    }
                });               
                
            } else{
                res.status(401).json({
                    message: 'Wrong password'
                });
            }
        }
    });
}

//To be called by front-end when Access Token has expired
function requestNewAccessToken(req, res, next){
    //Get parameters from body
    var refreshToken = req.body.refreshToken
    
    if(refreshToken){
        jwt.verify(refreshToken, secret, function(err, decoded){
            if(err){
                
                //Invalid Token (Tokens with invalid signature, malformed...)
                if(err.name === 'JsonWebTokenError'){
                    res.status(401).json({
                       message: 'Unauthorized. Invalid token',
                       tokenErrorType: err.name
                    });
                } else if(err.name === 'TokenExpiredError'){
                    res.status(401).json({
                       message: 'Unauthorized. Token has expired',//Note: Client should handle this handle specifically i.e. redirect to login page
                       tokenErrorType: err.name
                    });
                    
                } else{
                    res.status(401).json({
                       message: 'Unauthorized. Unknown token error',
                       tokenErrorType: err.name
                    });
                }                
            } else{
                //TODO: Check in database for blacklisted tokens using the decoded.client_id value
                
                //Create token and send it back to client
                var token = createAndSignAccessToken(decoded);//decoded has a username property
                res.status(200).json({
                    message: 'ok',
                    accessToken: token
                });
            }
        });
        
    } else{
        res.status(403).json({
            message: 'No refresh token provided'
        })
    }   
}

//Middleware to authenticate user when they access secure APIs
function authenticateUser(req, res, next){
    //Extract header from the request
    var headerExists = req.headers.authorization;
    if(headerExists){
        var tokenString = req.headers.authorization.split(' ')[1];//Authorization: Bearer <tokenString> format assumed
        //Verify the token. IMPT!
        jwt.verify(tokenString, secret, function(err, decoded){
            if(err){
                
                //Invalid Token (Tokens with invalid signature, malformed...)
                if(err.name === 'JsonWebTokenError'){
                    res.status(401).json({
                       message: 'Unauthorized. Invalid token',
                       tokenErrorType: err.name
                    });
                } else if(err.name === 'TokenExpiredError'){
                    //Proceed to check refresh token
                    //checkRefreshToken(req, res, next);
                    res.status(401).json({
                       message: 'Unauthorized. Token has expired',//Note: Client should handle this handle specifically i.e. request for new access token
                       tokenErrorType: err.name
                    });
                    
                } else{
                    res.status(401).json({
                       message: 'Unauthorized. Unknown token error',
                       tokenErrorType: err.name
                    });
                }
                
                //TODO: Handle Token error in greater details
                //console.log(err);
                
            } else{
                req.username = decoded.username;
                next();
            }
        });
        
        
    } else{
        res.status(403).json({
            message: 'No token provided'
        })
    }
}

module.exports = {
    loginUser: loginUser,
    registerUser: registerUser,
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    updateUserPassword: updateUserPassword,
    authenticateUser: authenticateUser,
    requestNewAccessToken: requestNewAccessToken
};
    
//Internal functions, change here to update the 
//encryption method
function encryptPassword(input){
    return bcrypt.hashSync(input, bcrypt.genSaltSync(10));
}

function comparePassword(input, hash){
    return bcrypt.compareSync(input, hash);
}
    
function generateUUID(){
    return uuid.v1();
}

function generateRandomUUID(){
    return uuid.v4();
}

function createAndSignAccessToken(user){
    return jwt.sign({ 
        username: user.username,
        role: 'GeneralUser'
    }, secret, {expiresIn: 30 * 60, jwtid: generateUUID()});//0.5 hour access token
}

function createAndSignRefreshToken(user, clientID){
    return jwt.sign({ 
        username: user.username,
        client_id: clientID
    }, secret, {expiresIn: 24 * 60 * 60});//1 day refresh token for now
}