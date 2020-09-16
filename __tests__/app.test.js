// require('dotenv').config();

// const { execSync } = require('child_process');

// const fakeRequest = require('supertest');
// const app = require('../lib/app');
// const client = require('../lib/client');

// describe('app routes', () => {
//   beforeAll(done => {
//     return client.connect(done);
//   });

//   beforeEach(() => {
//     // TODO: ADD DROP SETUP DB SCRIPT
//     execSync('npm run setup-db');
//   });

//   afterAll(done => {
//     return client.end(done);
//   });

//   test('returns games', async() => {

//     const expectation = [
//       {
        
       
//       },
//       {
        
//       },
//       {
        
//       }
//     ];

//     const data = await fakeRequest(app)
//       .get('/games')
//       .expect('Content-Type', /json/)
//       .expect(200);

//     expect(data.body).toEqual(expectation);
//   });
// });
