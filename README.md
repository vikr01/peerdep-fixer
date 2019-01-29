# peerdep-fixer

## Features

This is intended for frameworks, and **not** applications.

In some cases, dependencies require certain peer dependencies to work. If a framework is not going to include its dependencies' peer dependencies as dependencies of its own, it should hoist those peer dependencies to itself.

### Example:

Consider the package `bar` with `baz` as a peer dependency:

```json
{
  "name": "bar",
  "version": "0.1.0",
  "peerDependencies": {
    "baz": "0.1.0"
  }
}
```

Now consider the package `foo` with `bar` as a dependency (and `baz` as a dev dependency):

```json
{
  "name": "foo",
  "version": "0.1.0",
  "dependencies": {
    "bar": "0.1.0"
  },
  "devDependencies": {
    "baz": "0.1.0"
  }
}
```

If a user was to install `foo`, they may run into errors using it because `baz` was not installed but was required to make `foo`'s dependency, `bar`, work.

The outcome of `peerdep-fixer` is to modify `foo`'s peer dependencies to hoist `baz`:

```diff
{
  "name": "foo",
  "version": "0.1.0",
  "dependencies": {
    "bar": "0.1.0"
  },
  "devDependencies": {
    "baz": "0.1.0"
-  }
+  },
+  "peerDependencies": {
+    "baz": "0.1.0"
+  }
}
```

## Usage

Install:

```bash
# npm
npm install --save-dev peerdep-fixer

# yarn
yarn add -D peerdep-fixer
```

### CLI

All you need to do is run `fix-peerdeps` and the `package.json` **in your current working directory** will be updated:

```bash
fix-peerdeps
```

At this time there are no arguments or options.

#### Recommended configuration:

Correct dependencies should _always_ be included before publishing a module:

```json
{
  "scripts": {
    "prepublishOnly": "fix-peerdeps"
  }
}
```

### API

The API exposes a `fix` function that takes an object as a parameter and returns the modified object.

Example usage:

```javascript
const { fix } = require('peerdep-fixer');
const oldPackageJson = require('./package.json');
const newPackageJson = fix(oldPackageJson);
console.log(JSON.stringify(newPackageJson));
```
