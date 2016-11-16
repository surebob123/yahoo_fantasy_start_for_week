// ==UserScript==
// @name         Set Fantasy Basketball Lineup for the Week
// @namespace    https://github.com/mingcn
// @version      0.1
// @description  A user script that will add a button to start your lineup for the next 7 days
// @author       mingcn
// @match        http://basketball.fantasysports.yahoo.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';

    var startButton = $( "a:contains('Start Active Players')" );
    startButton.after('<div class="Btn Btn-short Mend-med" id="startForWeekBtn">Start Active players for the Week</div>');
    var newButton = $( "#startForWeekBtn" );
    newButton.click(function() {
        // Get the Date of the Page being Viewed via Button Href Value and Assign to Variables
        function pageDateObj(pageHref){
            function findDate() {
                var hrefUrl = pageHref.split('date=');
                var hrefQueryString = hrefUrl[1];
                var hrefQueryVars = hrefQueryString.split('&');
                var hrefQueryDate = hrefQueryVars[0].split('-');
                return hrefQueryDate;
            }
            this.date = findDate();
            this.year = Number(this.date[0]);
            this.month = Number(this.date[1]);
            this.day = Number(this.date[2]);
        }

        // Parses date values and creates a get request
        function startActivePlayersGet(date) {
            year = date.getFullYear();
            month = date.getMonth() + 1; // need to add +1 to the month because javascript Date object is zero indexed
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

        var crumb, startActiveUrl, year, month, day, shortDate, pageDate, url, sport, leagueID, teamID,
        dates = [];

        // Get relevant URL information (didn't use window.location.toString because sometimes it includes other random paths depends on how you got to the team page)
        url = window.location.pathname;
        url = url.split('/');
        sport = url[1];
        leagueID = url[2];
        teamID = url[3];

        // Finding the crumb attribute, seems to be unique for each team. It's in the active players button href
        crumb = startButton.attr('href');
        crumb = crumb.split('crumb=');
        crumb = crumb[1];

        // Getting date information for the date of the team page you are viewing
        pageDate = new pageDateObj(startButton.attr('href'));

        // Getting the dates from the current page views to the next 6 days (one week)
        for(var i = 0; i < 7; i++) {
            var currentDate = new Date(pageDate.year, pageDate.month-1, pageDate.day);
            currentDate.setDate(currentDate.getDate() + i);
            dates.push(currentDate);
        }

        dates.forEach(startActivePlayersGet);

        location.reload();
    });
})();
