const app = require('./app');

const PORT = process.env.PORT || 3001; // fallback

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`); // eslint-disable-line
});
