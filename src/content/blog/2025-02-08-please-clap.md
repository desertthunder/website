---
title: Please Clap
description: >
    In which Owais continues his pursuit of building delightful software, this
    time with the Rust (on the command line).
date: 2025-02-08
tags:
    - rust
    - clap
    - dart
    - flutter
    - productivity
    - react
    - 100daystooffload
draft: false
---

My [company](https://stormlightlabs.org) uses two languages right now: Dart & Rust.
Dart with Flutter for mobile applications and Rust for command-line and GUI
applications. Since it is just me for the forseeable future, I've been focusing on
cross-platform tools that challenge me. It isn't exactly the most practical way
to ship but I'd like to use company time to build my knowledge and add to my
toolbox. In the month or so I've been using these two languages I'm reminded that
it is hard to handle context switching between projects and how much I appreciate
a team with a more product focused member. The only person that can stop
[scope creep](https://en.wikipedia.org/wiki/Scope_creep) right now is me.

I have also learned Rust is a harder language to pick up than Dart, and in order
to really learn Rust, I have to slow down and use the resources available to me.
The way I learned Go was by doing things I'd usually do in Python with a small
go script. My approach these days is to "read the manual" and then get started.
This has been helpful for understanding concepts around Rust's ownership system
(you can read my notes [here](https://desertthunder.github.io/garden/programming/rust/ownership/)).
Over time I'm going through each chapter of the Rust book ([print](https://amzn.to/3EvBEey) or [online](https://doc.rust-lang.org/book/)) and taking detailed notes for my digital garden. Hopefully they can help
you review the material if its hard to grasp or remember. All of that aside, my
point is that Rust requires that I slow down a little bit and build smaller projects
while continuing to build features for my main projects. I'm working on a small CLI
using the [clap](https://docs.rs/clap) package. It's like being a junior engineer
again. I would power through tasks during the day and in the evenings try to get
a deeper understanding of what was asked of me.

I find Dart to be way easier. Rust is interesting but I'm not having fun quite yet.
This is likely due to Dart's familiarity and flexibility. Itshares a lot with languages
used commonly in application development, like ES5 JavaScript and Java.
Plus the *dx* for Flutter is fantastic. I really appreciate the hot reload and
ability to easily test my application on both platforms. Sure, you can quickly
whip up features in a web app, but there's something magical about seeing an app
hot reload on your phone or in an iOS simulator. I've been using the material
widgets for [Soulbloom](https://github.com/stormlightlabs/soulbloom), and they
take a lot of the overhead out of the process of writing client side code.

Learning React was similar for me. I started learning modern web development in
earnest after I felt that I had a firm grasp of JavaScript. State machine patterns
were brand new and difficult to wrap my head around. "UI as a function of state[^1]"
is the key pattern that was being discussed and taught as the ecosystem moved
away from lifecycle methods into hooks.

Designing an application and mapping out the state is challenging. [Elm's](https://amzn.to/40UD3mi)
usage of messages[^2] to describe the way an action (sort of like redux action types[^3])
mutates state is great for building mental models. [Iced](https://iced.rs) uses the Elm architecture,
which has been great for conceptualizing and writing my application. The limiting
factor remains my knowledge of Rust.

As I continue to build and learn, I want to express more gratitude towards
[Blake Watson](https://blakewatson.com). He has a phenomenal post about [finishing](https://blakewatson.com/journal/finishing-side-projects/) side projects. You should give it a read if you struggle
to finish your projects.

[^1]: <https://docs.flutter.dev/app-architecture/concepts#ui-is-a-function-of-immutable-state>
[^2]: <https://guide.elm-lang.org/architecture/>
[^3]: <https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#actions>
