---
title: API docs up to 5 times faster
tags: [Improvement]
---

Performance is an ongoing effort at Bump.sh. Our goal has always been to make your API users find what they're looking for as quickly as possible, and performance is part of that goal. Following recent updates, **we've seen performance gains of up to 500%, especially on large documentation.**

To get there, we made multiple improvements:
- API definition files are now prepared and stored more efficiently, reducing processing time,
- Database queries have been optimized to serve your documentation faster, even under heavy load,
- Our caching strategy has been deepened to ensure that, most of the time, API users hit pre-generated content instead of waiting on cold requests.

These gains are most noticeable on large hubs and API documentation with deep request/response bodies.

Any feedback? Reach out at [hello@bump.sh](mailto:hello@bump.sh).