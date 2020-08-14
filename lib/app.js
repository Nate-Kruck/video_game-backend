const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

// const fakeUser = {
//   id: 1,
//   email: 'mrkerbable.net',
//   hash: '2813308004'
// };

app.get('/games', async(req, res) => {
  const data = await client.query('SELECT * from games');

  res.json(data.rows);
});

app.get('/games/:id', async(req, res) => {
  const gameId = req.params.id;

  const data = await client.query(`SELECT * from games where id=${gameId}`);

  res.json(data.rows[0]);
});

app.post('/games', async(req, res) => {
  const newGame = {
    name: req.body.name,
    genre: req.body.genre,
    mature: req.body.mature,
    price: 12,
    rating: 5,
    image: 9,
    owner_id: 7
  };

  const data = await client.query(`INSERT INTO games(name, genre, mature, price, rating, image, owner_id)
  VALUES($1, $2, $3, $4, $5, $6, $7)
  RETURNING *`, [newGame.name, newGame.genre, newGame.mature, newGame.price, newGame.rating, newGame.image, newGame.owner_id]);
  
  res.json(data.rows[0]); 
});
app.use(require('./middleware/error'));
module.exports = app;
