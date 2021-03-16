# speedcontrol-simpletext

This is a simple bundle for [NodeCG](http://nodecg.com/) that runs alongside the [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol) bundle to display information controlled by that bundle. Please see that bundle's repository for more information.

Unlike a complex layout bundle for nodecg-speedcontrol which might incorporate all run information elements into one custom designed page, this one keeps things simple by having separate pages for various types of data that speedcontrol supplies. This can be used as an example of how speedcontrol layout bundles work or just as a simple way to get some data on your stream.

If you need to edit/learn, look at the files in the `graphics` folder, mostly the CSS and JavaScript files, they are commented to help you understand what is going on. You should also look at the [NodeCG documentation](http://nodecg.com/) for more general information on how NodeCG works.

*A note about players:* nodecg-speedcontrol actually supports multiple players within "teams", but to keep things simple, we have made the `player.html`/`twitch.html` graphics only return the 1st player's data in a team for now. This will only affect you if you have co-op runs in your marathon.

Most of the bundle usage should be self explanatory; for the `player.html`/`twitch.html` graphics, you can add a hash parameter to the end of the URL to select the team number, for example `http://localhost:9090/bundles/speedcontrol-simpletext/graphics/player.html#2`.


## Installation

See the [installation instructions on nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol#installation) on how to install that bundle, and then (if you installed `nodecg-cli`) run `nodecg install speedcontrol/speedcontrol-simpletext` to install this bundle.

This bundle has no extra configuration options.