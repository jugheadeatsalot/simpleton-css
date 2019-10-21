const fs = require('fs');
const {parse} = require('sass-variable-parser');

const dirs = exports.dirs = {
    dist: 'dist',
    simpletonJs: 'js',
    simpletonScss: 'scss',
    docs: 'docs',
    docsDev: 'docs-dev',
    docsJs: 'metalsmith/js',
    docsScss: 'metalsmith/scss',
    docsAssets: 'metalsmith/src/assets',
    metalsmithSrc: 'metalsmith/src',
    metalsmithLayouts: 'metalsmith/layouts',
};

const files = exports.files = {
    'timestamp': 'timestamp.tmp',
    'sassdocjson': 'sassdoc.json',
};

exports.sassVars = parse(fs.readFileSync(`${dirs.simpletonScss}/_vars.scss`, 'utf8'), {camelCase: false});
exports.sassdocData = JSON.parse(fs.readFileSync(files.sassdocjson, 'utf8'));

const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'));

exports.version = packageInfo.version;
exports.description = packageInfo.description;
