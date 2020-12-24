// Promise wrapper around res.render to make it easy to render partials for turbo streams
const render = (res, partial, locals) => {
    return new Promise((resolve, reject) => {
        res.render(partial, locals, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });
}

const stream = async (res, target, action, {
    partial,
    locals,
}) => {
    let content = '';

    if (partial) {
        content = await render(res, partial, locals)
    }

    return `
        <turbo-stream action="${action}" target="${target}">
            <template>
                ${content}
            </template>
        </turbo-stream>
    `;
}

const middleware = () => (_req, res, next) => {
    const streamActionHandler = (action) => async (target, options) => {
        res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
        res.send(await stream(res, target, action, options));
    }

    res.turboStream = {
        append: streamActionHandler('append'),
        prepend: streamActionHandler('prepend'),
        replace: streamActionHandler('replace'),
        update: streamActionHandler('update'),
        remove: streamActionHandler('remove'),
    };

    next();
}

module.exports = middleware;
