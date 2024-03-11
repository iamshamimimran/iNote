import { default as connectToMongo } from './db.js';

connectToMongo();

import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`Hello this is port ${port} Happy Codding`);
});

app.listen(port, () => {
  console.log(`Example app listening on port https://localhost:${port}`);
});
