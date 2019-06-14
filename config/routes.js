const axios = require('axios');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, jwtKey } = require('../auth/authenticate');

const Users=require('./users-model.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  try {
    const userInfo = await req.body
    console.log(userInfo)
    
    userInfo.password = await bcrypt.hashSync(userInfo.password, 10)
    const user = await Users.addUser(userInfo)
    res.status(201).json(user);
}

catch (error){
    console.log(error);
    res.status(500).json({
      message: 'Error creating a new user suckas',
    });

}
}

async function login(req, res) {

  let {username, password} = req.body;
  try {
      const user = await Users.findBy( { username })
      console.log(user)
      if (user && bcrypt.compareSync(password, user[0].password)){
        const token = generateToken(user);
        res.status(200).json({message:`Welcome user!`,
      token, 
      });

      }
      else {
          res.status(401).json({message: 'Invalid Credentials'})
      }
  }
  catch (error){
      console.log(error);
      res.status(500).json({
        message: 'Error creating a new login suckas',
      });

  }
};

function generateToken(user){
const payload = {
  subject: user.id,
  username: user.username

  //... other data like what websites someone has visited
}
const secret = jwtKey;
const options = {
expiresIn: '8h',
}
return jwt.sign(payload, secret, options)
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
