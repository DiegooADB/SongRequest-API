const db = require('../config/database.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Register new user

exports.registerUser = async (req, res) => {
 const { email, username, password, confirmPassword } = req.body;

 //verifications
 if (!email) {
  res.status(400).json({ message: "Email has required" });
  return;
 };
 if (!username) {
  res.status(400).json({ message: "Username has required" });
  return;
 };
 if (!password) {
  res.status(400).json({ message: "Password has required" });
  return;
 };
 if (password != confirmPassword) {
  res.status(400).json({ message: "Password doesn't match " });
  return;
 };

 //check if user exists
 const verify = await db.query("SELECT user_email, user_name FROM users WHERE user_email = $1 OR user_name = $2", [
  email,
  username
 ]);

 if (verify.rows.length > 0) {
  res.status(400).json({ message: `Username or email already registered` });
  return;
 };

 try {
  await db.query(`
  INSERT INTO users (user_email, user_name, user_password) VALUES ($1,$2,crypt($3, gen_salt('bf')))`,
   [email, username, password]);

  res.status(201).json({ message: "User has been created" });
 } catch (error) {
  res.status(400).json({ message: "error" });
  console.log(error);
 };
};

exports.loginUser = async (req, res) => {
 const { email, password } = req.body;

 if (!email) {
  res.status(400).json({ message: "Email has required" });
  return
 };

 if (!password) {
  res.status(400).json({ message: "Password has required" });
  return;
 };

 const user = await db.query(`SELECT *
 FROM users
WHERE user_email = $1 
  AND user_password = crypt($2, user_password);
`, [email, password]);

 if (user.rows.length == 0) {
  res.status(400).json({ message: "User or password doesn't match" });
  return;
 }

 try {

  const secret = process.env.SECRET;

  const token = jwt.sign({
   id: user.rows[0].user_id,
  },
   secret,
  );

  return res.status(200).json({ message: "Autentication perfomed successfully", token });
 } catch (error) {

  console.log(error)
  return res.status(500).json({ message: "Something went wrong" });
 };

};