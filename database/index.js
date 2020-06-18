
const mongoose = require('mongoose');

const CONNECTION_STRING = 'mongodb+srv://root:123@cluster0-ezwez.mongodb.net/unfollow_users?retryWrites=true&w=majority';

mongoose.connect(CONNECTION_STRING, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true, 
});

mongoose.Promise = global.Promise;

module.exports = mongoose;