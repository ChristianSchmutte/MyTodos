const mongoose = require('mongoose');

require('dotenv').config();

// const { DB_URL, DB_NAME } = process.env;

// mongoose.connect(
//   `${DB_URL}/${DB_NAME}`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   },
//   (error) => {
//     if (error) {
//       console.error(`Problem connecting to Mongo: ${error}`); // eslint-disable-line
//     } else {
//       console.log('Connected to Mongo 🤝'); // eslint-disable-line
//     }
//   } // eslint-disable-line
// );

module.exports = mongoose;
