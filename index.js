const express = require('express');
const bodyParser = require('body-parser');
const turboStream = require('./turboStream');
const formidable = require('express-formidable');
const path = require('path');
const { create, getMessages, findById, removeById, updateById } = require('./messages');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(formidable());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const viewsPath = path.join(__dirname, './views');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
turboStream.setViewsPath(viewsPath);

app.use((_req, res, next) => {
    // Set any default variables needed by base templates
    res.locals.pageTitle = 'New Magic Nodejs Example';

    next();
});


app.use((req, res, next) => {
    const { messageId } = req.params;

    if (messageId) {
        const message = findById(messageId);

        if (!message) {
            return res.writeHead(404);
        }
    }

    next();
});

app.get('/', (req, res) => {
    res.render('index', {
        messages: getMessages(),
    })
});

// POST /messages
// 
// Creates a new message
app.post('/messages', (req, res) => {
    const { content } = req.fields || {};

    const message = create(content || '');

    res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
    res.send(
        turboStream.append('messages', {
            partial: 'messages/show',
            locals: {
                message,
            },
        })
    );
});

// GET /messages/:messageId/edit
//
// Renders edit view for a particular message using turbo streams
app.get('/messages/:messageId/edit', (req, res) => {
    res.render('messages/edit', {
        message: findById(req.params.messageId),
    })
});

// POST /messages/:messageId
//
// Updates existing message content

app.post('/messages/:messageId', (req, res) => {
    const { content } = req.fields || {};
    const message = updateById(req.params.messageId, content);

    res.render('messages/show', {
        message,
    });
});

// POST /messages/:messageId/delete
//
// Endpoint for deleting a message (since you can't do deletes from form submissions)
// We should probably convert this over to using methodOverride instead
app.post('/messages/:messageId/delete', (req, res) => {
    const { messageId } = req.params;

    removeById(messageId);

    res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
    res.send(turboStream.remove(`message_${messageId}`));
});

app.listen(PORT, () => console.log('Listening on port 3001'));