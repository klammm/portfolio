---
title: "Icons, favicons, and accessibile icons"
date: "2021-01-26"
keywords:
- 'favicon'
- 'icon'
- 'noun project'

---

In this post, I will talk about: 

* What's so good about Icons?
* The problem with Icons and Accessibility
* Accessible Icons
* Favicons and Noun Project
* Gatsby Favicon support

### What's so good about Icons?

Icons are wonderful, easy ways to convey action to a user without having any text. A real world example of a good use of icons would be a television remote. Many people are familiar with the play/pause button, the power button, and the volumen button on a television remote. It's been conditioned into people's brains for many years now and it is universally accepted now. 

Another advantage of using icons is maintaining space. On a television remote, if the remote were to list out all of its buttons in plain text, the remote would be too big to hold in an average person's hand. Thus, it loses its usability. Brilliant designers aimed to use small icons instead to keep television remotes small and compact to fit in a person's hand, all the while conveying the information it needs to to its user. 

### The problem with Icons and Accessibility

With the introduction of icons also comes another layer of usability and implied user proficiency. Due to the nature of icons, there's a certain subset of users with impaired vision and/or hearing that have a harder time to decipher an icon's implied functionality. 

Going back to the television remote example, how is a blind person supposed to use a television remote? For another example, how is a blind person supposed to use an iPhone? The answer is with screen reader software that will read aloud each icon. Enter the world of technology accessibility. 

In web accessiblity, there are guidelines and standards for most user interactions on the web. [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) is a set of evolving web standards for creating accessible web content. It follows a version control process. Currently, the latest standard as of 03/04/2021 is [2.2 WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/).

There are also different screen reader software products available. There is the built-in screen reader for macOS called [Voiceover](https://en.wikipedia.org/wiki/VoiceOver), built-in screen reader for Android called [Talkback](https://support.google.com/accessibility/android/answer/6283677?hl=en), [NVDA](https://www.nvaccess.org/) for Windows, and many more. 

Now as you can imagine with the variety of screen reader software and browsers on the web, there are going to be challenges that come up with adhering to a standardized method of accessibility. Some browsers are going to be incompatible with some screen readers, some operating systems are going to be incompatible with some browsers, and vice versa. With all this variety on the web and because the internet is still a relatively new innovation in the history of mankind, there is no uniform method of creating websites. Thus, there is no uniform method of creating accessible icons. There's the most popular way(WCAG guidelines), but there will always be some outliers that either adhere to another set of guidelines or do not adhere at all.

### Accessible Icons

So just how do we create accessible icons then? Here's some steps to creating an accessible icon:

1. Include a Text Label With Your Icon to Prevent Any Ambiguity 

Some icons are universally recognized, but it's always best to play it safe and add a text label along with the icon. Adding a text label also makes the icon more accessible as screen readers will read out the text label with the icon.

2. Limit the Use of Decorative Icons

Icons are usually designed to convey functionality to a user, but occasionally there will be decorative icons used in various ways. Try to limit the use of decorative icons as these icons do not provide any meaningful information to screen reader users. If the icon does provide functionality, aim to provide a text label or an aria-label along with it.

3. Add aria-labels to Icon Buttons with no Text Label

[Aria-labels](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) are HTML string attributes that are used to define a label for the current element it is attached to. A good example of aria-labels used would be for icons without a visible text label e.g. hamburger menu buttons, home icon button, play/pause icon buttons, etc.

4. Be sure that your icons are sized properly

Icons around 40 x 40 pixels is a good standard for the web. Any smaller and it becomes difficult to tap on a mobile device or hard to see. Not everyone has the same finger size.

5. Proper color contrast ratio for icons

[Color contrast](https://webaim.org/articles/contrast/) is vital to accessibility as users need to be able to perceive your web content on the page. If a user does not even notice your icon is there, how are they supposed to click/tap on it? Maintaining the proper color contrast for users to see your content is key to creating an accessible icon. The contrast is between the color of the icon to the page background.  

__Honorable Mention__: Use SVG or PNG file format for your icons. 

### Favicons

Favicons are icons used for websites, tabs, URLs, or web bookmarks. Browsers then use favicons to show the icon on a browser tab or a browser bookmark. Favicons are used to provide a sense of identity to a website, strengthen a certain website's brand, or for pure stylistic reasons.

As a developer, I want to focus my time on creating more features than designing icons, thus I turn to the [Noun Project](https://thenounproject.com/) for free icons for all of my needs. It's all completely free and has a boatload of icons ready to go and use on your website. 
### Gatsby Favicon Support

Gatsby has a plugin used for easy favicon support. We'll be using the [`gatsby-plugin-manifest`](https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/). This plugin is used as part of PWA specifications, but we'll be using it for its favicon support. 

Just simply install the plugin: `npm install gatsby-plugin-manifest` and add the plugin into the `gatsby-config.js` file. It should look something like this:

```
{
  resolve: `gatsby-plugin-manifest`,
  options: {
    // ...options
    icon: "src/path/to/icons/my-icon.png",
  },
},
```

Once you have that, your favicon should be rendering on your browser and ta-da! You have a new favicon!
