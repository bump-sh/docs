---
title: The Social Life of Git
authors: [pxQuim]
excerpt: The daily use of Git produces emergent properties that are not immediately obvious. It’s all about you being social through Git.
---

We are shaped by the tools we use, often in unexpected and surprising ways.
Tools shape our work by making some things possible or easier,
while making other things difficult or impossible.

The previous article introduced the [Primitive Concepts of Git](/guides/technical-writing/primitive-concepts-git/),
but the daily use of Git produces emergent properties that are not immediately obvious,
especially in larger teams:

- Safety net,
  because you can easily recall past deliveries.
- Alternate futures,
  because you can switch among work-streams easily.
- Elaborate storytelling,
  because you can slice or combine changes for the best effect.
- Single source of truth,
  because you know where to find the latest everything.
- Radical transparency across space and time,
  because you can see what they did, and they can see what you did.
- Collaboration without trust,
  because you can interact in ways that build trust over time.

Each of these emergent properties improves how you work,
but the compound effect of these properties is nothing short of revolutionary.
Let’s explore each of these emergent properties in more detail.

## Safety net

When I started to work with a good control system,
Subversion at the time,
it eventually dawned on me that I felt safer.
When working on a document (topic-based writing would come a few years later),
it was not uncommon to start changing a document and, later,
to have second thoughts about parts of the change.
The ability to easily compare the current incomplete work with what existed before,
without the need for any special planning,
and then roll back parts of the changes before continuing to work in a different direction,
was liberating.

Working with a source control system such as Git feels like working with a safety net.

The feeling of safety extends to the whole team.
For example, we used to document two graphical applications that configured comparable services,
and that had similar sets of windows.
Once I discovered with horror that
the documentation for one of the applications had the screenshots of the other!
Source control helped as follows:

1. I used the history of the source control system to discover that
   the screenshots had been replaced a few months ago by a colleague.
   Basically, the colleague had dropped the screenshots in the wrong directory.
2. I moved the screenshots to the correct directory,
   where they should have been all along,
   and I restored the overridden screenshots from the history.
3. I republished the documentation set, addressing the needs of customers.
4. Only after solving the issue did I approach the colleague, with a smile in my lips:
   "Hey, you did a mistake a 105 days ago, at 16h25. It's fixed now. Do you wanna hear the story?"

Without source control,
we would have needed to set up specific hardware and software in a lab,
before recapturing the screenshots.
This would have been, at the very least, a costly annoyance.

## Alternate futures

In Git it is easy to create a branch and explore how something might work.
At any time, you can switch to another branch and continue with some "proper" work,
such as addressing an issue in published work.

If the experimental work seems interesting enough,
you can share the branch with colleagues,
who can review or improve upon your work,
starting a collaborative effort.
As the work gets acceptance,
the team can merge the changes or pick up parts for official delivery,
at a time that is suitable for publication.

The situation where I often felt the need to experiment was with our custom tools.
These were homegrown tools, often barely good enough for the work at hand.
When I felt the need to address a limitation or explore a possibility,
I would experiment with a variation of the tool until I deemed the variation good enough for daily use,
or until I abandoned it because it had unintended consequences.

Git branches enabled me to easily switch between experimental tools or official tools,
depending on the needs.

## Elaborate storytelling

After working on a deliverable for some time, you may have made different types of changes.
To have your work reviewed and accepted,
it is often best to make the work of reviewers easier
by telling a story that is easier to understand.
The best practice is to isolate changes in separate commits (or separate pull requests),
such that each part can be reviewed separately,
possibly by different people. 

When working on something,
you may go through several iterations to get it right.
Commit histories give you the ability to tell a story of what happened.
Rebase gives you the ability to rewrite history or to maintain alternate histories.
In a sense, the winners write the history.

- Sometimes, you want to remember every iteration.
  For example, you may want to remember what changed
  for each objection of a customer or for every ticket solved.
- At other times, you just want to remember the final deliverable.
  For example, you might prefer to forget intermediate stages with embarrassing mistakes.
- And you might even want both stories.
  For example, a finely detailed story of every change for the team,
  and a coarse story suitable for customers.

## Single source of truth

Teams establish conventions of where to find specific work in Git.
By default, the latest release is in the branch main,
but teams can establish their own conventions
to cover multiple variants or multiple versions.

