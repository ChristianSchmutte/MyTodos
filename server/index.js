const express = require('express');
const cors = require('cors');
require('dotenv').config();
const router = require('./router');

const PORT = process.env.PORT || 3001; // fallback

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

// app.listen(PORT, () => {
//   console.log(`Listening on http://localhost:${PORT}`); // eslint-disable-line
// });
module.exports = app;