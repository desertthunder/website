---
title: LexDNS
description: A tiny REST API to resolve AT Protocol Lexicon Schemas.
repo: https://github.com/desertthunder/lexdns
link: https://lex.desertthunder.dev
status: completed
tech: [TypeScript, Cloudflare Workers, Hono, AT Protocol, DNS over HTTPS, KV]
tags: [atproto, lexicons, dns, cloudflare, developer-tools]
date: 2026-06-18
featured: true
---

LexDNS resolves AT Protocol Lexicon schemas from NSIDs.

It turns names like `app.bsky.feed.post` into the DNS location that advertises the schema
publisher, follows the publisher's DID document to its PDS to obtain the matching
`com.atproto.lexicon.schema` record.

## Why I Built This

AT Protocol Lexicons are meant to be named, discoverable schemas.

I wanted a small resolver to add to [Ibex](https://ibex.desertthunder.dev) that made
that discovery path easy so I wouldn't need to embed generated schema packages into
every project.

## Features

- REST endpoint for resolving an NSID to source metadata and the Lexicon document
- DNS-over-HTTPS TXT lookup for `_lexicon.<authority-domain>` records
  - `did=...` TXT record discovery for Lexicon publishers
  - DID document resolution for `did:plc` and `did:web`
  - PDS lookup through the `#atproto_pds` service
  - Schema fetch through `com.atproto.repo.getRecord`
- Response links for the API result and original `at://` source record
- KV-backed cache with configurable TTL
- Small web UI for trying published Lexicons interactively
- CORS support for browser clients

## Architecture

LexDNS runs as a Cloudflare Worker using Hono for routing & templating (JSX).

The resolver:

1. validates the NSID
2. converts its authority into the `_lexicon` DNS name
3. reads TXT records through DNS over HTTPS
4. resolves the publisher DID
5. fetches the schema record from the publisher's PDS.

Successful results are stored in Workers KV so repeated lookups stay cheap.

## Status

LexDNS is [live](lex.desertthunder.dev).
