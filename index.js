import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import path from 'path'

import { router } from './routes/routes.js'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(router);

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('listening', () => {
  console.log(`Listening on port ${port}`);
});
httpServer.on('error', (error) => {
  console.error(error);
});