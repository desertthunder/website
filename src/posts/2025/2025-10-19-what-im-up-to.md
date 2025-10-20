---
title: What I'm Up To
description: Checking in with all ??? of you
date: 2025-10-20
tags:
    - 100daystooffload
draft: false
---

I switched to YouTube music after over a decade on Spotify because of this interview that Anthony Fantano [did](https://www.youtube.com/watch?v=DO6seG5_IB8).
I don't really want to get into the details but it's really not a great thing to discover about something so ingrained into your life.
Honestly I should have done this after the API changes they made a while ago. Last year I made a data dashboard that relied heavily on audio analysis endpoints which got deprecated.
Spotify hasn't given any indication about what they may do to replace it. So since then I've been meaning to try out [Essentia](https://essentia.upf.edu/index.html) and build a pipeline that does that for me, but haven't gotten around to it.
I should add that almost a minute after writing this sentence, I started working on this.

This led to making [ytx](https://github.com/desertthunder/ytx/tags), a simple CLI & TUI to migrate Spotify playlists to YouTube music. YouTube's Data API isn't super open, so to integrate with YouTube Music, I used [ytmusic](https://ytmusicapi.readthedocs.io/) (a python library) is used.
Because I insisted on using charm.sh libraries for the TUI, I stuck to Golang for the bulk of the interface and interacting with Spotify's API.
The plan initially may have been to deploy it as a serverless web app. I'm not really sure. The current MVP has been fine for my purposes.
I saved $5 on an app subscription by spending an entire weekend on a tiny app. The Python bindings are exposed through FastAPI.
They were a single project but I recently [split](https://desertthunder.github.io/garden/engineering/git/splitting-repos/) them up.
Working with submodules has always intimidated me (looking at you Hugo themes) but it was kinda neat to do, and its cool seeing the link in Github.

Another project I've been working on is a small taskwarrior clone, called [noteleaf](https://github.com/stormlightlabs/noteleaf).
It started small but has ballooned into what I'd describe as a pretty okay Go codebase. I've spent more time writing tests than actual feature code.
It's a tui & a CLI and testing the TUI has been challenging. A lot of the time to test `stdout` I just use a StringBuilder or buffer to fulfill an io.Writer requirement, but to test execution of the bubbletea UI, I have to store the output and manage the channel with a context.
Charm's bubbles & bubbletea being so cool (and using TEA), has been a big roadblock to my learning Rust. The best way for me to learn a language has been to just use it for everything but I just love the ease of use of the Go standard library and charm so much.
Automate the Boring Stuff really had it right. Use code to automate your workflows and learn along the way. At some point I suppose I'll have to bite the bullet and just make all my small tools with Rust.

I've also been working on a front-end framework. Why? To contribute to the JS framework meme and also because I've found that building something from scratch is a good way to learn how it works.
Frameworks have long felt like magic to me, especially low-JS the hypermedia frameworks. I mean, Alpine calls a some of its properties [magics](https://alpinejs.dev/magics/el)!
Another thing that's always alluded me is signal based reactivity, particularly with [proxies](https://javascript.info/proxy), the mechanism/API by which Svelte handles deep [state](https://svelte.dev/docs/svelte/$state#Deep-state).
So I've ended up with something kind of like DataStar: a signal based, hypermedia framework. I'm calling it Volt to stick with the whole thunder/electricity theme.  I plan to make a few huge examples and then make it public with an MIT license.

Is it normal to make a repo private while it feels unfinished/embarassing? It's a little silly when I think about it because no one really reads my work. I'd been working on a couple of desktop apps with Tauri & some front-end frameworks (Svelte & React) but I've just not felt good about the code.
These projects are a PDF annotator & a video editor, both of which require engaging with somewhat challenging APIs. Some of the complexity and challenge is self inflicted. I'm not sure how most people handle canvas and drawing apps nowadays, but I thought it would be fun to make a node based UI that sits on top of the rendered PDF for annotations.

In other news, the Dodgers are in the World Series again. I'm conflicted about the AL. It's always been the Blue Jays to lose and my dearly beloved Mariners have never made it this far.
It would be weird if it was a Dodgers Mariners WS. LA swept Seattle at the end of the season but man would it be cool to see them on that stage.
If the Blue Jays win the AL, it'll be easier for me to choose a side. What I'm trying to say is that I win no matter what happens. Thanks Brew Crew.
