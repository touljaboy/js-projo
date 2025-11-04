const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Health endpoint
app.get('/v1/health', (req, res) => {
  res.send('Saul Goodman 8|');
});

// Run the server
app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
  console.log(`Adress: http://localhost:${PORT}`);
});