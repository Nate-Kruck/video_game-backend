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

  // selectUser(email) {
  //   return client.query(`
  //   SELECT id, email, hash
  //   FROM users
  //   WHERE email = $1;
  //   `,
  //   [email]
  //   ).then(result => result.rows[0]);
  // },
  // insertUser(user, hash) {
  //   return client.query
  // }
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
  try {
    // const userId = req.userId;
    const data = await client.query(`
            SELECT g.id, g.name, p.name AS platform_id, genre, mature, price, rating, image
            FROM games AS g
            JOIN gamingPlatform AS p
            ON g.platform_id = p.id
            
          `);
    res.json(data.rows);
          
  } catch(e) {
    res.status(500).json({ error: e.message });
  }

});

app.get('/games/:id', async(req, res) => {

  try {
    const gameId = req.params.id;

    const data = await client.query(`SELECT g.id, g.name, p.name AS platform_id, genre, mature, price, rating, image
    FROM games AS g
    JOIN gamingPlatform AS p
    ON g.platform_id = p.id
    WHERE g.id=$1
    `, [gameId]);

    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }

});

app.get('/gamingPlatform', async(req, res) => {
  try {
    const data = await client.query(`
      SELECT * FROM gamingPlatform`);

    res.json(data.rows);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/gamingPlatform/:id', async(req, res) => {

  try {
    const gameConsoleId = req.params.id;
    const data = await client.query(`
    SELECT g.id, g.name, p.name AS platform_id, genre, mature, price, rating
    FROM games AS g
    JOIN gamingPlatform AS p
    ON g.platform_id = p.id
    WHERE g.platform_id = $1
    `, [gameConsoleId]);

    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
  
// update game list
app.put('/games/:id', async(req, res) => {
  const gameId = req.params.id;
  
  try {
    const updatedGameList = {
      name: req.body.name,
      platform_id: req.body.platform_id,
      genre: req.body.genre,
      mature: req.body.mature,
      price: req.body.price,
      rating: req.body.rating
    };
  
    const data = await client.query(`
        UPDATE games
          SET name=$1, platform_id=$2, genre=$3, mature=$4, price=$5, rating=$6
          WHERE games.id = $7
          RETURNING *
      `,  [updatedGameList.name, updatedGameList.platform_id, updatedGameList.genre, updatedGameList.mature,
      updatedGameList.price, updatedGameList.rating, gameId]);
  
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/games', async(req, res) => {
  try {
    const newGame = {
      name: req.body.name,
      genre: req.body.genre,
      mature: req.body.mature,
      price: req.body.price,
      rating: req.body.rating,
      image: 'http://placekitten.com/200/200',
      
    };
    
    const data = await client.query(`
      INSERT INTO games(name, genre, price, rating, image)
      VALUES($1, $2, $3, $4, $5)
      RETURNING * 
      `, [newGame.name, newGame.genre, newGame.price, newGame.rating, newGame.image]);
    
    res.json(data.rows[0]);

  } catch(e){
    res.status(500).json({ error: e.message });
  }
});

app.delete('/games/:id', async(req, res) => {
  const gameId = req.params.id;

  const data = await client.query('DELETE FROM games WHERE games.id=$1;', [gameId]);

  res.json(data.rows[0]);
});


app.use(require('./middleware/error'));
module.exports = app;
