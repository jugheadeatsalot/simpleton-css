const Metalsmith = require('metalsmith');
const inPlace = require('metalsmith-in-place');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const watch = require('metalsmith-watch');
const beautify = require('metalsmith-beautify');
const assets = require('metalsmith-static');
const ignore = require('metalsmith-ignore');

const colors = [
    'dark',
    'light',
    'gray',
    'graylight',
    'graylighter',
    'graylightest',
    'graydark',
    'graydarker',
    'graydarkest',
    'text',
    'primary',
    'secondary',
    'accent',
    'idle',
    'success',
    'alert',
    'warning',
    'highlight',
    'border',
    'quote',
    'dribbble',
    'facebook',
    'flickr',
    'instagram',
    'linkedin',
    'medium',
    'pinterest',
    'rss',
    'tumblr',
    'twitter',
    'youtube',
];

Metalsmith(__dirname)
    .metadata({
        version: '1.0.0',
        title: 'Simpleton CSS',
        description: 'Just a simple CSS starter.',
        colors,
    })
    .clean(true)
    .source('metalsmith/src')
    .destination('public')
    .use(inPlace({
        suppressNoFilesError: true,
    }))
    .use(layouts({
        directory: 'metalsmith/layouts',
        suppressNoFilesError: true,
    }))
    .use(markdown())
    .use(permalinks({
        relative: false,
    }))
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
        src: 'dist',
        dest: 'assets', // Relative to source directory
    }))
    .use(watch({
        paths: {
            '${source}/**/*': true,
            'dist/**/*': '**/*',
            'metalsmith/layouts/**/*': '**/*',
        },
        livereload: false,
    }))
    .build(error => {
        if(error) console.error(error);
    });
