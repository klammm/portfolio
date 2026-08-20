---
title: "Deploying with Surge"
date: "2020-01-22"
keywords:
- 'deployment'
- 'continuous deployment'
- 'CI/CD'
- 'surge'
- 'development lifecycle'
- 'lifecycle'
- 'abstraction'
- 'system network'
- 'architecture'
- 'CLI'
- 'command line interface'
- 'npm'
- 'yarn'
- 'authentication'
- 'domain'
- 'custom'
- 'website'
- 'bundle'
---

In this post, I will talk about:

* Deployments
* Deploying with Surge

### Deployment

__TLDR__: Deployment is not trivial and I struggle with it.

During my time learning about web development and programming in general, one topic that was always saved for the end of the course was [deployment](https://en.wikipedia.org/wiki/Software_deployment). Deployment was one aspect of the software development lifecycle that I was uncomfortable with not having granular control over. It may even feel like a lot has been abstracted away from us now. The topic of deployment still somewhat haunts me to this day, which is why I'm finally writing about it.

Not all engineers truly understand deployment, and those savvy enough to understand it know that it comes down to _simple_ system network architecture. Keyword here being: _simple_. It definitely was not _simple_ enough for me to understand the first time around.
Anyways, so what magic needs to happen to deploy your web app that you've—_I've really_—spent all your blood, sweat, tears, and stress over?

I'm not really going to explain the in-depth details of deployment because as Wikipedia puts it, "Because every software system is unique, the precise processes or procedures within each activity can hardly be defined. Therefore, 'deployment' should be interpreted as a general process that has to be customized according to specific requirements or characteristics."

So to put it in __ELI5__(Explain Like I'm 5) circumstances, each system is unique that we can't give deployment a blanket definition. I wouldn't end this post with a cliffhanger like that so I'll just talk about my experience with using Surge to deploy.

### Deploying with Surge

__TLDR__: I deployed my Gatsby app by following the [Gatsby-Surge docs](https://www.gatsbyjs.org/docs/deploying-to-surge/) and the [Official Surge docs](https://surge.sh/)

I chose Surge simply because the service was free and very easy to use and get going for simple single page applications.

__First__: I deployed with Surge using their CLI tool which I quickly npm installed with `npm install -g surge`.

__Second__: We're going to have to build our production-ready JS and CSS bundle. To do that, I ran a gatsby command in the terminal: `gatsby build`. After this command, all our assets and bundles are ready in the `public/` directory. Some common directory names I've seen are either `dist`, `public`, or `build`.

__Third__: With my newly installed CLI tool, typing `surge` into my terminal will execute the deploy tool. I also made sure I was in the `public/` path of my project directory since `public/` contained all of my JS and CSS bundles. I could have also done `surge public/` to deploy the specific parts of my project that I wanted. In this case, it was the bundled JS/CSS that I had already built.

__Fourth__: Follow the surge prompts directed in your terminal. The first step will most likely be to login or create an account.

__Fifth__: After the authentication process, continue to follow the prompt by using the ENTER key and voila! The site is now live given the domain name that Surge provides for you. That was my process in deploying my site with Surge. That's it and it's very painless.

__Bonus__: If you have a custom domain name, you can enter it in the domain part of the prompt or create a `CNAME` file in your project with the contents being your custom domain like [this](https://github.com/klammm/all-things-random/blob/master/CNAME) so we don't have to enter in our custom domain every time we want to deploy using Surge.

In addition, I bought and registered my custom domain name on [Namecheap](https://www.namecheap.com/). You can buy and register custom domains on other sites like [GoDaddy](https://www.godaddy.com/) or these 2 other sites([Sedo](https://sedo.com/us/) and [Efty](https://www.efty.com/)) that popped up first on my lazy Google search.

### Conclusion

And that's it! Surge is an incredibly easy tool to get started with and it assumes you have no other deployment configurations you need to add on to just get your website deployed and live in a matter of minutes. Oh and last but not least, it's free 😉

A complete list of changes can be found [here](https://github.com/klammm/all-things-random/pull/7).