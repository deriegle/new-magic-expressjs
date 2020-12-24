const app = require('express')();
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

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

    res.render('messages/index', {
        messages,
    })
})

app.listen(PORT, () => {
    console.log('Listening on port 3001');
});