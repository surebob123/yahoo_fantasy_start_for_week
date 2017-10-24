// ==UserScript==
// @name         Set Fantasy Basketball Lineup for the Week
// @namespace    https://github.com/mingcn
// @version      0.1
// @description  A user script that will add a button to start your lineup for the next 7 days
// @author       mingcn
// @match        *//basketball.fantasysports.yahoo.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    var startButton = $( "a:contains('Start Active Players')" );
    startButton.after('<div class="Btn Btn-short Mend-med" id="startForWeekBtn">Start Active players for the next 7 days</div>');
    var newButton = $( "#startForWeekBtn" );
    newButton.click(function() {
        var crumb, startActiveUrl, year, month, day, shortDate,
        dates = [];

        // Get relevant URL information (didn't use window.location.toString because sometimes it includes other random paths depends on how you got to the team page)
        var url = window.location.pathname;
        url = url.split('/');
        var sport = url[1];
        var leagueID = url[2];
        var teamID = url[3];

        // Finding the crumb attribute, seems to be unique for each team. It's in the active players button href
        crumb = startButton.attr('href');
        crumb = crumb.split('crumb=');
        crumb = crumb[1];

        // Getting the next 7 days of the week
        for(var i = 0; i < 7; i++) {
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);
            dates.push(currentDate);
        }

        dates.forEach(startActivePlayersGet);

        function startActivePlayersGet(date) {
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();

            if (month.toString().length === 1) {
                month = '0' + month;
            }

            if (day.toString().length === 1) {
                day = '0' + day;
            }

            shortDate = year + '-' + month + '-' + day;

            startActiveUrl = window.location.protocol + '//' + window.location.host + '/' + sport + '/' + leagueID + '/' + teamID + '/startactiveplayers?date=' + shortDate + '&crumb=' + crumb;
            console.log ('Running command ' + startActiveUrl);
            $.get(startActiveUrl);
        }

        location.reload(true);
    });
})();
