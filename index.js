const express = require('express');
const formidable = require('express-formidable');
const methodOverride = require('method-override');
const path = require('path');

const turboStream = require('./turboStream');
const Message = require('./models/message');
const messagesRouter = require('./routes/messages');

const PORT = process.env.PORT || 3001;

const app = express();

// Used to load styles.css file
app.use(express.static(path.join(__dirname, 'public')));

// Used for collecting data from form submissions
app.use(formidable());

// Used to send DELETE requests
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// Custom middleware for dealing with turbo streams
app.use(turboStream())

app.get('/', (_req, res) => res.render('index', {
    messages: Message.all(),
}));

app.use('/messages', messagesRouter)

app.listen(PORT, () => console.log('Listening on port 3001'));
