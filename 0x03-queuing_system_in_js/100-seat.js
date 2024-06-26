import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';
import kue from 'kue'

// Config Section
const client = createClient();
const app = express();
app.use(express.json());
const fetchData = promisify(client.get).bind(client);
const queue = kue.createQueue();

// log redis status
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', err => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// main logic 
function reserveSeat(number) {
  client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const seats = fetchData('available_seats')
  return seats;
};

let reservationEnabled = true;

// server routes
app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats});
})

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: "Reservation are blocked" })
  };
  const job = queue.create('reserve_seat', { 'seat': 1 }).save((error) => {
    if (!error) {
      res.json({ status: "Reservation in process" });
    } else {
    res.json({ status: "Reservation failed" })
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  }).on('failed', (err) => {
    console.log(`Seat reservation job ${job.id} failed: ${err}`);
  });
})

app.get('/process', (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    const seat = Number(await getCurrentAvailableSeats());
    if (seat === 0 ){
      reservationEnabled = false;
      done(Error('Not enough seats available'));
    }
    reserveSeat(seat - 1);
    done();
  });
  res.json({ status: "Queue processing" })
})

// Start Server
app.listen(1245, () => {
  console.log('app is running on http://localhost:1245');
  reserveSeat(50);
});
