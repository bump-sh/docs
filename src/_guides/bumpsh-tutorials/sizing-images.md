---
title: Perfectly sizing images in your API documentation
authors: valeriane
tags: [API Documentation Design]
image: guides/sizing-images-api-documentation.png
---

Images are cool and they should be everywhere in your API doc. End of this blog post, thanks everyone!

Well, more seriously, many people, obviously including me, love a nice visual, especially when it comes to learning something new like, let’s say… how to use a new API. Bump.sh always supported the ability to add images in the markdown of your API documentation and has now extended it with the ability of sizing to your needs.

Whether you want to have your API documentation more lively to your users with gifs, share your [API diagrams](https://bump.sh/blog/api-architecture-diagrams), illustrate complex API behaviors (like [polymorphism](https://bump.sh/blog/use-document-polymorphism-API)) with a nice visual, and you have an API Contract based on [OpenAPI](https://bump.sh/blog/what-is-openapi) or [AsyncAPI](https://bump.sh/blog/what-is-asyncapi), you can now make sure the images in your API documentation renders in the size you’d prefer them to.

## How Bump.sh renders images by default

Usually, in markdown, you would use this syntax to add an image
```markdown
![Alt text](/path/to/image.jpg "Image title")
```

By default Bump.sh lets the browser decide how it will display the generated html `<img src="image.url">`. For instance if the image is in a table cell, it will be limited to the size of the table cell, if in a paragraph, it will use the default image size.

However, you can now decide on the image size yourself.

## How to customize the image size in your API documentation

Now you can take it a step even further into the personalisation with a `=dimension` parameter that lets you manually decide how your image should be displayed in your documentation.

`=dimension` just extends the well known Markdown syntax by allowing you to give extra dimension information before the closing parenthesis
```markdown
![Alt text](/path/to/image.jpg "Image title" =dimension)
```

As an example, if you wanted to display an image of 100 pixels height and 50 pixels width you could write
```markdown
![Alt text](/path/to/image.jpg "Image title" =100pxx50px)
```

`=dimension` uses the following syntax `=[width][unit]x[height][unit]` and is itself completely optional as well as almost all its parameters: just `width` *or* `x` + `height` are mandatory. If you don't specify `width` *or* `height`, the other value will be a ratio calculated from the original size of the image so it doesn't shrink.

Telling this might be confusing so here are a few examples to better understand what you can do with this `=dimension` parameter:

Let’s take this SpongeBob plushie picture. See how it renders by default:

![SpongeBob plushie image in a Bump.sh documentation](/images/guides/sizing-images-1.png)

And now let’s play around with the `=dimension` parameter!

```
=100pxx50px   # with everything
=100x50   	# without unit
```

![SpongeBob plushie image in a Bump.sh documentation with 150 x 50 px sizing](/images/guides/sizing-images-2.png)

```
=100      	# without height (x separator not needed) and unit
=100px    	# without height
```

![SpongeBob plushie image in a Bump.sh documentation with 100px sizing](/images/guides/sizing-images-3.png)

```
=x50      	# without width and unit
=x50px    	# without width
```

![SpongeBob plushie image in a Bump.sh documentation with 100px sizing](/images/guides/sizing-images-4.png)

Note that not specifying an unit will fall back to pixel.

It also supports all CSS length units, so you can work with `px` for pixel, `%`, or any other absolute or relative unit you are used to.

Same image as above with `=dimension`set to `=200cm`:
![SpongeBob plushie image in a Bump.sh documentation with 200cm sizing](/images/guides/sizing-images-5.png)


Always make sure how the property you use is handled by different browsers as it may differ.

You can find an extended description of the behavior of this new image sizing feature [in the documentation](https://docs.bump.sh/help/specifications-support/markdown-support/#image-sizing).

## Trying with your own API documentation

Bump.sh lets you preview how your documentation would look like by simply uploading your API Contract in the preview tool.

<!-- add-preview-bloc -->

You can also preview how your images will render while editing your API contract or in your tests using the [Bump.sh CLI](https://github.com/bump-sh/cli) with the command

```bash
npm install -g bump-cli   ## installs bump.sh cli

bump preview --live --open openapi-definition.json
```

Option `--open` will open the preview in your default browser, and `--live` will automatically update the preview in your browser upon saving edits in the file.

And do you know what’s best? You don’t even need a [Bump.sh account](https://bump.sh/users/sign_up?utm_source=bump&utm_medium=blog&utm_campaign=perfectly-sizing-images-blog) to use our preview, so enjoy playing around with images to see how your API documentation could render with perfectly sized images 🖼️!

## Conclusion

Images are cool and they should be everywhere in your API doc.

![Images Everywhere meme](/images/guides/sizing-images-6.png)
