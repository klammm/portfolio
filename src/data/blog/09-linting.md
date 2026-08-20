---
title: "Linting: The assistance we need, but don't deserve. Integrating Airbnb's ESLint rules with Gatsby and Prettier"
date: "2020-08-20"
keywords:
- 'linting'
- 'airbnb'
- 'eslint'
- 'prettier'
- 'config'
- 'devDependency'
- 'plugin'
- 'style guide'

---

In this post, I will talk about:

* Intro to Linting. What is this and why is this even a thing?
* Getting Started with ESLint
* ESLint Integration with Gatsby
* Airbnb ESLint Style Guide
* ESLint Integration with Prettier
* Gotchas
* Next Steps

### Intro to Linting. What is this and why is this even a thing?

So you want to lint your code, eh? Having trouble maintaining a consistent style guide across your codebase while working with multiple contributors? Too lazy to fix your own poorly formatted code? Not feeling good about another contributor's suspicious code that just got checked in?

These are some of the problems that the beautiful tool of [linting](https://en.wikipedia.org/wiki/Lint_(software)) solves. A linter is a tool that analyzes static code to flag down any potential programming errors, bugs, stylistic errors, common errors such as syntactic errors, and suspicious areas of your codebase such as deprecated functions, misuse of scope, undeclared or undefined variables, and many more.

As developers, it is valuable to spend more of our time and energy on solving more of the difficult, challenging problems instead of expending our mental energy towards more mundane tasks as stylistic formatting or catching common errors/bugs. With the introduction of linting, developers are able to concentrate on the initial stage of their program development lifecycle by tending to the algorithmic structure of their program, the correctness of it, and the integration/implementation feasibility of their program. After the program is working as intended, the developer can later retrofit their program using linters to achieve a certain level of modularity.

You could think of a linter as the finishing touches to a masterpiece. As an analogy, compare this to the sculpting of Michelangelo's marble masterpieces.  The initial phase of development that involves algorithms and data structures would be the actual sculpting, while the linting would be the finishing touches of cleaning up any dust off.

### Getting Started with ESLint

__TLDR__: Here's the official [ESLint Getting Started Documentation](https://eslint.org/docs/user-guide/getting-started).

To get started with ESLint, there are only two things to do:
1. install ESLint as a `devDependency`
2. create and configure the `.eslintrc.js` file

First, we're going to install ESLint as a `devDependency` since the linter will only run during the development lifecycle.

`npm install eslint --save-dev`

or

`yarn add eslint --dev`

Second, we'll create our ESLint configuration file. Go ahed and create a new file named `.eslintrc.js` within the root directory of our project.

Here within our newly created `.eslintrc.js` file, we are able to set our desired configuration.

Here's my example configuration that I'm using for this Gatsby application:

```
// .eslintrc.js
module.exports = {
  globals: {
    fetch: false
  },
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
  }
  extends: ["airbnb", "airbnb/hooks", "prettier", "prettier/react"]
};
```

In this configuration going from top to bottom, I am setting as part of my global variables the `fetch` variable as `fetch` is a global method as part of the Browser API. Therefore, `fetch` does not need to be defined so we are silencing the ESLint warning([no undefined variables rules](https://eslint.org/docs/rules/no-undef)).

Next up within the `parser` key, we are using [`babel-eslint`](https://github.com/babel/babel-eslint) as our ESLint parser over the default ESLint parser since the default parser [only supports the latest final ECMAScript standard](https://github.com/eslint/eslint/blob/a675c89573836adaf108a932696b061946abf1e6/README.md#what-about-experimental-features) and do not support experimental features(such as [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) and [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)).

_Note: This `parser` section is completely optional._  

Next up within the `env` key, we are specifying which environments that are script is designed to run in. As stated from the [ESLint docs](https://eslint.org/docs/user-guide/configuring), "Each environment brings with it a certain set of predefined global variables". With that said, we are pulling in the global variables defined by the Browser API and also Node's global variables.

Next up within the `extends` key, we are specifying which third-party rules to use from. For more advanced users, we are not using the `plugins` key because plugins are resolved relative to the config file while `extends` are relative to the __derived__ config file. For example, ESLint will load the plugin for `plugins` similar to how node will retrieve a package by running `require('eslint-plugin-foo')`, whereas ESLint will load the plugin for `extends` by resolving nested plugins at the root level of `node_modules`. An example from the [ESLint docs](https://eslint.org/docs/user-guide/configuring#configuring-plugins) shows this: "For example, if `./.eslintrc` has `extends: ["foo"]` and the `eslint-config-foo` has `plugins: ["bar"]`, ESLint finds the `eslint-plugin-bar` from `./node_modules/` (rather than `./node_modules/eslint-config-foo/node_modules/`) or ancestor directories."

So for my case here, I am extending from [airbnb's eslint plugin](https://www.npmjs.com/package/eslint-config-airbnb), [airbnb's hooks eslint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks), [prettier's eslint plugin](https://github.com/prettier/eslint-config-prettier), and [prettier's react eslint plugin](https://github.com/yannickcr/eslint-plugin-react).

### ESLint Integration with Gatsby

__TLDR__: Instructions found [here](https://github.com/mongkuen/gatsby-plugin-eslint#gatsby-plugin-eslint).

To integrate ESLint with Gatsby, we will have to do the following:
1. Install [`gatsby-plugin-eslint`](https://github.com/mongkuen/gatsby-plugin-eslint#gatsby-plugin-eslint) into our devDependencies
2. Add the `gatsby-plugin-eslint` plugin to our `gatsby-config.js`

First, we'll install the `gatsby-plugin-eslint` into our devDependencies.

`npm install --save-dev gatsby-plugin-eslint`

or

`yarn add --dev gatsby-plugin-eslint`

Second, we'll add our newly installed plugin into `gatsby-config.js`. Here's what that looks like:

```
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ['develop', 'build-javascript'],
        options: {
          emitWarning: true,
          emitError: true,
          failOnError: true,
        }
      }
    }
  ],
}
```

Starting from top to bottom, the `test` key that I am setting here are to test only `.js` or `.jsx` files.

The `exclude` key here is excluding these directories: `node_modules`, `.cache`, and `public/`. I am excluding these from being parsed in ESLint since these directories do not need to be linted.

The `stages` key is set for which stage would I like linting to be enabled. Here, I've set the linter to be active during the `'develop'` and `'build-javascript'` stage. Therefore, ESLint will do its job during the developing phase and when I am attempting to build my bundle.

The `options` key is used to set any additional configuration. Here, I would like ESLint to emit a warning and an error if any of the code does not satisfy our current lint rules. In addition, I am also setting ESLint to fail the `develop` stage if an error has occurred.

I've added several configuration options for my own personal development style. If you would like to use default options, you could specify the plugin in a more easier, verbose way.

```
// gatsby-config.js

module.exports = {
  plugins: [
    'gatsby-plugin-eslint'
  ]
}
```

### Airbnb ESLint Style Guide

So the ESLint style guide that we are aiming for will be [Airbnb's ESLint rules](https://github.com/airbnb/javascript). They have the most comprehensive style guide and they were one of the first organizations to create their own eslint style guide. Today, it's one of the most popular in the industry and some of their popular features include [trailing commas](https://github.com/airbnb/javascript#commas) and [semicolons](https://github.com/airbnb/javascript#semicolons) as part of linting rules.

### ESLint Integration with Prettier

To integrate ESLint with Prettier, we will be using the [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) eslint rule. `eslint-config-prettier` is an eslint config that will _turn off_ rules that conflict with Prettier.

### Gotchas

So you must be asking yourself, "Why do we have to turn off the rules of prettier? What's the point of having Prettier if we are barely using it?" As I was integrating ESLint into this current project, I found that the ESLint rules that I have set is conflicting with the automated formatting from Prettier. For example, I would fix all the ESLint errors before committing my code. Once I have made the commit, I have a [`pre-commit` hook](https://github.com/klammm/all-things-random/blob/master/package.json#L34) that will prettify my code for me. However, prettifying the code will conflict against ESLint rules and therefore, I will have to fix and commit my code again and again.

It seems that I am not the first to have faced this issue and as a result, there is an ESLint config plugin that was created for this very problem.

### Next Steps

Next steps to take with my new linter is to integrate this linting step with the CI/CD pipeline that we created in our [earlier blog post](http://klam.space/content/08-circleci-surge/). Before we build our production bundle, we want to ensure code quality. Therefore, an additional linting job could be added before building the bundle to catch any errors, bugs, or any suspicious code.

Thanks for reading and stay cool in this heat!

For a list of all the changes I did, check out my [PR here](https://github.com/klammm/all-things-random/pull/18).