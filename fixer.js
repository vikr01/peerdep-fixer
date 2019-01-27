const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const resolve = require('resolve');

const pathToPackageJson = require.resolve(
  path.join(process.cwd(), 'package.json')
);
const currentPackageJson = JSON.parse(
  fs.readFileSync(pathToPackageJson),
  'utf-8'
);
const { dependencies = {}, peerDependencies = {} } = currentPackageJson;

const format = pkg => JSON.stringify(pkg, null, 2);

Object.keys(dependencies).forEach(depName => {
  let pathToDepPackageJson;
  try {
    pathToDepPackageJson = resolve.sync(path.join(depName, 'package.json'), {
      basedir: pathToPackageJson,
    });
  } catch (err) {
    console.warn(
      chalk.yellow(`Could not find dependency ${depName}. Skipping.`)
    );
    return;
  }

  const { peerDependencies: peerDepsOfDep = {} } = JSON.parse(
    fs.readFileSync(pathToDepPackageJson)
  );

  Object.entries(peerDepsOfDep).forEach(
    ([peerDepName, peerDepVersionRange]) => {
      if (dependencies[peerDepName]) {
        return;
      }

      peerDependencies[peerDepName] = peerDepVersionRange;
    }
  );
});

const newPackageJson = format(currentPackageJson);
fs.writeFileSync(pathToPackageJson, newPackageJson, 'utf-8');
