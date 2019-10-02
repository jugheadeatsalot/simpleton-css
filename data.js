const {parse} = require('sass-variable-parser');
const fs = require('fs');

const sassVars = parse(
    fs.readFileSync('simpleton/scss/partials/_vars.scss', 'utf8'),
    {camelCase: false},
);

exports.sassVars = sassVars;