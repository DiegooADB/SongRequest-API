require('dotenv').config();
const router = require('express').Router();
const RequestController = require('./controllers/RequestController.js');
const AuthController = require('./controllers/AuthController.js');
const jwt = require('jsonwebtoken');

//Add new song to the queue request
router.post('/:user_name/song-request', checkToken, RequestController.addNewSong);

//Get the queue request
router.get('/:user_name/song-request', checkToken, RequestController.getQueueRequest);

//Register new user
router.post('/song-request/auth/register', AuthController.registerUser);

//Get users
//router.get('/song-request/register', RequestController.getUser);

//Login
router.post('/song-request/auth/login', AuthController.loginUser);

function checkToken(req, res, next) {

 const authHeader = req.headers['authorization'];
 const token = authHeader && authHeader.split(" ")[1];

 if (!token) {
  return res.status(401).json({ message: "access denied" });
 };

 try {
  const secret = process.env.SECRET

  jwt.verify(token, secret);

  next();
 } catch (error) {
  console.log(error);
  return res.status(400).json({ message: "Invalid token" });
 };

};

module.exports = router;