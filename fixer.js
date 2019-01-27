const fs = require('fs');
const path = require('path');
const { fix } = require('./');

const format = pkg => JSON.stringify(pkg, null, 2);

const pathToPackageJson = require.resolve(
  path.join(process.cwd(), 'package.json')
);

const currentPackageJson = JSON.parse(
  fs.readFileSync(pathToPackageJson),
  'utf-8'
);

const newPackageJson = fix(currentPackageJson, pathToPackageJson);
const newPackageJsonRaw = format(newPackageJson);

fs.writeFileSync(pathToPackageJson, `${newPackageJsonRaw}\n`, 'utf-8');
