---
title: "Deploying Merged Pull Requests Automatically with CirleCI 2.0"
date: "2020-04-07"
keywords:
- 'CircleCI'
- 'Deploy'
- 'pull request'
- 'Surge'

---

In this post, I will talk about:

* Recall: Deploying with Surge
* Intro to Continuous Integration
* Getting Started with CircleCI
* Deploying Merged Pull Requests with CircleCI
* Additional Code Changes
* Challenges I Faced/Potential Errors
* Next Steps


### Recall: Deploying with Surge

Let's recall what we've done so far earlier this 2020 year. In terms of workflow automation, I am able to [deploy my project using surge](http://klam.space/content/03-deploy-surge/). On top of that, I am automatically deploying every time a commit was pushed to a branch using the `pre-push` [git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks). We've been able to solve interesting challenges with that, however this automation also brings a new set of problems and challenges with it.

- How can I not automatically deploy when I am pushing to a feature branch?

- How can I stop the deployment if the lint and tests do not pass?

- How can I only and automatically deploy when merged a pull request into master?

These are all questions I asked myself after finishing the [git hooks integration](http://klam.space/content/05-github-integration/).

Queue the drumroll 🥁

### Intro to Continuous Integration

Da-dun 🎊! We can solve this set of problems using [Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration).  

> Continuous Integration (CI) is the practice of merging all developers' working copies to a shared mainline several times a day. - Wikipedia

Although I am the only contributor to this application for now, it doesn't mean that I can smoothen out the workflow for myself and for any future contributors. Using the practice of continuous integration, we are able to run tests, compile code, and even deploy automatically to ensure that any deviation from the original copy(in most cases, it'll be `master` branch) does not break any existing code.

This type of practice is incredibly helpful and almost necessary in this day and age for a large organization with multiple engineers working on the same codebase and all wanting to eventually integrate their changes into one main branch. There are [many CI tools out there today](https://www.katalon.com/resources-center/blog/ci-cd-tools/). The one we'll be going with today will be [CircleCI](https://circleci.com/).

### Getting Started with CircleCI

__TLDR__: Create an acccount, link a repository, and create a `.circleci/config.yml` on a separate branch to see your first pipeline start building. Follow the official [CircleCI docs](https://circleci.com/docs/2.0/getting-started/).

__Zero__: Before we go any further, create a [Github](https://github.com/join) or [Bitbucket](https://bitbucket.org/account/signup/) account if you don't already have one.

__First__: Let's create a CircleCI account on their [signup page](https://circleci.com/signup/). They'll ask you to create an account using either Github or Bitbucket [Oauth](https://en.wikipedia.org/wiki/OAuth).

__Second__: Select a repository you'd like to set up CircleCI with. Once you've selected a repository, click on "Set Up Project".

__Third__: Choose a programming language from the dropdown and CircleCI will provide a pre-populated `config.yml` file with suggested best practices. In my case, I selected Node.

__Fourth__: Click on start building once you've selected a language already. Follow the prompt to add the config to a new branch CircleCI creates for us `circleci-project-setup` .

_Note_: If you'd like to do this manually, you can add a `.circleci/config.yml` to your project root and push to your own version control provider.

__Fifth__: Now, you can see your first pipeline running. Navigate to the "Pipelines" section in the CircleCI side menu.

And.... voila! We now have a basic working CirleCI project pipeline.

### Deploying Merged Pull Requests with CircleCI

__TLDR__: Check out the finished `config.yml` [here](https://github.com/klammm/all-things-random/blob/master/.circleci/config.yml). Add your Surge login and token to CircleCI's environment variables(more info [here](https://surge.sh/help/integrating-with-circleci) Note that this is slightly out of date since we are using CircleCI 2.0 now).

Ok let's get this thing going. Let's break down what we'll be writing in our `config.yml` first.

__First__: If you used CircleCI's pre-populated configuration, you should already have a CircleCI version number and an [orb](https://circleci.com/orbs/) with your particular language. Without getting too deep into CircleCI orbs, you can think of it as a reusable package of YAML configuration. If not, add these to the top of your `config.yml` file.

`config.yml`

```
version: 2.1
orbs:
  node: circleci/node@1.1.6
```

__Second__: Let's start creating jobs to run during our workflow. We'll start with the building process which is one of the most important jobs that we'll run over and over again. Under the version number and orbs we just added or already had, let's add this block of code:

`config.yml`

```
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install
      - save_cache:
          paths:
            - ./node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: npm run build
```

I'll break it down to the best I can of what's going on in each line.

```
jobs:
  build:
```

1. We declare what jobs we want to create. Feel free to name the job whatever makes sense. In this case, I'm declaring a new job named `build`.

```
jobs:
  build:
    executor:
      name: node/default
```

2. To the extent of my knowledge, the `executor` is used to define the system environment for each job e.g. Docker, Linux, macOS, or windows. I believe what's happening here is that I am setting the environment to be the default node version, whatever that may be. Without doing too much of a deep dive since this seemed like it's own beast of a topic, check out [executor-types on CircleCI docs](https://circleci.com/docs/2.0/executor-types/) and the [Node orb usage](https://circleci.com/orbs/registry/orb/circleci/node).

```
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
```

3. Now the juicy part of defining the commands of what our `build` job will perform under `steps`. Our first step here will be the `checkout` step. The `checkout` step is "A special step used to check out source code to the configured `path` (defaults to the `working_directory`). The reason this is a special step is because it is more of a helper function designed to make checking out code easy for you." as defined by [CircleCI](https://circleci.com/docs/2.0/configuration-reference/#checkout).

```
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-
```

4. Our second step will be the [`restore_cache`](https://circleci.com/docs/2.0/configuration-reference/#restore_cache) step which restores the previously saved cache based on a key. In this case, we're naming our first cache key of `v1-dependencies-{{ checksum "package.json" }}` where the `checksum` will find an exact match to what we've defined which happens to be our `package.json` list of dependencies. Otherwise, we fall back to whatever was in the cache key of `v1-dependencies-`.

```
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install
```

5. Our next step will be to run a custom command. In this case, it's to run `npm install` which will install our list of dependencies.

```
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install
      - save_cache:
          paths:
            - ./node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
```

6. Now that we've installed our dependencies. We will be saving them in a cache hence the `save_cache` step. We set the `path` to save all of our `node_modules` dependencies to the `key` of `v1-dependencies-{{ checksum "package.json" }}`.

```
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install
      - save_cache:
          paths:
            - ./node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: npm run build
```

7. Last but not least, we will finally run the step of building which runs our own npm script to build which is `gatsby build`.

Awesome! we have our `build` job done now.

__Third__: We'll be defining one more job. Now that we have our `build` job. We need to define a `deploy` job.

Here it is here:

```
deploy-prod:
  executor:
    name: node/default
  steps:
    - checkout
    - run: npm install
    - run: npm run build
    - run: npm install surge
    - run:
        name: Deploy if tests pass, build is succssful, and branch is Master
        command: ./node_modules/surge/lib/cli.js --project ./public --domain klam.space
```

Here, we're using a lot of the same steps we had used earlier in our `build` job. The extra steps we are running in this `deploy` job is to install Surge and then to run the same command that we normally use to deploy.

I chose to name this job `deploy-prod` because eventually in the future, I want to have a job that will deploy to a feature branch or a development branch for testing purposes to ensure what's live for my users will never be in a broken or unintended experimental state.

So all together, our `config.yml` so far looks like this:

```
version: 2.1
orbs:
  node: circleci/node@1.1.6
jobs:
  build:
    executor:
      name: node/default
    steps:
      - checkout
      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install
      - save_cache:
          paths:
            - ./node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: npm run build
  deploy-prod:
    executor:
      name: node/default
    steps:
      - checkout
      - run: npm install
      - run: npm run build
      - run: npm install surge
      - run:
          name: Deploy if tests pass, build is succssful, and branch is Master
          command: ./node_modules/surge/lib/cli.js --project ./public --domain klam.space
```

__Fourth__: Now that we have our jobs defined. We need to set our workflow. As defined on the [CirclCI docs on workflow](https://circleci.com/docs/2.0/workflows/#overview) themselves, "A workflow is a set of rules for defining a collection of jobs and their run order. Workflows support complex job orchestration using a simple set of configuration keys to help you resolve failures sooner."

```
workflows:
  version: 2
  build:
    jobs:
      - build
      - deploy-prod:
          requires:
            - build
          filters:
            branches:
              only: master
```

So what I have here is I am using CircleCI version 2.0. I have defined the `build` workflow that is running 2 different jobs: the `build` job and the `deploy-prod` job. Under the `deploy-prod` job, I've also defined some conditions. Reading from top to bottom, the `deploy-prod` job requires the `build` job to be successful first before running. In addition, it will only run this `deploy-prod` job for the `master` branch.

Whew! That was a lot to take in. Check out the finished `config.yml` [here](https://github.com/klammm/all-things-random/blob/master/.circleci/config.yml). Now you are able to build and deploy your project automatically with CircleCI and Surge.

### Additional Code Changes

Since my last blog post, I've made several additional, although not necessary, code changes to adjust this project to integrate with CircleCI.

- Git Hooks

Recall in a previous post about [Git hooks](http://klam.space/content/05-github-integration/) where we deployed to Surge on `pre-push` via the Git scripts. Now that we are deploying via CircleCI, we need to adjust our Git scripts accordingly.

Here's what I have now:

```
"git": {
  "scripts": {
    "pre-push": "gatsby build",
    "pre-commit": "npm run format"
  }
},
```

Now, I am building my project before every push to ensure I'm not pushing any failing builds or non-compilable code.

In addition, I am running `npm run format` which runs [prettier](https://prettier.io/) before every commit is made so code styles and formats are cleaned up.

- Case sensitive file system in Linux vs. Case insensitive file system in MacOS

Upon attempting to build within CircleCI, I would always get a weird error of `Can't resolve '../images/Github-Mark-32px.png' in '/home/circleci/project/src/pages'`. After digging around and winding up with nothing in my search, I decided to open an [issue](https://github.com/gatsbyjs/gatsby/issues/22877) for the Gatsby team. Thanks to their helpful guidance, it happened to be an obscure error of case sensitive versus case insensitive file systems in Linux and Mac respectively. Thus, I changed all my image filenames to be lowercased which fixed the problem and unblocked me.


### Challenges I Faced/Potential Errors

I want to give a shoutout to the resources that helped me to accomplish this in the first place. There were hurdles and challenges that I had to overcome to achieve this to be able to write about this for the internet. With that said, here they are:

- Ashley Hebler's Deploying to Surge with CircleCI 2.0 guide on Github: https://github.com/ashley-hebler/circleci-surge
- Surge's own guide to integrating with CircleCI: https://surge.sh/help/integrating-with-circleci
- And of course, the CircleCI 2.0 docs: https://circleci.com/docs/2.0/

Another challenge I had here was really questioning why I needed an executor. As an engineer, I slowly removed pieces of the configuration to see which lines were absolutely necessary and which lines would not break. Well this was one of them below:

Removing the executors in my `config.yml`. Seems like it's necessary to have before moving on.

```
#!/bin/sh -eo pipefail
# ERROR IN CONFIG FILE:
# [#/jobs] 10 schema violations found
# Any string key is allowed as job name.
# 1. [#/jobs/build] 0 subschemas matched instead of one
# |   1. [#/jobs/build] only 1 subschema matches out of 2
# |   |   1. [#/jobs/build] no subschema matched out of the total 2 subschemas
# |   |   |   1. [#/jobs/build] 0 subschemas matched instead of one
# |   |   |   |   1. [#/jobs/build] required key [docker] not found
# |   |   |   |   2. [#/jobs/build] required key [machine] not found
# |   |   |   |   3. [#/jobs/build] required key [macos] not found
# |   |   |   2. [#/jobs/build] required key [executor] not found
# |   |   |   |   A job must have one of `docker`, `machine`, `macos` or `executor` (which can provide docker/machine/macos information).
# |   2. [#/jobs/build] expected type: String, found: Mapping
# |   |   Job may be a string reference to another job
# 2. [#/jobs/deploy-prod] 0 subschemas matched instead of one
# |   1. [#/jobs/deploy-prod] only 1 subschema matches out of 2
# |   |   1. [#/jobs/deploy-prod] no subschema matched out of the total 2 subschemas
# |   |   |   1. [#/jobs/deploy-prod] 0 subschemas matched instead of one
# |   |   |   |   1. [#/jobs/deploy-prod] required key [docker] not found
# |   |   |   |   2. [#/jobs/deploy-prod] required key [machine] not found
# |   |   |   |   3. [#/jobs/deploy-prod] required key [macos] not found
# |   |   |   2. [#/jobs/deploy-prod] required key [executor] not found
# |   |   |   |   A job must have one of `docker`, `machine`, `macos` or `executor` (which can provide docker/machine/macos information).
# |   2. [#/jobs/deploy-prod] expected type: String, found: Mapping
# |   |   Job may be a string reference to another job
#
# -------
# Warning: This configuration was auto-generated to show you the message above.
# Don't rerun this job. Rerunning will have no effect.
false

Exited with code exit status 1
CircleCI received exit code 1
```

### Next Steps

From navigating out of date documentation to searching for similar existing or closed issues to a specific environment like mine, it took a lot of effort to configure my project with CircleCI however it is by no means complete in how I envision it.

My next steps with CircleCI would be to add more jobs of testing(unit testing, integration tests, and even accessibility testing) and linting to the workflows. I also mentioned briefly of eventually having a job that would deploy to a staging environment for testing purposes. In addition, in the far future, there is capability to configure with Docker after I do an exploration dive into Docker and its fun capabilities.

Thanks all and stay healthy! 😷

A complete list of changes can be found [here](https://github.com/klammm/all-things-random/pull/17).