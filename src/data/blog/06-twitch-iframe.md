---
title: "First steps of placing a live Twitch stream on a website"
date: "2020-02-03"
keywords:
- 'pokemon'
- 'gameboy'
- 'interactive'
- 'iframe'
- 'custom html'
- 'twitch developer'
- 'guide'
- 'parameters'
- 'client id'
- 'OAuth token'
- 'token'
- 'product'
---

In this post, I will talk about:
* Adding the Twitch stream
* What I hope to add in the future

So as far as you all know, I haven't really talked about any of my hobbies or what I like to do outside of writing or tech. Well I'll have you all know I'm a [pretty fun guy](https://www.ctvnews.ca/polopoly_fs/1.4106952.1537806593!/httpImage/image.jpg_gen/derivatives/landscape_1020/image.jpg). Ever since I was a child, I enjoyed video games. My first-ever video game was Pokemon Red with the Gameboy Color. What I enjoy about video games is being able to see your progress in a very helpful visual way in a world where progress isn't that easy to see.

As I grew older, video games started becoming more competitive. I wanted to outplay my opponents and read their every move. This is where my love for gaming grew where I didn't think was possible. For me, outclassing your opponent almost became an art form per se. So that's my love for gaming. With that said, I was able to place my [Twitch stream](https://www.twitch.tv/smokymcbear) onto this Gatsby blog for all you _lucky_ people to see.

### Adding the Twitch stream

__TLDR__: I placed a [non-interactive iframe](https://dev.twitch.tv/docs/embed/video-and-clips#non-interactive-inline-frames-for-live-streams-and-vods) following the Twitch docs.

So for the purposes of having my live Twitch stream up, I sought to go the fastest and easiest route of embedding the live Twitch stream. After some intimidation with [adding custom html to Gatsby](https://www.gatsbyjs.org/docs/custom-html/), I sought to instead go even easier to which I found I can simply have an iframe with the Twitch player, given that a lot of functionality is stripped away and the iframe itself is non-interactive, but hey! You can see me playing World of Warcraft!

__First__: I sought to create a new page with Gatsby to host the twitch stream so I wouldn't have to do any styling to place it in the layout. Here's a snippet of the new page:

```
import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

const TwitchPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    { <-----New content here ------>}
  </Layout>
);

export default TwitchPage
```

__Second__: Following the Twitch Developer guide, I placed the iframe into the new page. So I added this snippet within the `{ <-----New content here ------>}` line in the snippet above:

```
<iframe
  src="https://player.twitch.tv/?channel=smokymcbear"
  height="720"
  width="880"
  frameborder="0"
  scrolling="no"
  allowfullscreen="true">
</iframe>
```

Here, I'm sourcing it to my twitch channel, setting the height to be 720px, the width to be 880px, and setting more parameters.

That's it!

### What I hope to add in the future

After taking a look into the [Twitch API](https://dev.twitch.tv/docs/api), I realized that my application has no capability to [store a client id or an OAuth token anywhere](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/). For me to use the Twitch API or any API in the future, I would need to store this sensitive information on an [environment variable](https://hackernoon.com/how-to-use-environment-variables-keep-your-secret-keys-safe-secure-8b1a7877d69c). My details on this implementation will come in a future post.

For now, this iframe satisfies my initial goal of placing my Twitch stream on this website for all you beautiful people to watch.

Here's the finished [product](http://klam.space/twitch). I hope you enjoy watching me play video games!

A complete list of changes can be found [here](https://github.com/klammm/all-things-random/pull/11).