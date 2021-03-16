// jQuery overrides
jQuery.fn.visible = function (callback) {
	return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function (callback) {
	return this.css('visibility', 'hidden');
};

jQuery.fn.fadeVisible = function (callback) {
	return this.fadeTo(300, 1, () => {
		if (callback) callback();
	});
};

jQuery.fn.fadeInvisible = function (callback) {
	return this.fadeTo(300, 0, () => {
		if (callback) callback();
	});
};

jQuery.fn.visibilityToggle = function () {
	return this.css('visibility', function (i, visibility) {
		return (visibility == 'visible') ? 'hidden' : 'visible';
	});
};

function fadeHtml(selector, html, fixSize) {
	$(selector).fadeInvisible(() => {
		$(selector).html(html);

		if (fixSize) {
			FixSize(selector, () => $(selector).fadeVisible());
		} else {
			setTimeout(() => {
				$(selector).fadeVisible();
			}, 500);
		}
	});
}

function fadeText(selector, text, fixSize) {
	$(selector).fadeInvisible(() => {
		$(selector).text(text);

		if (fixSize) {
			FixSize(selector, () => $(selector).fadeVisible());
		} else {
			setTimeout(() => {
				$(selector).fadeVisible();
			}, 500);
		}
	});
}

function FixSize(selector, callback) {
	let divWidth = $(selector + ":visible").width();
	let fontSize = 92;

	// Reset font to default size to start.
	$(selector).css("font-size", "");

	let text_org = $(selector + ":visible").html();
	let text_update = '<span style="white-space:nowrap;">' + text_org + '</span>';
	$(selector + ":visible").html(text_update);

	while ($(selector + ":visible").children().width() > divWidth) {
		// console.log($(selector + ":visible").children().width() + " " + divWidth);
		$(selector).css("font-size", fontSize -= 1);
	}

	if (callback) {
		callback();
	}
}

function runFitText(selector, baseWidth) {
	$(selector).css('font-size', '');
	let selectorWidth = getAutoWidth(selector);

	if (selectorWidth >= baseWidth) {
		$(selector).fitText(selectorWidth / baseWidth);
	}
}

function getAutoWidth(selector) {
	$(selector).css('width', 'auto');
	const width = $(selector).innerWidth();
	$(selector).css('width', '');
	return width;
}

// Get team info from run data.
function getRunnersFromRunData(runData) {
	let currentTeamsData = [];
	runData.teams.forEach(team => {
		let teamData = { players: [], id: team.id };
		team.players.forEach(player => { teamData.players.push(createPlayerData(player)); });
		currentTeamsData.push(teamData);
	});
	return currentTeamsData;
}

function getNamesForRun(runData) {
	let currentTeamsData = getRunnersFromRunData(runData);
	let names = [];
	for (let team of currentTeamsData) {
		for (let player of team.players) {
			names.push(player.name);
		}
	}

	return names;
}

// Easy access to create member data object used above.
function createPlayerData(player) {
	// Gets username from URL.
	let twitchUsername = '';
	if (player.social && player.social.twitch) {
		twitchUsername = player.social.twitch;
	}

	// Parse pronouns from the runner name, if they're present.
	let name = player.name.split('-');
	let pronouns = '';
	if (name.length > 1) {
		pronouns = name[1].trim();
	}
	name = name[0].trim();

	return {
		id: player.id,
		teamID: player.teamID,
		name: name,
		pronouns: pronouns,
		twitch: twitchUsername,
		region: player.region
	};
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
