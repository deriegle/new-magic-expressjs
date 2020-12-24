const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

let viewPath = __dirname;

module.exports.setViewsPath = (newViewPath) => viewPath = newViewPath;

module.exports.replace = (target, options = {}) => base(target, 'replace', options);

const base = (target, action, {
    partial,
    locals,
}) => {
    const filename = partial.endsWith('.ejs') ? partial : partial + '.ejs';

    const content = ejs.render(
        fs.readFileSync(path.join(viewPath, filename), 'utf-8'),
        locals || {},
    );

    return `
        <turbo-stream action="${action}" target="${target}">
            <template>
                ${content}
            </template>
        </turbo-stream>
    `;
}