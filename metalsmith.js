const Metalsmith = require('metalsmith');
const layouts = require('metalsmith-layouts');
const markdown = require('metalsmith-markdown');
const permalinks = require('metalsmith-permalinks');
const watch = require('metalsmith-watch');
const beautify = require('metalsmith-beautify');
const assets = require('metalsmith-static');
const ignore = require('metalsmith-ignore');

Metalsmith(__dirname)
    .metadata({
        "title": "Simpleton CSS",
        "description": "Just a simple CSS starter.",
    })
    .clean(true)
    .source('metalsmith/src')
    .destination('public')
    .use(markdown())
    .use(layouts({
        directory: 'metalsmith/layouts',
        suppressNoFilesError: true,
    }))
    .use(permalinks())
    .use(beautify({
        "indent_size": 4,
        "indent_char": " ",
        "indent_with_tabs": false,
        "eol": "\n",
        "end_with_newline": true,
        "preserve_newlines": false,
        js: false,
        css: false,
    }))
    .use(assets({
        src: 'dist',
        dest: 'assets', // Relative to source directory
    }))
    .use(watch({
        paths: {
            "${source}/**/*": true,
            "dist/**/*": "**/*",
            "metalsmith/src/**/*": "**/*",
        },
        livereload: false,
    }))
    .build(error => {
        if (error) console.error(error);
    });
