---
title: "MiniSearch for Astro, End to End"
description: "A detailed implementation log for deterministic client-side search across multiple content collections in Astro."
date: 2025-11-25
tags: ["astro", "100daystooffload", "substack"]
---

*Note*: this was originally posted to my substack, [Pattern Matched](https://patternmatched.substack.com/p/minisearch-for-astro)

Designing & implementing client-side search for a statically generated site is mostly an integration problem: normalize heterogeneous content, ship a compact index, and hydrate just enough JavaScript to answer queries interactively.
I chose [MiniSearch](https://lucaong.github.io/minisearch/)[^1] because it runs entirely in the browser, exposes well-documented ranking hooks, and keeps the bundle size reasonable even after bolting on conveniences such as fuzzy matching and prefix search.
Today I'd like to walk through through the different components of my implementation so it can be reproduced or extended for your own use without reverse-engineering the repository.

## Why MiniSearch?

The choice of search engine for a static site involves trade-offs between implementation complexity, runtime performance, and user experience.
MiniSearch addresses the specific use case where full-text search features—prefix search, fuzzy matching, field boosting are required for the experience I'm after, but the corpus fits comfortably in browser memory.[^2]
By storing the index locally rather than querying a remote service, the system eliminates network latency and enables true offline functionality, a characteristic particularly valuable for progressive web applications or documentation sites.

MiniSearch ends up at approximately 7 kB gzipped[^3] and with zero runtime dependencies, making it suitable for memory-constrained environments such as mobile browsers.
The library's developer emphasizes a space-optimized index structure that balances retrieval speed against storage overhead, avoiding the memory explosion common in naïve inverted-index implementations,[^2] not unlike one [I wrote](https://tangled.org/desertthunder.dev/noteleaf/commit/2fc5eeaac410fd50c5badd24730e596681547e13) this past week.
Alternative client-side libraries such as Lunr.js or Elasticlunr offer similar capabilities but with different performance profiles: Lunr trades some query speed for a more compact index, while Elasticlunr removes stemming (reducing a word to its root form[^11]) to reduce build complexity.[^4]
MiniSearch's distinguishing feature is its tunable ranking system, which exposes BM25-inspired scoring with per-field boosts and configurable fuzzy-match tolerance.

## Content modeling and invariants

The project leans on `astro:content` (Astro's amazing content collection system) collections to guarantee that every document conforms to a known schema, with Zod for runtime validation.[^5] The content config file defines the fields for blog posts, bookmarks, projects, and pages, normalizing types such as `date`, `tags`, and `categories` before build time.
Because MiniSearch does not enforce schemas on the client, the quality of the index depends on the data discipline established here.
Schema validation catches errors at build time rather than runtime, a property especially valuable when onboarding contributors or migrating legacy content. When a new post is created, it must match the schema or Astro throws an error, preventing malformed/invalid documents from entering the index.[^5]
Thanks to this front-loading of validation, the search system can assume structural integrity: every blog post will have a `title`, `description`, `date`, and `tags` array, eliminating defensive null checks in the indexing pipeline.
I explicitly mark `draft` fields on blog entries, capture URL metadata for bookmarks and projects, and expose optional Open Graph images on standalone pages.
The search system later relies on these attributes to determine which documents enter the index and what metadata is shown in snippets. Establishing these invariants early simplifies downstream logic.

## Index construction pipeline

The document index originates from a `search-index.json`, an Astro API route that runs at build time and during development.
The handler invokes `getCollection` for each content type, filters out drafts, and converts markdown bodies into plaintext using a deterministic `stripMarkdown` helper.[^2]
The helper removes headings, emphasis markers, inline code fences, and link syntax to ensure MiniSearch ingests only searchable prose.
Every record in the resulting array is capped at 500 characters to keep the JSON payload compact.

The route exports `prerender = true`, instructing Astro to emit a static `/search-index.json` artifact during the production build.
While running `astro dev`, the handler still executes dynamically, which allows me or any developer to create a new post, refresh the search panel, and immediately see the document without restarting the dev server.
This dual-mode behavior ensures parity between development and production without requiring separate pipelines.

To guard against regressions, the indexer tags each document with a stable `id` that combines the collection name and slug (for example, `blog:mini-search-case-study`). This identifier later drives result enrichment on the client, allowing the UI to pull auxiliary metadata—such as tags—from the original document array even if MiniSearch returns only a subset of fields for ranking purposes.

## Ranking configuration and storage strategy

MiniSearch accepts both the list of fields it should tokenize and the subset of attributes it should store alongside each hit.
It initializes the engine with `fields` covering `title`, `description`, `text`, `tags`, and `categories`, while `storeFields` narrows the persisted metadata to `title`, `description`, `url`, and `type`.
This split intentionally keeps the index small. Long-form body content (`text`) is used for relevance scoring but not stored redundantly, because the original corpus remains available in the `documents` array already fetched from `/search-index.json`.

### Field boosting and relevance scoring

Boosts add another layer of control. The configuration doubles the weight of matches in `title`, sets a 1.5 multiplier on `description`, and leaves other fields at the default weight. These heuristics reflect user expectations—headlines should outrank incidental body matches—and echo established search-engine practices.[^1]

The underlying mechanics draw from information retrieval research, specifically the BM25 ranking function that improves upon classical TF-IDF (Term Frequency-Inverse Document Frequency).[^6] Where TF-IDF naively multiplies term frequency by inverse document frequency, BM25 introduces term frequency saturation: once a document contains enough occurrences of a query term, additional mentions yield diminishing returns.[^7] This prevents keyword-stuffed documents from dominating results purely through repetition. The `k₁` parameter controls the saturation curve; MiniSearch's defaults align with standard search-engine tuning.

BM25 also normalizes for document length, addressing the bias toward longer texts in TF-IDF.[^7] A match in a short document often signals higher relevance than the same match buried in a 5000-word essay. By adjusting scores based on document length relative to the average corpus length, BM25 produces rankings that better match human judgment. Field boosting extends this framework by treating matches in high-value fields—such as titles—as if they appeared multiple times, effectively amplifying their contribution to the final score.[^8]

Fuzzy matching with a tolerance of 0.2 offers resilience to common typos without diluting precision, and prefix search ensures that partially typed terms still surface meaningful results. These features combine to create a forgiving search experience: users can type "progresive" instead of "progressive," omit the final letters of a word mid-query, and still receive relevant hits.

## Client surfaces: overlay and full page

Two separate UI surfaces consume the same index.
The compact overlay is implemented in `src/components/SearchBar.astro` and mounts as part of the global navigation.[^3]
It fetches `/search-index.json` on first use, initializes MiniSearch once, and caches the resulting instance.
Results appear immediately below the input, capped at ten entries to preserve readability inside the constrained panel.
Each entry lists the title, an optional description snippet, the content type badge, and up to three tags.

The dedicated `/search` page, reuses the same index but renders a paginated list with 12 results per page (I may make this configurable), explicit navigation controls, and richer snippets.[^4]
Because the page is route-level content, it also reads stores state in the url, with a query parameter to allow creation of shareable search links without additional server support.

Both components guard against unnecessary hydration by running their initialization logic inside a document level event listener.
Astro's client-side router triggers this event whenever navigation occurs, so the search UI stays functional even during client-side transitions without re-downloading scripts.
No component uses a `client:*` directive; the scripts remain inline, and the browser only executes them when the respective page is active.

## Document enrichment and snippet generation

While MiniSearch returns ranking data, it does not know which field triggered the match or how to craft usable snippets.
Both UI implementations solve this by searching the original `documents` array for a record with the matching `id` and calling helper functions defined within the class.[^3][^4]

- `findMatchedField` tokenizes the query, checks the title, tags, description, and body in that order, and returns the first field containing a term. This information informs whether the UI should display a description or a body excerpt.
- `extractMatchSnippet` takes the plaintext body text, locates the earliest occurrence of any query token, and returns approximately 60–100 characters on either side (depending on the surface). If no term is found, the helper falls back to truncating the body to a fixed length.
- `highlightMatch` wraps each matched term in `<mark>` tags. Paired with custom CSS in both files, this produces consistent visual emphasis without re-processing the HTML on the server.

These helpers remain deterministic and pure. They also share identical logic between the overlay and the full page to avoid confusing users with mismatched results.

## Pagination, navigation, and accessibility

The full search page integrates a small pagination module (`paginate` and `setupPaginationNavigation`).
The first function slices the result array while returning metadata such as `hasNext`, `hasPrev`, and `lastPage`.
The second attaches click handlers to the "Previous" and "Next" buttons and keeps `aria` attributes in sync with the disabled state.
When users navigate across pages, the class scrolls the viewport to the top for context continuity.
These behaviors are implemented with minimal DOM mutations and no external dependencies.

Keyboard and screen-reader support come baked in.
Inputs use descriptive `placeholder` text, results render as anchor elements for native focus management, and pagination controls expose `aria-label` attributes.
The overlay includes logic to close itself when pressing `Escape` or clicking outside the panel, preventing inadvertent focus trapping.[^3]

## Performance considerations

A static JSON index plus a WASM-free search engine results in low overhead.
The indexer truncates bodies, reducing payload size—a practice recommended by search optimization guides that emphasize trimming unnecessary data to accelerate processing.[^9]
Cached responses mean repeat searches do not refetch data, and both components reuse the same MiniSearch instance across interactions.
Because everything stays in the browser, latency hinges on client CPU rather than network round trips, which keeps search responsive even for users on slow connections once the index is downloaded.

### Data preparation and batching

The construction pipeline follows indexing best practices by configuring searchable fields before adding documents.[^9] Defining which fields contribute to ranking—and which weights to apply—ahead of time allows MiniSearch to optimize its internal data structures during initialization. The alternative, reconfiguring fields after ingestion, would require rebuilding the index from scratch.

Document batching also matters, though less so for static builds than for real-time indexing. Because the search index route runs during `astro build`, all documents are processed in a single operation. If the system ever migrates to incremental static regeneration, batching updates into larger payloads will outperform many small HTTP requests.[^9] A single large batch is processed more quickly than multiple smaller ones due to reduced overhead from request parsing and response serialization.

To minimize layout thrash, all DOM updates happen through string templates assembled before assignment. Highlighting occurs before the markup is written to `innerHTML`, preventing partial renders. The overlay also limits itself to 400px of vertical space with scroll overflow handling so it does not push other layout elements around.

## Failure handling and observability

The initialization logic wraps its fetch call in a `try/catch` block. If the request fails—perhaps due to offline mode—the UI updates its status container with a human-readable message rather than leaving the user guessing.[^4] Because the endpoint produces deterministic JSON, there are few moving parts, but the surfacing of load failures still matters during deployments or CDN incidents.

In development, I often log the number of indexed documents after MiniSearch loads, which provides a quick sanity check that the expected collections were captured. Additional instrumentation could include debounced analytics events for search terms, but that layer is intentionally omitted here to avoid storing user queries.

## Extensibility

Adding a new content collection requires two steps: extend your content schema and replicate the indexing loop inside the `search-index.json` route.
It's a good idea to keep naming conventions consistent to ensure the front-end helpers continue to work without modification.
If the new content introduces a different metadata taxonomy (for example, `topics` instead of `tags`), normalize it to the existing `tags` or `categories` arrays before serializing the document.
MiniSearch configurations can evolve without rewriting the UI. For instance, adding field-specific fuzziness or custom tokenization can happen at instantiation time.
However, any change that affects stored fields have to be mirrored in the result enrichment logic, or else the UI might request metadata that no longer exists in the index.

## Conclusion

The search experience on this Astro site balances predictability and flexibility: it is deterministic at build time, lazy at runtime, and straightforward to extend.
Adhering to Astro's strict & built-in content schemas, normalizing documents before serialization, and instantiating MiniSearch exactly once per surface eliminates many of the pitfalls usually associated with client-side search.
I think the resulting implementation is fast, index-driven, and maintainable without external services.
Let me know in the comments if you have any feedback or questions!

[^1]: MiniSearch documentation — [lucaong.github.io/minisearch](https://lucaong.github.io/minisearch/)
[^2]: Luca Ongaro, "MiniSearch, a client-side full-text search engine" — [lucaongaro.eu/blog](https://lucaongaro.eu/blog/2019/01/30/minisearch-client-side-fulltext-search-engine.html)
[^3]: MiniSearch on npm — [npmjs.com/package/minisearch](https://www.npmjs.com/package/minisearch)
[^4]: "Top 6 JavaScript Search Libraries" — [byby.dev/js-search-libraries](https://byby.dev/js-search-libraries)
[^5]: "Introducing Content Collections: Type-Safe Markdown in Astro 2.0" — [astro.build/blog](https://astro.build/blog/introducing-content-collections/)
[^6]: "Understanding TF-IDF and BM-25" — [kmwllc.com](https://kmwllc.com/index.php/2020/03/20/understanding-tf-idf-and-bm-25/)
[^7]: "BM25 Explained: A Better Ranking Algorithm than TF-IDF" — [vishwasg.dev/blog](https://vishwasg.dev/blog/2025/01/20/bm25-explained-a-better-ranking-algorithm-than-tf-idf/)
[^8]: "BM25 relevance scoring" — [Microsoft Learn](https://learn.microsoft.com/en-us/azure/search/index-similarity-and-scoring)
[^9]: "Search indexing best practices for top performance" — [algolia.com/blog](https://www.algolia.com/blog/engineering/search-indexing-best-practices-for-top-performance-with-code-samples)
[^11]: Stemming | Elastic Docs. <https://www.elastic.co/docs/manage-data/data-store/text-analysis/stemming>. Accessed 25 Nov. 2025.
