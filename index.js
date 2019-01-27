const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const resolve = require('resolve');

const fix = (pkg, pathToPackage = process.cwd()) => {
  const { dependencies = {}, peerDependencies = {} } = pkg;

  // needed to preserve key order of package.json
  const { ...newPkg } = pkg;

  Object.keys(dependencies).forEach(depName => {
    let pathToDepPackageJson;
    try {
      pathToDepPackageJson = resolve.sync(path.join(depName, 'package.json'), {
        basedir: pathToPackage,
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
        if (dependencies[peerDepName] || peerDependencies[depName]) {
          return;
        }

        peerDependencies[peerDepName] = peerDepVersionRange;
      }
    );
  });

  newPkg.dependencies = dependencies;

  if (Object.keys(peerDependencies).length !== 0) {
    newPkg.peerDependencies = peerDependencies;
  }

  return newPkg;
};

module.exports = {
  fix,
};