You don't have to ask where things are.
If the team has conventions for new work,
no one has to ask where is the ongoing work of each other.

For example, I have used Git to track versions 7 and 8 of the same product,
the corresponding training materials,
and localized variants in five languages.
Everyone in the team knew where was the latest release of everything,
together with the corresponding release histories.

## Radical transparency across space and time

Everyone with access to a Git repository can easily find the latest work,
discover ongoing work, explore experiments,
and see the history and the relations among all of them.
And, furthermore, who delivered what and when.

This means that everyone can make their own mind about what happened in the past,
about the progress being delivered, or about the relative merit of experiments.
This radical transparency has a deep impact on accountability and on work relations.

- It makes the contributions of people clear,
  which supports remote work across time zones.
- It makes the progress of teams clear,
  which supports asynchronous collaboration across diverse people.
- It identifies people involved in changes,
  when someone else is troubleshooting some unexpected issue months or years later.
- It helps to understand the motivations behind problematic changes,
  by understanding what other work was done at the same time.

When I documented a set of APIs that were being created by hundreds of engineers,
I often found places where documentation was lacking or even absent.
It was impossible to review and contribute to every merge request.
What I could do was to give some attention to each API every couple of months or so.

- Git was the source of truth that remembered the history of each part of the API.
  After identifying who had made the last significant changes to the files involved,
  I could try reach out to them and collect the missing information.

- Eventually, I learned to identify major pull requests that pointed to further design documents.
  I could often gather enough context and detail to complete most of the missing documentation,
  and follow-up any questions with the designers of the change.

## Collaboration even without trust

New-joiners that cannot be trusted to deliver quality work can work in isolated branches.
If new-joiners use pull requests to ask for reviews,
others can comment and argue about the work,
line-by-line if needed.
After work is reviewed by trusted people,
the good parts can be merged and delivered,
or the work can be refactored and improved under the guidance of trusted people,
serving as a way to mentor new-joiners in the ways of the team and the peculiarities of the work.

You can even collaborate effectively with people you never met and that do not belong to your organization.
They just fork your repository,
work on their own pace and with their own methods,
and submit pull requests for your consideration,
that you may have no obligation to accept.
This is the basis for collaboration in large open source projects such as the Linux Kernel.

Even within an organization, some changes are more controversial than others.
You may trust yourself to do simple changes, but welcome the review of complex changes,
and you may also wish others in your team to know about those changes.
Platforms such as GitHub and GitLab support different ways to deliver your work:

- For simple work,
  just commit to the main branch.

- For complex work,
  open a pull request, and have others review and approve the change.

- For early feedback on complex work,
  open a WIP pull request for unfinished work,
  at a time when your approach is already visible.
  WIP stands for work-in-progress.
  Others can review your approach and argue for improvements,
  providing feedback at the earlier stages of your effort.

- For an intermediate case, open a pull request and approve it yourself.
  This approved pull request still communicates your changes to others,
  and it can capture comments from others about the change.
  If needed, you may revert or amend your change later.

When I documented APIs by adding comments to C# code,
developers had me to work through a fork,
meaning they did not trust me at all.
Truth be said, they did the same to other developers that needed to contribute to that code.
The best I could do was to separate changes into simple (trivial review needed) and harder
(the reviewer needed to actually engage their head to ensure the documentation said the right things).
The trivial changes would be approved immediately,
while the harder changes might lead to some arguing and refinement before being approved.

## What next?

Don’t think of Git as a mindless tool or as a bureaucratic annoyance.
Instead, learn to appreciate how Git changes the ways you can work with others,
and especially how radical transparency fosters trust and explicit communication.
Git empowers you to collaborate across space and time,
possibly with people that initially don’t trust each other,
but providing the clear communication and accountability that builds trust over time.

[Did I tell you](/guides/technical-writing/primitive-concepts-git/) that Git is one of those tools that takes minutes to learn and a lifetime to master?

- The long study
  [Patterns for Managing Source Code Branches](https://martinfowler.com/articles/branching-patterns.html)
  by Martin Fowler is an excellent reference
  for the different ways teams can use branches to manage their work.
- The article [Ship/Show/Ask](https://martinfowler.com/articles/ship-show-ask.html) by Rouan Wilsenach
  adds detail to the choice between commit and pull request.

It’s not about Git.
It’s about you being social through Git.
I can only wish Git will empower you to do your best collaborative work ever.
