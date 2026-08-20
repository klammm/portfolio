---
title: "How to set and access environment variables in Gatsby using CircleCI and dotenv"
date: "2020-12-01"
keywords:
- 'dotenv'
- 'api key'
- 'CircleCI'
- 'environment variable'
- 'security'
- 'API key'
- 'environment'

---

In this post, I will talk about:

* Rule #1: Do NOT ever commit a key or secret to Github
* The Power of Environment Variables
* CircleCI environment variables
* dotenv and Gatsby
* Conclusion

### Rule #1: Do _NOT_ Ever Commit an API key or Secret to Github


Before we start off on fun stories of $20,000 to $50,000 bills in the mail for some blissfully unaware junior developer wanting to try out AWS or [even experienced developers happy little accidents](https://vertis.io/2013/12/16/unauthorised-litecoin-mining.html), we need to understand what an API key is and what it's all about. 

An API key is essentially a unique identifier that the API uses to authenticate a user or a program. It's what an API uses to determine how many times it's responding to a certain address. In real world examples, AWS bills you for each time you use any of their API services. If someone else were to get ahold of that API key, they could be using those exact AWS services for their own programs for free and you would be footing the cost. 

Therefore, committing an API key into code and pushing up to an open-source platform like Github exposes the key to the internet. 

To use these API keys and secrets in our code without exposing to the world, we have to use [environment variables](https://en.wikipedia.org/wiki/Environment_variable).

### The Power of Environment Variables

So what are environment variables and how are they valuable to us? 

Environment variables are dynamic variables that are part of the environment during runtime. The environments can vary based on whatever we determine it to be. A standard approach in the industry is to have a development, staging, and production environment each with their own special environment variables. These environments will use environment variables to mimic the type of environment that is desired. For example, mapping a CMS(Content Management System) with the different environments can enable developers to use development environment data and content instead of messing around with production content. From a product standpoint, you wouldn't want your production environment to be coupled with a bunch of "test" data. So we separate the two environments with key identifiers such as environment variables. 

Other examples of the value that environment variables provides to us is hiding our API keys and allowing developers to use a development API key versus a production API key. In terms of a real-world example like using [AWS and its different pricing systems](https://aws.amazon.com/pricing/), this benefits us by allowing us to allocate certain resources for development and production environments. In a development environment, there would be less of a need for spinning up multiple servers and less need to cache data. In a production environment, we would need to have auto-scaling capability and to cache data as well to provide a good user experience. These features come with a certain cost and everyone loves reducing costs, hence the value of using environment variables to separate the two different environments and utilizing these two different environments in a cost-effective approach.

### CircleCI environment variables

Luckily for us, CircleCI has [extensive support for environment variables](https://circleci.com/docs/2.0/env-vars/). 

We'll start off with just adding an environment variable. 

1. Sign in and go to your project in CircleCI

2. Click on the "..." icon and click on "Project Settings"

3. Click on "Environment Variables"

4. Click on "Add Environment Variable"

5. There will be a popup modal that asks for a "name" and "value". For now, we will add a test environment variable. Under "name", type out "FOO". Under "value", type out "BAR". 

Note: You are welcome to use any environment variable here, but for the purposes of this blog post, we will focus on test variables to account for all skill levels. 

And there you have it! We have our first CircleCI environment variable ready to go in our workflow builds. 

Next, we'll have to pass these environment variables that were defined in CircleCI to our deployed code and to be used within our Node runtime process. Unfortunately, CircleCI only exposes these environment variables in during the build process and not passed in to our deployed code. Therefore, we'll have to explicitly export our environment variables to a `.env` file to include them in our final code bundle. If you're unsure of what a `.env` file is, I will explain more in depth later in this post. For now, you can think of it as a place we'll store our environment variables locally in our code without being pushed to Github. [source](https://stackoverflow.com/questions/64152745/pass-environment-variable-to-node-js-process-in-circleci)


First, we'll step back into our `.circleci/config.yml` file again to configure our CircleCI workflow.

Within my `build` job, I'm going to add another `run` step after the `npm install` and before the `npm run build` steps. 

__Before__

```
# config.yml

- run: npm install
- save_cache:
    paths:
      - ./node_modules
    key: v1-dependencies-{{ checksum "package.json" }}
- run: npm run build
```

__After__

```
# config.yml

- run: npm install
- save_cache:
    paths:
      - ./node_modules
    key: v1-dependencies-{{ checksum "package.json" }}
- run:
    name: Create environment variables
    command: |
      touch .env.production
      echo "FOO=$FOO" > .env.production
- run: npm run build
```

In this new `run` step that I added, we are creating a new file named `.env.production` since I want my `.env` file in the CircleCI build to target a production environment. 

Next, we are overwriting this file with the code: `"FOO=$FOO"`.  `$FOO` is an environment variable that CircleCI exposes to us during build time so what we're doing here is capturing that value and writing it into our `.env` file for us to use during our production environment runtime. 

Now in our final code bundle, we should have a file named `.env.production` at runtime containing the following: 

`FOO="BAR"`

This is huge for us as now we can use the [`dotenv` npm library](https://www.npmjs.com/package/dotenv) to access these environment variables anywhere in our code. 

### dotenv and Gatsby

[Dotenv](https://www.npmjs.com/package/dotenv), according to the description on npm, is "a zero-dependency module that loads environment variables from a `.env` file into `process.env`". 

In other words, `dotenv` will load our environment variables into the [Node.js process](https://nodejs.org/dist/latest-v8.x/docs/api/process.html). 

So let's get started with these neat package and install it into our project.

Begin with 

```
# with npm 
npm install dotenv
 
# or with Yarn 
yarn add dotenv
```

Next, we're going to make our environment variable available to us in the `gatsby-config.js` file since in the future, I want to use the Google Analytics Gatsby plugin which requires me to provide an API key. 

So to do that, at the top of `gatsby-config.js`, add the following:


```
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});
```

Here, we're including our `dotenv` package into our `gatsby-config.js` without assigning to a variable so it is globally defined to be used anywhere in `gatsby-config.js`. In the future if we want to have our environment variables defined throughout our whole project in React, we would include and define our env. variables through our top-level root component as props or even initialized in our Redux store/React context. 

Next line, we're setting the path at where `dotenv` is retrieving our environment variables. `dotenv` defaults to a `.env` file but we've set our `.env` file to be named `.env.production` so that we can have multiple `.env` files for our different working environments. 

At this point, I would also recommend creating a `.env.development` file at the root level of your project that would contain the same environment variables we created on CircleCI for us to develop and play around with. 

Next, and this is __VERY IMPORTANT__ so do __NOT__ skip this part.

We're going to add `.env.*` to our `.gitignore` so that we will never, ever, ever * 10 accidentally commit, push, and expose our environment variables to Github. 

```
# .gitignore

.env.*
```

Adding this line in `.gitignore` will now effectively git ignore any changes to any file with the `.env.` prefix. 

Whew, catastrophe avoided there in one simple line. 

### Conclusion

Congratulations on creating your `.env` file and creating environment variables in your project!

Some next steps would be to start placing API keys/secrets into the `.env` file and using them throughout my project. What I'm going to do next with the new `.env` file is to setup Google Analytics with my project website. To do that, Google Analytics provides me with a tracking ID that I need to store inside my `.env` file, so that way my tracking ID isn't compromised from a security perspective. 

This is a good introduction to security practices when developing for the web. Ideally, we wouldn't need any protection but we live in a world where others might want to exploit vulnerabilities. 

Thanks for reading and stay safe! 

A complete list of changes can be found [here](https://github.com/klammm/all-things-random/pull/20).