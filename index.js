const express = require('express');
const formidable = require('express-formidable');
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

const viewsPath = path.join(__dirname, './views');

app.set('view engine', 'ejs');
app.set('views', viewsPath);

// Custom middleware for dealing with turbo streams
// Also used to setup views path for the turbo-stream partial rendering
app.use(turboStream(viewsPath))

app.use((_req, res, next) => {
    // Set any default variables needed by base templates
    res.locals.pageTitle = 'New Magic Nodejs Example';

    next();
});

app.get('/', (_req, res) => res.render('index', {
    messages: Message.all(),
}));

app.use('/messages', messagesRouter)

app.listen(PORT, () => console.log('Listening on port 3001'));