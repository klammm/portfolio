---
title: "Google Analytics with Gatsby.js"
date: "2020-12-15"
keywords:
- 'Google Analytics'
- 'analytics'
- 'metrics'
- 'tagging'
- 'google'
- 'realtime'
- 'streams'

---

In this post, I will talk about:

* Why you should care about Analytics
* Google Analytics
* How to Integrate Google Analyics with Gatsby
* Conclusion

### Why you should care about Analytics

What exactly are analytics and how does it affect my web application(s)? Why should I even care?

[Analytics](https://en.wikipedia.org/wiki/Analytics) is, essentially, the skill — and perhaps an art form in some perspectives — of analyzing data. Analysts discover meaningful insights and patterns that can only be viewed with a certain meta perspective that can be seen through analyzing large amounts of data. These insights and patterns can then lead to more efficient decision making which then leads to effective strategies. 

Within our realm of the internet, we primarily care about [Web Analytics](https://en.wikipedia.org/wiki/Web_analytics) for our web applications. Web Analytics helps us to understand, measure, and analyze web traffic flowing through our application. We can get a better idea of who is browsing through our websites, what pages they are browsing, and also understand how effective and efficient our web applications are at serving the user. Using these insights, we are able to better prioritize on either improving application performance, building new features, producing more content, or just do nothing and allow time for things to play out. 

### Google Analytics

Enter [Google Analytics](https://marketingplatform.google.com/about/analytics/). I chose Google Analytics because Google has a _pretty_ good track record of building good products for the web. So I thought to myself these points on choosing Google Analytics: 

1. Google, as a company, is staying for the long haul and will be around for maintenance and support. I hope 🤞
2. I like the clean and intuitive UI that Google presents. I'm a Material UI fanboy, what can I say? 
3. The price came out to __$FREE.99__.
4. It was built for business use so it has a high ceiling to scale. 

Some cons that I did notice so far were:

1. It was very overwhelming.
2. I didn't know how to get started for the longest time.
3. I still don't know what's going on.
4. It feels like overkill if you wanted to just do one thing. You got the whole pizza if all you wanted was just a slice. 

### How to Integrate Google Analyics with Gatsby

So as you can imagine by now with most things in Gatsby, there's probably a plugin for it. Neat! 

Here's the [Google Analytics Gatsby plugin](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/).

First thing you want to do is create a Google Analytics account and go through the steps of naming your account and website property names. Don't worry these can be changed later. 

Next, you can navigate to the `Admin settings` > `Data Streams` > Your Website > `Measurement ID`. Go ahead and copy the `Measurement ID`. Google will use this ID to track your website.

Now, we just need to provide the Google Analytics Gatsby plugin this tracking ID and that's it. 

Recall in the [last post](http://klam.space/content/11-dotenv-circleci/) that we created our `.env` file so this is a perfect opportunity for us to add our tracking ID to the `.env` file along with any other API keys or secrets you may have in there. 

```
# .env.development

GA_TRACKING_ID=<YOUR GOOGLE ANALYTICS TRACKING ID>
```

So now we'll add the actual plugin into the `gatsby-config.js` file:

```
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: [process.env.GA_TRACKING_ID],
      },
    },
    // ... other plugins
  ],
  // ... other options
};

```

Since I'm building my production app with CircleCI 2.0, I'm going to also add an environment variable through their platform for production environment variables. For more info on how to do that, see my [last blog post](http://klam.space/content/11-dotenv-circleci/). 

Now that you've wired up Google Analytics with your Gatsby app, go ahead and deploy it and test it out in production. Visit your website and then navigate to your Google Analytics dashboard on another tab. You should see "Realtime" on the side menu. Go ahead and check out the Realtime dashboard and you should see at least 1 new user since you just visited your website. 

And there you have it! Google Analytics is now tracking and measuring your website!

### Conclusion

In time, we'll be able to understand how our web application is performing on the web and how much web traffic we have. Next, we'll add more streams and be able to track more insightful data in Google Analytics. We can also make custom charts to track custom metrics that we design ourselves based on our priorities. Cool huh? Did I mention yet that it's free?!

Check out the full set of changes here: https://github.com/klammm/all-things-random/pull/22. 