const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use routes
app.use(require('./routes'));

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/friends-for-thought', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// console.log for debugging
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));