import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';
import kue from 'kue'

// Config Section
const client = createClient();
const app = express();
app.use(express.json());
const fetchData = promisify(client.get).bind(client);
const queue = kue();


// Start Server
app.listen(1245, () => {
  console.log('app is running');
});