---
title: Improve Your API with User Feedback
authors: phil
excerpt: Make your API better by listening to the people who use it probably more than you do.
date: 2024-10-31
---

Gathering user feedback is essential to improving your API and ensuring it meets users' needs. With Bump.sh, you can integrate feedback forms directly into your OpenAPI documentation by embedding a link to a form using [`x-feedbackLink` extension](/help/publish-documentation/feedback/). 

This guide will show you how to set up a feedback form using Google Forms or Typeform and embed it seamlessly into your API documentation.

## Step 1: Create Your Feedback Form

First, choose your preferred form tool—either Google Forms or Typeform. Both options are excellent, but here’s a quick overview:

- **Google Forms** is free, simple, and perfect for straightforward surveys.
- **Typeform** offers a more visually engaging experience and may work better if you want an interactive form with a modern look.
- **Notion** has a new Form builder, and seeing as loads of people already run their whole life through Notion, this might be the easiest option for many.

Once you’ve chosen a tool:

- **For Google Forms**: Go to [Google Forms](https://forms.google.com), and either start from a blank form or choose a template. Create questions to capture feedback on your API, like user satisfaction, feature requests, or any issues they’ve encountered.
- **For Typeform**: Head to [Typeform](https://typeform.com), log in, and click "Create a typeform." Set up your questions, keeping them focused on the feedback you need to improve your API.
- **For Notion**: Go to [Notion](https://www.notion.so), and once you have a workspace, add a New Page somewhere, and look for the "Form" option under "Getting started..."

The tools all have a different form building, but the Notion builder should look like this.

![A few text boxes with questions asking "What are we doing well?", "What would you like to see improved?", and "Email"](/images/guides/feedback/notion-form-builder.png)

- **In Google Forms**: Click the “Send” button, select the link icon, and copy the link (something like `https://forms.gle/XYZ`).
- **In Typeform**: Click "Share" at the top, then copy the link (typically `https://yourformname.typeform.com/to/XYZ`).
- **In Notion**: Click "Share Form", then copy the link (`https://www.notion.so/bumpsh/XYZ`)

![The "Share form" button has been activated, opening a URL box with a "Copy link" next to it](/images/guides/feedback/notion-send-form.png)

Now that you have the link to your form, we can add it to your API documentation.

## Step 2: Embed the Feedback Form Link Using `x-feedbackLink`

With your form link copied, open your OpenAPI document (usually `openapi.yaml` or `openapi.json`). 

Add the `x-feedbackLink` property under the `info` section and paste in your feedback form link, using this example OpenAPI 

Here’s an example of what this might look like in your OpenAPI YAML file:

```yaml
# openapi.yaml

openapi: 3.1.0
info:
  title: Your Amazing API
  version: 1.0.0
  description: "API documentation with integrated feedback form"
  x-feedbackLink:
    label: Give feedback
    url: "https://www.notion.so/bumpsh/133539284334765834653324" 
paths:
  # ...
```

Click save, then deploy Bump.sh API Documentation again however you normally deploy it: CLI, CI, API, or manually through the website.

## Step 3: Check the Feedback Link in API Documentation

Now, go to your API documentation on Bump.sh to confirm the feedback form is embedded correctly. You should see a “Give feedback” link up at the top of the API documentation, or it will use whatever other text you provided in `label`.

![Screenshot of an example API Documentation on Bump.sh, with the Give feedback button highlighted at the top right of the screen.](/images/help/feedback-button.png)

When you click that the form you set up should appear. Then you can send a test submission, to make sure it works as expected. When you do this it's best to do it in a private window to flush out any odd permissions issues, because you want to emulate an end-user, and they won't be logged in to the form builder software either.

## Tips for Effective Feedback Collection

**Keep it short and focused**

A short form is more likely to get responses, so focus on key questions:

- "What are we doing well?" - Textbox
- "What do we need to improve?" - Textbox
- "How would you rate your experience with this API?" Checkbox/Slider 1-5

Contact details should be optional, because sometimes people want to let you know things are terrible without having their name attached, and sometimes that's valid. You can always make it required later if malicious users are abusing the system.

**Review responses regularly**

Regularly check responses to understand user needs and make timely improvements. If something is broken you might only hear about it from one user, but there are likely 10-100 users who didn't take the time to provide feedback. That one user who did is valuable, and you should show them that with a quick response, and a quick fix.
