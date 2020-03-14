const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const encode = require('metalsmith-encode-html');
const ignore = require('metalsmith-ignore');
const watch = require('metalsmith-watch');
const beautify = require('metalsmith-beautify');
const assets = require('metalsmith-static');
const pluralize = require('pluralize');
const Handlebars = require('jstransformer-handlebars').handlebars;

const {dirs, files, sassVars, sassdocData, version, description} = require('./meta');

const isProduction = process.env.NODE_ENV === 'production';

const handlebarsHelpers = {
    'ifeq': function(a, b, options) {
        if(a === b) return options.fn(this);
        return options.inverse(this);
    },
    'ifnoteq': function(a, b, options) {
        if(a !== b) return options.fn(this);
        return options.inverse(this);
    },
    'setvar': function(name, value, options) {
        if(!options.data.root) options.data.root = {};
        options.data.root[name] = value;
    },
    'sourcelink': function(path, start, end, options) {
        path = Handlebars.escapeExpression(path);
        start = Handlebars.escapeExpression(start);
        end = Handlebars.escapeExpression(end);

        const codeBase = 'https://github.com/jugheadeatsalot/simpleton-css/blob/master/scss';
        const content = options.fn(this);
        const link = `<a href="${codeBase}/${path}#L${start}-L${end}" target="_blank">${content}</a>`;

        return new Handlebars.SafeString(link);
    },
    'sourcelinkicon': function(path, start, end) {
        path = Handlebars.escapeExpression(path);
        start = Handlebars.escapeExpression(start);
        end = Handlebars.escapeExpression(end);

        const codeBase = 'https://github.com/jugheadeatsalot/simpleton-css/blob/master/scss';
        const srt = '<span class="screen-reader-text">View Source</span>';
        const iconPath = '/assets/img/symbols.svg#icon-new-tab';
        const svg = `<svg class="icon" aria-hidden="true"><use xlink:href="${iconPath}"></use></svg>`;
        const link = `${codeBase}/${path}#L${start}-L${end}`;
        const output = `<a href="${link}" target="_blank">${srt}${svg}</a>`;

        return new Handlebars.SafeString(output);
    },
    'crosslink': function(type, contextType, name, options) {
        type = Handlebars.escapeExpression(pluralize(type));
        contextType = Handlebars.escapeExpression(pluralize(contextType));
        name = Handlebars.escapeExpression(name);

        const href = (type === contextType) ? `#${name}` : `/${type}#${name}`;
        const content = options.fn(this);
        const link = `<a href="${href}">${content}</a>`;

        return new Handlebars.SafeString(link);
    },
    'anchorlink': function(name, options) {
        name = Handlebars.escapeExpression(name);

        const href = `#${name}`;
        const hidden = '<span aria-hidden="true">#</span>';
        const screenReader = `<span class="screen-reader-text">${options.fn(this)}</span>`;
        const content = `${hidden}${screenReader}`;
        const link = `<a id="${name}" class="anchor" href="${href}">${content}</a>`;

        return new Handlebars.SafeString(link);
    },
};

const metalsmith = Metalsmith(__dirname)
    .metadata({
        title: 'Simpleton CSS',
        description,
        version,
        isProduction: isProduction,
        sassVars,
        sassdocData,
    })
    .clean(isProduction)
    .source(dirs.metalsmithSrc)
    .destination(isProduction ? dirs.docs : dirs.docsDev)
    .use(inPlace({
        suppressNoFilesError: true,
        engineOptions: {
            helpers: handlebarsHelpers,
        },
    }))
    .use(layouts({
        directory: dirs.metalsmithLayouts,
        suppressNoFilesError: true,
    }))
    .use(permalinks({
        relative: false,
    }))
    .use(encode())
    .use(beautify({
        'indent_size': 4,
        'indent_char': ' ',
        'indent_with_tabs': false,
        'eol': '\n',
        'end_with_newline': true,
        'preserve_newlines': false,
        'wrap_line_length': 100,
        'wrap-attributes': 'auto',
        js: false,
        css: false,
    }))
    .use(assets({
        src: dirs.simpletonJs, // Relative to current directory
        dest: 'assets/js', // Relative to destination directory
    }));

if(!isProduction) {
    metalsmith.use(watch({
        paths: {
            '${source}/**/*': true,
            [files.timestamp]: '**/*',
            [`${dirs.metalsmithLayouts}/**/*`]: '**/*',
        },
        livereload: true,
    }));
}

metalsmith.build(err => {
    console.log('!!!');

    if(err) {
        console.error(err);

        throw err;
    }
});
