const client = require('../lib/client');
// import our seed data:
const games = require('./games.js');
// const usersData = require('./users.js');
const gamingPlatform = require('./gamingPlatform.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    // const users = await Promise.all(
    //   usersData.map(user => {
    //     return client.query(`
    //                   INSERT INTO users (email, hash)
    //                   VALUES ($1, $2)
    //                   RETURNING *;
    //               `,
    //     [user.email, user.hash]);
    //   })
    // );

    // const user = users[0].rows[0];
    
    await Promise.all(
      gamingPlatform.map(platform => {
        return client.query(`
                      INSERT INTO gamingPlatform (name)
                      VALUES ($1)
                  `,
        [platform.name]);
      })
    );
    
    await Promise.all(
      games.map(game => {
        return client.query(`
        INSERT INTO games (name, platform_id, genre, price, rating, mature, image, id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [game.name, game.platform_id, game.genre, game.price, game.rating, game.mature, game.image, game.id]);
      })
    );
      
      
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  } catch(err) {
    console.log(err);
  } finally {
    client.end();
  }

}
