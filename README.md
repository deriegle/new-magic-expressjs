# Trying out NEW MAGIC in Node.js

This project is using the new `@hotwired/turbo` package built by Basecamp for their **NEW MAGIC** used with hey.com. I wanted to try to figure out how it works behind the scenes after trying it out in Rails. There is a lot of magic going on behind the scenes like most Rails features. I figured building it in Node.js/Express would help me understand it more.

I've built this application to be similar to the sample application that is built in the video on [hotwire.dev](https://hotwire.dev). Make sure to check out that video if you haven't.

The primary goal was to learn and to provide a clear example to others on how the magic works and how it can be used in different programming languages.

## Facts about this project:

 - We are using an in-memory model of a Message that we interact with on the page.
 - Custom middleware built for Express that makes sending turbo-stream responses super easy.

 ## Using the custom middleware in `./turboStream.js`

 1. Import and use the middleware

 _The middleware takes a single argument for the file path to your views folder_

 **It also makes an assumption that you're using EJS. I want to clear this up if this gets extracted out to a separate library in the future.**

 ```js
 const express = require('express');
 const turboStream = require('./turboStream');

 const app = express();

 app.use(turboStream('./views'))
 ```

 2. Render your turbo stream response

 **Append**

```js
app.post('/messages', (req, res) => {
    const { content } = req.fields;

    // create message and save in database/memory/etc
    const message = create(content)

    // Make sure the first argument matches the HTML element id that you want to append a child to
    res.turboStream.append('messages', {
        partial: 'messages/show', // This should be inside your views directory as views/messages/show.ejs
        locals: { // Add any variables needed to render the partial
            message,
        }
    });
})
```

**Prepend**

```js
app.post('/messages', (req, res) => {
    const { content } = req.fields;

    // create message and save in database/memory/etc
    const message = create(content)

    // Make sure the first argument matches the HTML element id that you want to prepend a child to
    res.turboStream.prepend('messages', {
        partial: 'messages/show', // This should be inside your views directory as views/messages/show.ejs
        locals: { // Add any variables needed to render the partial
            message,
        }
    });
})
```

**Replace**

```js
app.post('/messages/:messageId', (req, res) => {
    const { messageId } = req.params;
    const { content } = req.fields;

    // update message in database/memory/etc
    const message = updateById(messageId, content)

    // Make sure the first argument matches the HTML element id that you want to replace
    res.turboStream.replace(`message_${messageId}`, {
        partial: 'messages/show', // This should be inside your views directory as views/messages/show.ejs
        locals: { // Add any variables needed to render the partial
            message,
        }
    });
})
```

**Update**

```js
app.get('/messages/refresh', (req, res) => {
    // Make sure the first argument matches the HTML element id that you want to update
    res.turboStream.update('messages', {
        partial: 'messages/index', // This should be inside your views directory as views/messages/index.ejs
        locals: { // Add any variables needed to render the partial
            messages: getMessagesFromDatabase(),
        }
    });
})
```

 **Remove**

 ```js
app.post('/messages/:messageId/delete', (req, res) => {
    const { messageId } = req.params;

    // delete message from database/memory/etc

    // Make sure this matches the HTML element id that you want to remove from the DOM
    res.turboStream.remove(`message_${messageId}`);
})
```