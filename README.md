# speedcontrol-layouts
A bundle of easy-to-use NodeCG layouts for marathons to use.

[![Release](https://img.shields.io/github/v/release/nicnacnic/speedcontrol-layouts?label=Release)](https://github.com/nicnacnic/restreamer-dashboard/releases)
![Downloads](https://img.shields.io/github/downloads/nicnacnic/speedcontrol-layouts/total?label=Downloads)
![License](https://img.shields.io/github/license/nicnacnic/speedcontrol-layouts?label=License)
[![Twitter](https://img.shields.io/twitter/follow/nicnacnic11?style=social)](https://twitter.com/nicnacnic11)
[![Discord](https://img.shields.io/badge/-Join%20the%20Discord!-brightgreen?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/A34Qpfe)

## About
speedcontrol-layouts was the layout pack used during Horror(ible) Games 2021 - Heartbreak, tweaked to make creating layouts easier.

### Features
- 14 easy-to-use and customizable layouts with deteiled documentation
- Full Tiltify support, showing total amount raised and incentives/prizes
- A sponsor area, for showcasing products and other events
- Various Photoshop files to easily make your own layouts

## Requirements
Administrator privileges will be needed to install. Some of these programs use the command line, you should be comfortable using Command Prompt or similar.
- [Git For Windows](https://git-scm.com/downloads)
- [Node.JS](https://nodejs.org/en/)
- [NodeCG](https://github.com/nodecg/nodecg)
- [NodeCG Speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol)

For [NodeCG Speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol), you need to use the dev branch with a version commited after February 1st, 2021 for custom data to work correctly. If you do not know how to build the files, I have a compatible build that you can use found [here](https://github.com/nicnacnic/nodecg-speedcontrol). Note that this version will get more out-of-date over time as I don't plan to update it.

Additionally, although not required, some basic knowledge of Java/Javascript, HTML and CSS will make it easier to customize these layouts.

## Installation
To install this layout pack, navigate to your root NodeCG folder using Command Prompt or similar (I like [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701?activetab=pivot:overviewtab)). Then, type in the following command and press enter.

```nodecg install nicnacnic/speedcontrol-layouts```

After the installation completes, type the following command to create a config file, found in ```<path_to_nodecg>/cfg```.

```nodecg defaultconfig speedcontrol-layouts```

Finally, you need to add these lines to the default [NodeCG Speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol). Go to ```<path_to_nodecg>/cfg``` and open ```nodecg-speedcontrol.json```. Under ```schedule```, copy/paste the following lines.
```bash
                "defaultURL": "https://horaro.org/event/schedule",
		"disableSpeedrunComLookup": false,
		"customData": [{
			"name": "Host",
			"key": "host",
			"ignoreMarkdown": false
		}]
```
And finally, add the following lines to the end of the JSON file.
```bash
            "customData": {
		"player": [{
			"name": "Pronouns",
			"key": "pronouns"
		}]
	}
```
If you're having trouble, a example config file can be found [here](https://github.com/nicnacnic/speedcontrol-layouts/wiki/NodeCG-Speedcontrol-Config-File-Example).

For a full user and customization guide, the [wiki](https://github.com/nicnacnic/speedcontrol-layouts/wiki) will have everything you need to know! 

## Using These Layouts
This layout pack includes many layouts with many different aspect ratios, including 4:3 and 16:9 (from 1p to 4p), GB, GBA, DS, 3DS, intermission, and a customizable omnibar. Photoshop files are also included for easy editing, from simply changing the colors to rearranging elements in your layout. And detailed documentation ensures you know what you're doing.

If you end up using speedcontrol-layouts during your marathon/event, it would be greatly appreciated if you included the repository name and author in your end credits. Thank you!

## Commission Work
As of March 13th, 2021, I am now offering some commission work! For a small fee, I'll be happy to make some modifications to the dashbaord to suit your needs! Everything from adding a feature, creating and updating layouts, or managing the dashboard during your marathon, and more! The price ranges from $20 to $200 depending on the size of your marathon and your needs. Since I do work on a bunch of other marathons, availability may be limited, so please reach out to me on Discord. For more information visit [https://nicnacnic.com](https://nicnacnic.com) (website still being built ATM).

## Restreamer Dashboard
If you need a easy-to-use dashboard for your restreamers, check out my custom-built UI that works well with these layouts! [nicnacnic/restreamer-dashboard](https://github.com/nicnacnic/restreamer-dashboard)

## Suggestions And Support
These layouts are still being developed, so if you come across any bugs or have any suggestions, please let me know by checking the list of [known bugs](https://github.com/nicnacnic/speedcontrol-layouts/wiki), and creating an issue in the [issue tracker](https://github.com/nicnacnic/speedcontrol-layouts/issues) if it isn't listed.

If you're having issues installing or using these layouts, I can be reached through my [Discord](https://discord.gg/A34Qpfe) server. Be aware that I'm usually busy with multiple marathons and other projects so I might not be able to help you right away.

## Special Thanks
BashPrime, for making the Calithon Spooktacular layouts which this layout pack is based on.

Floha258, for helping me with my NodeCG issues and getting custom player data to work correctly.

The Midwest Speedfest crew, for helping out with my NodeCG issues and for overall being such cool people :D

## License
MIT  License

Copyright (c) 2021 nicnacnic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
