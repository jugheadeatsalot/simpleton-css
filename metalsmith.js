const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const permalinks = require('metalsmith-permalinks');
const encode = require('metalsmith-encode-html');
const ignore = require('metalsmith-ignore');
const watch = require('metalsmith-watch');
const beautify = require('metalsmith-beautify');
const assets = require('metalsmith-static');
const Handlebars = require('jstransformer-handlebars').handlebars;

const {dirs, files, sassVars, sassdocData} = require('./meta');

const isProduction = process.env.NODE_ENV === 'production';

const hbsHelpers = {
    'ifeq': function(a, b, options) {
        if(a === b) return options.fn(this);
        return options.inverse(this);
    },
    'ifnoteq': function(a, b, options) {
        if(a !== b) return options.fn(this);
        return options.inverse(this);
    },
    'viewsourcelink': (path, start, end, anchor) => {
        if(typeof anchor !== 'string') anchor = 'View Source';

        path = Handlebars.escapeExpression(path);
        start = Handlebars.escapeExpression(start);
        end = Handlebars.escapeExpression(end);
        anchor = Handlebars.escapeExpression(anchor);

        const sassBase = 'https://github.com/jugheadeatsalot/simpleton-css/blob/master/simpleton/scss';
        const link = `<a href="${sassBase}/${path}#L${start}-L${end}" target="_blank">${anchor}</a>`;

        return new Handlebars.SafeString(link);
    },
};

const metalsmith = Metalsmith(__dirname)
    .metadata({
        version: '0.2.0',
        title: 'Simpleton CSS',
        description: 'Just a simple CSS starter.',
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
            helpers: hbsHelpers,
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
        js: false,
        css: false,
    }))
    .use(assets({
        src: dirs.simpletonJs, // Must be relative to current directory
        dest: 'assets/js', // Must be relative to destination directory
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
    if(err) console.error(err);
});
