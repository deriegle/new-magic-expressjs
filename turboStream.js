const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

let viewPath = __dirname;

const setViewsPath = (newViewPath) => viewPath = newViewPath;

const append = (target, options = {}) => base(target, 'append', options);
const prepend = (target, options = {}) => base(target, 'prepend', options);
const replace = (target, options = {}) => base(target, 'replace', options);
const update = (target, options = {}) => base(target, 'update', options);
const remove = (target, options = {}) => base(target, 'remove', options);

const base = (target, action, {
    partial,
    locals,
}) => {
    let content = '';

    if (partial) {
        const filename = partial.endsWith('.ejs') ? partial : partial + '.ejs';

        content = ejs.render(
            fs.readFileSync(path.join(viewPath, filename), 'utf-8'),
            locals || {},
        );
    }

    return `
        <turbo-stream action="${action}" target="${target}">
            <template>
                ${content}
            </template>
        </turbo-stream>
    `;
}

const middleware = (viewsPath = __dirname) => {
    setViewsPath(viewsPath);

    return (_req, res, next) => {
        // Using setHeader with an array for the content type is the only way I could find to set
        // the correct response content-type with text/html and turbo-stream. The content-type NPM package
        // would not allow the turbo-stream content type. It would be nice to extend that package or expressjs to allow
        // turbo stream usage, so that the header could be simpler.
        //
        // For example:
        // res.type('turbo-stream')
        res.turboStream = {
            append: (target, options) => {
                res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
                res.send(append(target, options));
            },
            prepend: (target, options) => {
                res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
                res.send(prepend(target, options));
            },
            replace: (target, options) => {
                res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
                res.send(replace(target, options));
            },
            update: (target, options) => {
                res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
                res.send(update(target, options));
            },
            remove: (target, options) => {
                res.setHeader('Content-Type', ['text/html; turbo-stream; charset=utf-8']);
                res.send(remove(target, options));
            },
        };

        next();
    }
}

module.exports = middleware;