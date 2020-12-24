const app = require('express')();
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
        title: 'hey',
        message: 'hello there',
    })
});

app.get('/messages', (req, res) => {
    res.render('messages/index', {
        messages,
    })
})

app.post('/messages/:messageId', (req, res) => {
    const { messageId } = req.params;

    const { content } = req.fields || {};

    const index = messages.findIndex(({ id }) => id === parseInt(messageId));

    if (index === -1) {
        res.writeHead(404);
        return;
    }

    messages[index].content = content;

    res
    .type('html')
    .send(
        turboStream.replace('messages', {
            partial: 'messages/show',
            locals: {
                message: messages[index],
            },
        })
    );
});

app.listen(PORT, () => {
    console.log('Listening on port 3001');
});


