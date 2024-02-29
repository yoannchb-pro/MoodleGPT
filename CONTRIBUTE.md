# CONTRIBUTE

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Code of Conduct

See the code of conduct [here](./CODE_OF_CONDUCT.md)

## Pull Request Process

1. Update the README.md with details of changes to the extension.
2. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Setup the project

```
node: 18.13.0
npm: 8.19.2
```

### 1. Install dependencies

```
$ npm install
```

### 2. Setup Git hooks

```
$ git config --local core.hooksPath .githooks/
```

### 3. Build project

```
$ npm run build
```
