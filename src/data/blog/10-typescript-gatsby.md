---
title: "Typescript with Gatsby: How to Migrate from Javascript to Typescript"
date: "2020-10-22"
keywords:
- 'typescript'

---

In this post, I will talk about:

* Intro to Typescript
* Using Typescript with Gatsby
* Typescript pros/cons
* Next Steps

### Intro to Typescript

In a few words, Typescript is a superset of Javascript. Typescript is an [open-source language built by Microsoft](https://www.typescriptlang.org/) to combat the problem of loose types within Javascript. Typescript provides static type definitions in your code which provides a way to describe the shape of your data and provide better documentation of data types within the code. What's special about Typescript is that it will compile down to basic Javascript and also perform a type check with the Typescript compiler. Therefore, type errors within your app are reduced to a minimum or even better of being completely type error free.

A basic Typescript example would be:
```
let foo: string = "foo"
foo = 123 // Error: Type 'number' is not assignable to type 'string'
```

Here, the Typescript compiler will throw an error since we are attempting to reassign a string type to a number type. In normal Javascript, this is perfectly valid code. Therefore, for better or worse, Typescript enforces types throughout your application.

### Using Typescript with Gatsby

Luckily for all us Gatsby folks, Gatsby integrates Typescript for us right out of the box. According to the [Gatsby site](https://www.gatsbyjs.com/docs/typescript/), "Gatsby natively supports Javascript and Typescript. You can change files from `.js` to `.tsx` at any point to start adding types and gaining the benefits of a type system". With that said, we are able to write valid Typescript files, however Gatsby will not provide the necessary type checking that is one of the main features of Typescript. We'll have to add that in ourselves. So let's get started!

1. Add optional plugin config https://www.gatsbyjs.com/plugins/gatsby-plugin-typescript/ to `gatsby-config.js`

Luckily, this plugin is automatically included in Gatsby. It will allow Gatsby to build Typescript files, however it will not perform type checking at build time. We will have to add type checking as part of another task for our Gatsby app. The only reason we would explicitly declare this plugin in our `gatsby-config.js` is to configure its options.

There are, however, several [caveats](https://www.gatsbyjs.com/plugins/gatsby-plugin-typescript/#caveats) that Gatsby has noted for us on their page. The caveats stem from this plugin's use of the babel plugin: [`babel-plugin-transform-typescript`](https://babeljs.io/docs/en/babel-plugin-transform-typescript.html). I would highly recommend going through the docs of these two plugins to ensure your own Typescript migration goes smoothly.

Here is the [example](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-typescript/gatsby-config.js) `gatsby-config.js` that Gatsby provides for a bare minimum Typescript integration.

2. Install type declarations and Typescript itself

When using Typescript and external libraries, you'll want to have the appropriate type declarations for those external libraries or Typescript will throw errors for code that _you didn't write_. It ensures that you know what the type will be for external code coming into your application.

We'll install some basic type declarations for our Gatsby app such as `react`, `react-dom`, and `node`.

`npm install --save-dev @types/react @types/react-dom @types/node`

We'll also install Typescript itself since that's what we're really here for 😉

`npm install --save-dev typescript`

Your `devDependencies` in `package.json` should at least have this now(don't mind the version numbers):

```
// package.json
"devDependencies": {
  "@types/node": "^14.14.2",
  "@types/react": "^16.9.53",
  "@types/react-dom": "^16.9.8",
  "typescript": "^4.0.3",
},
```

For a complete repository of all the type declarations for most of npm libraries, you can find it on [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped).

Now, there will be cases where the external library that you are bringing in might not have a type declaration. In that case, you will have to create a type declaration file yourself. I will not be covering that to stay within the scope of this article. For more on type declarations, please refer to the [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html).

3. Create a `tsconfig.json`

Now that we have Typescript in our application, let's set some configuration options.

Let's start by creating a new file called `tsconfig.json` at the top root level of your application.

A list of all the options that we can pass to `tsconfig.json` can be found [here](https://www.typescriptlang.org/tsconfig) on the Typescript docs.

Here are the options that I am passing for this application's `tsconfig.json`:

```
// tsconfig.json
{
  "include": ["./src/**/*"],
  "exclude": ["node_modules", "public", ".cache"],
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "lib": ["dom", "es2015", "es2017"],
    "allowJs": true,
    "checkJs": false,
    "jsx": "react",
    "noEmit": true,
    "skipLibCheck": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
  }
}
```

Note that most of the configs I have added here were inspired by the [using-typescript example](https://github.com/gatsbyjs/gatsby/blob/master/examples/using-typescript/tsconfig.json) that the Gatsby team has made.

So starting from top to bottom of the `tsconfig.json` above, I'll explain what each option is doing to the best of my ability.

`"include": ["./src/**/*"],`

Here, we are including which files that we would like the typescript compiler to run on. For my use case, I've chosen to run the typescript compiler on everything within the `src` folder of my [project](https://github.com/klammm/all-things-random/tree/master/src).

`"exclude": ["node_modules", "public", ".cache"],`

You can probably expect what this `excludes` option is for. It's the opposite of the `includes` option in that we are telling the typescript compiler to exclude typechecking through these directories that we've chosen here. We want to exclude `node_modules` since those would be type-checking our external libraries which we would have our type declarations for. We also want to exclude `public` since that will be our minified production bundle and the `.cache` since that is something that is created for us by Gatsby when it is building our HTML pages during build time and not in runtime.

```
"target": "esnext",
"module": "esnext",
```

Here, `target` and `module` are related in that we are choosing which JS features we'd like to support and target in our codebase, whether it be `ES5` or `ES6`. In our case, we're choosing `esnext` which is a "placeholder for features that are on the standard track but is not in an offical ES spec yet" as commented from [@mhegazy in this Typescript issue thread](https://github.com/microsoft/TypeScript/issues/24082#issuecomment-388874297). Because I am using experimental features such as optional chaining and I'd like to continue to use experimental features in the future, I am choosing my `target` and `module` to be `esnext`.

If your code is deployed to older browsers, it is recommended to set your target to a lower level JS such as `ES5`.

`"lib": ["dom", "es2015", "es2017"],`

Whatever we specify for `lib`, Typescript will include the default set of type definitions for built-in JS APIs such as `Math` and type definitions for the Browser API such as `document`.

For our case, we've specified the `dom` option which will include DOM definitions such as `document` and `window`. `es2015` and `es2017` will give their respective ES features of that year. Here's a [list of supported libraries](https://www.typescriptlang.org/tsconfig#lib).

```
"allowJs": true,
"checkJs": false,
```

`allowJs` option allows Javascript files to be imported and used inside Typescript files. `checkJs` will type-check JS files. These two options work hand-in-hand with each other in utilizing an incremental migration approach to Typescript.

`"jsx": "react",`

The `jsx` controls the output of JSX to JS files. For my case here, I opted for the `"jsx": "react"` option to emit JSX using React's  `React.createElement` call.

`"noEmit": true,`

With this setting, I've opted for the Typescript compiler to not output into Javascript files during the compile process. That way, we can let Gatsby handle the Typescript conversion process.

`"skipLibCheck": true,`

`skipLibCheck` option will exclude our general `lib` folder which usually stands for libraries. In our case, it will exclude type-checking the entire `node_modules` directory. Typescript will only type-check code that we directly import and use in our code.

`"removeComments": true,`

This option will remove comments from the resulting Javascript.

`"noImplicitAny": true,`

This option will issue an error when Typescript has to infer an `any` type. In cases where there is no type declared, Typescript will default to the `any` type. Situations this would happen would be function arguments, where you wouldn't know what type would be passed in from the function invoker.

`"strictNullChecks": true,`

This option will issue an error when there is anywhere in the code that `undefined` and `null` might appear. Therefore, I am opting to not use any `undefined` or `null` values. This case happens mostly when attempting to retrieve object properties that you don't know exist yet or not.

4. Add type-check task in `package.json` scripts

`"type-check": "tsc --noEmit",`

Next, I add a type checking task in the list of `package.json` scripts so that I and other project contributors may run a type-check easily in the future. I've also opted to add the type check to my build process.

My new build script looks like this now:

`"build": "tsc --noEmit && gatsby build",`

So let's disect this line `tsc --noEmit` a bit. `tsc` is invoking the Typescript compiler and I am passing in the flag `--noEmit` which does not emit output JS files. Therefore, we are using the advantages of type-checking without compiling our Typescript into JS(we're letting Gatsby/Babel handle that for us).

5. Migrate first component to typescript

Choose the simplest component and also choose a leaf component in your React tree. A leaf component is a component that is not rendering any other children. It is at the bottom level of the React virtual DOM tree. The advantage of this is that there is no state or props being passed through since there are no child components.

For my case, I opted for the [`Footer` component](https://github.com/klammm/all-things-random/blob/master/src/components/footer.jsx) since it was not rendering any other component.  

Before:
```
import React from 'react';

import '../styles/footer.css';

const currentYear = new Date().getFullYear();

const Footer = () => (
  <footer className="Footer">
    {`© ${currentYear}, Built with `}
    <a href="https://www.gatsbyjs.org">Gatsby</a>
  </footer>
);

export default Footer;
```

After:
```
import * as React from "react"

import "../styles/footer.css";

const Footer = (): JSX.Element => (
  <footer className="Footer">
    {`© ${new Date().getFullYear()}, Built with `}
    <a href="https://www.gatsbyjs.org">Gatsby</a>
  </footer>
);

export default Footer;
```

Since the Footer component was not taking any props, it was very easy to convert into Typescript. All I did was provide the type annotation for the return type of the function.

Another interesting line I'd like to bring up is the default import I made at the top.

`import * as React from "react"`

Typescript is quite [strict](https://www.typescriptlang.org/docs/handbook/modules.html#import-the-entire-module-into-a-single-variable-and-use-it-to-access-the-module-exports) when it comes to default imports. There is special config that would allow us to use default imports, but importing React as such gives us a good workaround.

Note: Typescript migration _should_ be incremental. It should happen in short segments at a time and not all at once(not recommended unless you have a very small codebase).


### Typescript pros/cons

I've heard mixed opinions about Typescript when speaking to my team about incorporating Typescript into a project. Here are some of their thoughts:

#### Cons

"Dev buy-in is way too high"

"We aren't having a type error problem. Do we really need this?"

"We want to experiment often and ship software fast. Typescript adds more work to shipping out fast."

"Increased cognitive load on syntax"

"Barrier to entry and less approachable"

"Migrating to Typescript is going to take too long"

"Very difficult to import code from non-TS codebases"


#### Pros

"It makes working in a large codebase with many contributors a lot easier and predictable"

"Typescript is way more reliable than Javascript and easier to refactor"

"I don't have to waste time manually debugging silly bugs in the console"

"The code is a lot easier to understand now"

"I can refactor Typescript code a lot faster than JS"

"I don't have to write trivial unit tests on type checking. I can finally write business logic unit tests"

### Next Steps

That was only the first step with integrating Typescript into this Gatsby application. Next, we'll incrementally migrate more components over to Typescript over time and also create our type declarations file for our external libraries.

A complete list of changes can be found [here](https://github.com/klammm/all-things-random/pull/19).