const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

let viewPath = __dirname;

module.exports.setViewsPath = (newViewPath) => viewPath = newViewPath;

module.exports.append = (target, options = {}) => base(target, 'append', options);
module.exports.prepend = (target, options = {}) => base(target, 'prepend', options);
module.exports.replace = (target, options = {}) => base(target, 'replace', options);
module.exports.update = (target, options = {}) => base(target, 'update', options);
module.exports.remove = (target, options = {}) => base(target, 'remove', options);

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