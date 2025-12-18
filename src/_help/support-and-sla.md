---
title: Support and Service Level Agreement (SLA)
---

- TOC
{:toc}

## Support

We believe in human interactions. Support is ensured only by the Bump.sh team, not by any chatbot. 

You can at anytime reach out to us via [support@bump.sh](mailto:hello@bump.sh), or via the chat icon which may appear at the bottom right hand side of some of the screens (mostly on our marketing site, the product documentation pages, and your administration dashboard - never on user-facing documentation pages).

We take pride in offering exceptional support to any of our users, no matter which plan they're on.

## Service Level Agreement

As we understand the importance of having docs always up-and-running, available for your users to understand and adopt your APIs, we put all reasonable efforts in maintaining an above 99.9% availability.

For our Custom subscription customers, we commit to that level. If we fall short, we can grant service credits. The credit is based on how much availability dropped below the target and gets applied to a future invoice. It’s a simple mechanism, just meant to give some peace of mind around reliability.

## Monitoring

Since we want to offer utmost transparency as of the status of our services, we offer a status page, and the ability to subscribe to any events that would be reported through that page.

### Status page

Our status page is available at [https://status.bump.sh/](https://status.bump.sh/).

It reports on any active event, current and past. Statuses and metrics are detailed for each service (API portal, deployment queue, ...).

Metrics are available in real time from our monitoring systems.

If any event occurs, our team is warned directly and will most of the time be working on it (and potentiall have fixed it) by the time you might realize it.

In rare cases, for events that may last longer, or for any scheduled maintenances that may impact our services, we will post announcements via that page.

### Status notifications

"Pull" mechanisms are commonly used, but "push" notifications can be essential in certain cases. You can subscribe to event notifications through the status page to stay informed in real time.

Such notifications may be delivered via:

- Email
- Slack
- RSS
- SMS
- Webhook

**Webhook configuration**

Our status page is powered by Uptime.com, and so is the notification system. The complete documentation for [setting up a webhook is available on their support site](https://support.uptime.com/hc/en-us/articles/360016256840-Status-Page-Forms-and-Fields#custom_webhooks).

In short:
1. Set up a handler, accessible by a public URL;
2. Use this URL under "Subscribe via Webhook" on https://status.bump.sh;
3. Any event will trigger a POST to that URL.

The `application/json` payload will look like this example:

```
{
"name": "Test incident",
"description": "This is an incident update",
"starts_at": "2024-02-02T20:40:54.398000Z",
"ends_at": null,
"duration": 125.416398,
"incident_type_display": "Incident",
"updates": [
     {
         "created_at": "2024-02-02T20:40:54.398000Z",
         "updated_at": "2024-02-02T20:40:54.398000Z",
         "description": "This is an incident update",
         "incident_state": "identified",
         "incident_state_display": "Identified"
     }
],
"affected_components": [],
"created_at": "2024-02-02T20:40:54.642672Z",
"incident_state": "identified",
"incident_type": "INCIDENT",
"url": "https://url-to-get-incident-details-via-api",
"manage_url": "https://url-to-manage-sp",
"unsubscribe_url": "https://url-to-unsubscribe"
}
```
