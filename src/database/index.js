const mongoose = require("mongoose");

const CONNECTION_STRING = process.env.CONNECTION_STRING;

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
