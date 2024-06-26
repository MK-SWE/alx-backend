import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// Config Section
const client = createClient();
const app = express();
app.use(express.json());
const fetchData = promisify(client.get).bind(client);

// log redis status
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', err => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Data Storage
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

function getItemById (id) {
  listProducts.filter(item => item.itemId === id[0]);
}

function reserveStockById (itemId, stock) {
  client.set(itemId, stock);
}

async function getCurrentReservedStockById (itemId) {
  const stock = await fetchData(itemId);
  return stock;
}

// Express Routing
// GET /list_products that will return the list of every available product
app.get('/list_products', (req, res) => {
  res.send(listProducts);
});

// GET /list_products/:itemId,
// that will return the current product and the current available stock
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (item) {
    const stock = await getCurrentReservedStockById(itemId);
    const resItem = {
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      initialAvailableQuantity: item.initialAvailableQuantity,
      currentQuantity: stock !== null ? parseInt(stock) : item.initialAvailableQuantity
    };
    res.json(resItem);
  } else {
    res.json({ status: 'Product not found' });
  }
});

// GET /reserve_product/:itemId
// If the item does not exist, it should return:
// {"status":"Product not found"}
// If the item exists, it should check that
// there is at least one stock available. If not it should return:
// {"status":"Not enough stock available","itemId":1}
// If there is enough stock available, it should reserve one item and return
// {"status":"Reservation confirmed","itemId":1}
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const item = getItemById(parseInt(itemId));

  if (!item) {
    res.json({ status: 'Product not found' });
    return;
  }

  let currentStock = await getCurrentReservedStockById(itemId);
  if (currentStock !== null) {
    currentStock = parseInt(currentStock);
    if (currentStock > 0) {
      reserveStockById(itemId, currentStock - 1);
      res.json({ status: 'Reservation confirmed', itemId });
    } else {
      res.json({ status: 'Not enough stock available', itemId });
    }
  } else {
    reserveStockById(itemId, item.initialAvailableQuantity - 1);
    res.json({ status: 'Reservation confirmed', itemId });
  }
});

// Start Server
app.listen(1245, () => {
  console.log('app is running');
});
