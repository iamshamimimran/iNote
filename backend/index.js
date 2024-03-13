import { default as connectToMongo } from './db.js';
import bodyParser from 'body-parser';
import router from './routes/Auth-router.js';

connectToMongo();

import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api/auth",router);
// app.use(bodyParser.json())

app.get('/',(req, res) => {
  res.send(`Hello this is port ${port} Happy Codding`);
});

app.listen(port, () => {
  console.log(`Example app listening on port https://localhost:${port}/`);
});
