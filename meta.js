const {parse} = require('sass-variable-parser');
const fs = require('fs');

const dirs = exports.dirs = {
    dist: 'dist',
    simpletonJs: 'simpleton/js',
    simpletonScss: 'simpleton/scss',
    docs: 'docs',
    docsDev: 'docs-dev',
    docsJs: 'metalsmith/raw/js',
    docsScss: 'metalsmith/raw/scss',
    docsAssets: 'metalsmith/src/assets',
    metalsmithSrc: 'metalsmith/src',
    metalsmithLayouts: 'metalsmith/layouts',
};

const files = exports.files = {
    'timestamp': 'timestamp.tmp',
    'sassdocjson': 'sassdoc.json',
};

const sassVars = exports.sassVars = parse(
    fs.readFileSync(`${dirs.simpletonScss}/_vars.scss`, 'utf8'),
    {camelCase: false},
);

const sassdocData = exports.sassdocData = require(`./${files.sassdocjson}`);
