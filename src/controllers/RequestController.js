const db = require('../config/database.js');

//This method is used do add new song into the queue request

exports.addNewSong = async (req, res) => {
 const { user_name } = req.params;
 const { user_req, link } = req.body;

 try {
  const { rows } = await db.query(
   'SELECT user_id FROM users WHERE user_name = $1',
   [user_name]
  );

  await db.query(
   'INSERT INTO user_request (ur_user_req, yt_link, ur_user_to) VALUES ($1,$2,$3)',
   [user_req, link, rows[0].user_id]
  );

  res.status(201).json({
   message: 'Link added with success',
  })
 } catch (error) {
  res.status(400).json({
   message: "Error"
  });
  console.log(error);
 };
};

//This method is used to get the queue request

exports.getQueueRequest = async (req, res) => {
 const { user_name } = req.params;

 try {
  const { rows } = await db.query(
   `SELECT 
   s.user_name as User_From,r.yt_link as Link
   FROM
   user_request r 
   INNER JOIN users b ON r.ur_user_to = b.user_id
   INNER JOIN users s ON r.ur_user_req = s.user_id
   WHERE b.user_name = $1`, [user_name]
  );
  res.status(200).json(rows);
 } catch (error) {
  res.status(400).json({
   message: "Error"
  });
  console.log(error);
 };
};