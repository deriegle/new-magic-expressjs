const express = require('express');
const router = express.Router();
const Message = require('../models/message');

router.param('messageId', (_req, _res, next, messageId) => {
    const message = Message.findById(messageId);

    if (message) {
        next();
    } else {
        next(new Error('Message not found.'));
    }
});

// POST /messages
// 
// Creates a new message
router.post('/', (req, res) => {
    const { content } = req.fields || {};

    const message = Message.create(content || '');

    res.turboStream.append('messages', {
        partial: 'messages/show',
        locals: {
            message,
        }
    })
});

// GET /messages/:messageId/edit
//
// Renders edit view for a particular message using turbo streams
router.get('/:messageId/edit', (req, res) => {
    const message = Message.findById(req.params.messageId); 

    res.render('messages/edit', {
        message,
    })
});

// POST /messages/:messageId
//
// Updates existing message content
router.post('/:messageId', (req, res) => {
    const { content } = req.fields || {};
    const message = Message.updateById(req.params.messageId, content);

    res.render('messages/show', {
        message,
    });
});

// POST /messages/:messageId/delete
//
// Endpoint for deleting a message (since you can't do deletes from form submissions)
// We should probably convert this over to using methodOverride instead
router.post('/:messageId/delete', (req, res) => {
    const { messageId } = req.params;

    Message.removeById(messageId);

    res.turboStream.remove(`message_${messageId}`);
});

module.exports = router;