const express = require('express');
const bodyParser = require('body-parser');
const turboStream = require('./turboStream');
const formidable = require('express-formidable');
const path = require('path');

const PORT = process.env.PORT || 3001;

const messages = [
    {
        id: 1,
        content: 'Hello, world',
    },
    {
        id: 2,
        content: 'Try this',
    },
    {
        id: 3,
        content: 'Again',
    }
];

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(formidable());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const viewsPath = path.join(__dirname, './views');
app.set('view engine', 'ejs');
app.set('views', viewsPath);
turboStream.setViewsPath(viewsPath);

app.use((req, res, next) => {
    // Set any default variables needed by base templates

    res.locals.pageTitle = 'New Magic Nodejs Example';

    next();
});

app.get('/', (req, res) => {
    res.render('index', {
        messages,
    })
});

app.get('/messages', (req, res) => {
    res.render('messages/index', {
        messages,
    })
})

app.post('/messages', (req, res) => {
    const { content } = req.fields || {};

    const lastId = messages[messages.length - 1].id;

    const newMessage = {
        id: lastId + 1,
        content: content || '',
    };

    console.log(`Creating new message ${newMessage.id}`);

    messages.push(newMessage);


    res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
    res.send(
        turboStream.append('messages', {
            partial: 'messages/show',
            locals: {
                message: newMessage,
            },
        })
    );
});

app.post('/messages/:messageId/delete', (req, res) => {
    const { messageId } = req.params;
    const index = messages.findIndex(({ id }) => id === parseInt(messageId));

    if (index === -1) {
        res.writeHead(404);
        return;
    }

    messages.splice(index, 1);

    res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
    res.send(turboStream.remove(`message_${messageId}`));
});

app.get('/messages/:messageId/edit', (req, res) => {
    const { messageId } = req.params;
    const index = messages.findIndex(({ id }) => id === parseInt(messageId));

    if (index === -1) {
        res.writeHead(404);
        return;
    }
    
    res.render('messages/edit', {
        message: messages[index],
    })
});

app.post('/messages/:messageId', (req, res) => {
    const { messageId } = req.params;

    const { content } = req.fields || {};

    const index = messages.findIndex(({ id }) => id === parseInt(messageId));

    if (index === -1) {
        res.writeHead(404);
        return;
    }

    messages[index].content = content;

    res.render('messages/show', {
        message: messages[index],
    });
});

app.listen(PORT, () => {
    console.log('Listening on port 3001');
});


