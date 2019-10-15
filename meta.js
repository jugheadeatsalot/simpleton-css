const {parse} = require('sass-variable-parser');
const fs = require('fs');
const path = require('path');

const dirs = exports.dirs = {
    dist: path.resolve(__dirname, 'dist'),
    simpletonJs: path.resolve(__dirname, 'simpleton/js'),
    simpletonScss: path.resolve(__dirname, 'simpleton/scss'),
    docs: path.resolve(__dirname, 'docs'),
    docsDev: path.resolve(__dirname, 'docs-dev'),
    docsJs: path.resolve(__dirname, 'metalsmith/raw/js'),
    docsScss: path.resolve(__dirname, 'metalsmith/raw/scss'),
    docsAssets: path.resolve(__dirname, 'metalsmith/src/assets'),
    metalsmithSrc: path.resolve(__dirname, 'metalsmith/src'),
    metalsmithLayouts: path.resolve(__dirname, 'metalsmith/layouts'),
};

const files = exports.files = {
    'timestamp': 'timestamp.tmp',
};

const sassVars = exports.sassVars = parse(
    fs.readFileSync(`${dirs.simpletonScss}/_vars.scss`, 'utf8'),
    {camelCase: false},
);
