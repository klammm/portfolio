---
title: "Search Engine Optimization(SEO): Keywords"
date: "2020-02-11"
keywords:
- 'keywords'
- 'seo'
- 'search'
- 'engine'
- 'optimization'
- 'search engine optimization'
- 'frontmatter'
- 'google'
- 'web traffic'
- 'traffic'
- 'popularity'
- 'listing'
- 'search results'
- 'internet'
- 'audience'
- 'react helmet'
- 'head'
- 'title'
- 'tags'
- 'react-helmet'
- 'meta'
- 'metadata'
- 'constants'
- 'query'
---

In this post, I will talk about:
* Search Engines
* Keywords. What are they? What do they do?
* What did I do?
* Gatsby + SEO
* Next Steps

Welcome to the first series of me making my website SEO-friendly.

### Search Engines

First off, [Search engines](https://en.wikipedia.org/wiki/Web_search_engine). What are they? They are the internet's librarians. Search engines sift through all of the pages, websites, documents, etc to find what someone's looking for. The most famous and successful to date search engine is [Google](https://en.wikipedia.org/wiki/Google_Search).


You probably found this website via Google and if I did this right, you should have found this blog post via Google. I might have been the first, third, or even the twenty-fifth listing from Google's search results. So how can I or anyone, for that matter, be that coveted first listing from Google's search results?

We do so by optimizing our website for Google's search engine to easily pick up our website out of all the websites on the internet. Search Engine Optimization(abbreviated and otherwise known as SEO) is a technique mainly used throughout the internet to improve a website's traffic. In short, it'll make your site popular. Popularity means more growth and reaching a wider audience. For a new, budding website like mine, that's [yuuuuge](https://www.youtube.com/watch?v=EEA33bAXyNM).

### Keywords. What are they? What do they do?

__TLDR__: [Keywords](https://en.wikipedia.org/wiki/Meta_element#The_keywords_attribute) are `<meta>` HTML attributes used by search engines.

Before we understand how important keywords are, we must understand the [HTML `<meta>` tag](https://en.wikipedia.org/wiki/Meta_element) first. Within the context of the internet, metadata is data about the webpage itself located in the `<head>` section. It provides useful information—not provided by the other header elements—that is consumed by browsers, search engines,

How I like to think of the meta-keywords relationship is "Meta is to keywords is similar with a div to a class, where meta and divs are [HTML __elements__](https://en.wikipedia.org/wiki/HTML_element) while keywords and classes are [HTML __attributes__](https://en.wikipedia.org/wiki/HTML_attribute). Now that we have a base understanding of this element-attribute relationship. Let's dive into keywords!



### What did I do?

__TLDR__: I added unique keywords for each blog post via [frontmatter](https://jekyllrb.com/docs/front-matter/) queried through GraphQL. Here's the [pull request with all the changes I made](https://github.com/klammm/all-things-random/pull/12).

Before I move onto the steps I did to achieve better SEO, let's first understand the problem. I have a list of blog posts that are unique which therefore means that each blog post must contain their own unique keywords.

__First__: I separate out shared SEO keywords and page-specific keywords into their own respective constants file and also create a new `constants` directory. The main reasoning for separating out shared SEO keywords and page-specific keywords is to better organize and distinguish which constants serve what purpose.

`src/constants/api.js`
```
export default {
  REDDIT_URL: "https://www.reddit.com/r/dankmemes/.json?&show=all&limit=1",
}
```

[source](https://github.com/klammm/all-things-random/pull/12/files#diff-5470ab88cb8ef8d7f95562d1ba9d47d1)

Here in this case, I am defining my constants in an object so I may add more API url's in the future.

__Second__: Next, I import these newly created constants into wherever it is to be used.

`src/constants/index.js`
```
export { default as SEO_KEYWORDS } from './seo'
export { default as API } from './api'

```

[source](https://github.com/klammm/all-things-random/pull/12/files#diff-bc152a022be0db29b061aedc08d80a45)

Here, I am creating an `index.js` file to follow the [Node.js "Folders as Modules" convention](https://nodejs.org/api/modules.html#modules_folders_as_modules). That way for future development, I am not forced to remember the file name and I can always `import X from src/constants`.

Now within the code itself, I am importing and exporting all within the same line. It's really just some ES6 syntactic sugar and makes for cleaner, more readable code.

__Third__: Now that I've got my SEO constants defined. It's time for me to define unique SEO keywords for each unique blog post. Hey Kevin, how can I do that if we're templating each blog post? [Have no fear, I am here.](https://www.youtube.com/watch?v=_DIHg5xMWAo).

We are already setting unique data for each blog post via frontmatter. It should be possible to also include extra unique data. So what we want is to now set custom variables within frontmatter for our template to consume.

`src/content/07-seo-keywords.md`
```
---
title: "Search Engine Optimization(SEO): Keywords"
date: "2020-02-11"
keywords:
- 'foo'
- 'bar'
- 'foobar'
---
```

[source](https://github.com/klammm/all-things-random/pull/12/files#diff-7f8a74649348757434a193058194edb8)

Within our frontmatter data, we will have a `keywords` property that returns an array of the strings we defined `['foo', 'bar', 'foobar']`.

__Fourth__: Now that there's a custom `keywords` property on the `frontmatter` object. All we have to do is adjust our GraphQL query to include that change.

`src/templates/blog-post.js`
```
export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        keywords
      }
      wordCount {
        words
      }
      timeToRead
    }
  }
`
```

[source](https://github.com/klammm/all-things-random/pull/12/files#diff-b334c7299860c69226f3d8a8f4a36c1fR37)

Here, we add `keywords` within the frontmatter query. Now, the keywords data is flowing from each blog posts's frontmatter and into the GraphQL query to be consumed by the template.

__Fifth__: Now that our data flow is working fine. Let's set the component to be able to consume this data.

`src/templates/blog-post.js`
```
const seo_keywords = post.frontmatter.keywords || [];

return (
  <Layout>
    <SEO title={post.frontmatter.title} keywords={[...SEO_KEYWORDS.TECH, ...seo_keywords]} />
    ...
  </Layout>
)
```

[source](https://github.com/klammm/all-things-random/pull/12/files#diff-b334c7299860c69226f3d8a8f4a36c1fR13-R17)

Here, I am retrieving the `keywords` property from the `post.frontmatter` object and I default to an empty array to avoid any potential syntax errors. This is a simple type check to prevent from calling unwanted operators or invoking native function calls on the wrong data type. So in this case, I do not want to use the spread operator on `undefined` values.

Next, I take my shared keywords from the `SEO_KEYWORDS` constant that we helped to define in Step 1 and combine it with the `seo_keywords` custom frontmatter variable to form one array of keywords to send to [Gatsby's SEO component](https://github.com/klammm/all-things-random/blob/master/src/components/seo.js).

### Gatsby + SEO

__TLDR__: Check out this [SEO component](https://github.com/klammm/all-things-random/blob/master/src/components/seo.js) that Gatsby includes for new Gatsby projects. It's built on top of [react-helmet](https://github.com/nfl/react-helmet).

Something nice that Gatsby includes when creating a new Gatsby project using the `gatsby new` command is including an [SEO component](https://github.com/klammm/all-things-random/blob/master/src/components/seo.js). Here in this component, there is a [static GraphQL query](https://www.gatsbyjs.org/docs/static-vs-normal-queries/) that is querying for metadata. Next, the component is mapping its prop data with their respective props in the `<Helmet>` component.

Overall, it is a good starter to having SEO for any sites being generated through Gatsby. It's not complete by any means, however it's a valuable starting point that Gatsby provides for its developer experience.

### Next Steps

- leverage more of Gatsby's SEO component to include a description, lang, meta, and title

In the future, we will leverage more of Gatsby's SEO component to include more of the props it is already expecting such as `description`, `lang`, `meta`, and `title`. These are all attributes that can be added as meta elements, except for the `meta` prop which concatenates extra meta elements that might have been pre-defined.

A complete list of changes can be found [here](https://github.com/klammm/all-things-random/pull/12).