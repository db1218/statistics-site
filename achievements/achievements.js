$(function() {

    $('[data-toggle="tooltip"]').tooltip();

    var hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function (e) {
       $(this).tab('show');
       var scrollmem = $('body').scrollTop();
       window.location.hash = this.hash;
       $('html,body').scrollTop(scrollmem);
     });

     Array.prototype.diff = function(a) {
         return this.filter(function(i) {return a.indexOf(i) < 0;});
     };

    darkmode();

    lightmode = localStorage.getItem('mode');

    $("#darkmode").click(function() {
        localStorage.setItem('mode', (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark');
        location.reload();
    });

    $("#tab-menu .nav-link").on("click", function() {
        if (lightmode === "dark") {
            if ($(this).attr("aria-expanded") != null) {
                if ($(this).attr("aria-expanded") == "false") {
                    $(".nav-link.dropdown-toggle").addClass('dark');
                } else {
                    $(".nav-link.dropdown-toggle").removeClass('dark');
                }
            } else {
                $(this).addClass('dark');
                $(".nav-link.dropdown-toggle").removeClass('dark');
            }
        }
    });

    $('.nav-item.dropdown').on('hidden.bs.dropdown', function () {
        if (lightmode === "dark") {
            if (!$(this).children(".nav-link.dropdown-toggle.dark").hasClass("active")) {
                $(this).children(".nav-link.dropdown-toggle.dark").removeClass("dark");
            }
        }
    })

    var ign = $("#ign").html().trim();
    var nameInputObj = {
        ign: ign
    };

    document.title = ign + " | Hypixel Achievements Tool";

    var percentageObject = {};
    var gameFilter = "arcade";

    var radioProgress = "Both";
    var radioType = "Both";

    var totalPointsObject = {};
    var maxedGames = [];

    $.get("https://api.hypixel.net/resources/achievements", function (response) {

        var achievementObject = response;
        achievementsInfo = response.achievements;

        $.post("get_data.php", JSON.stringify(nameInputObj), function(response) {

            var achievementsTiered = JSON.parse(response)[0];
            var achievementsOneTime = JSON.parse(response)[1];

            var achievementPointsOfficial = JSON.parse(response)[2];

            var uuidNameObj = {
                uuid: JSON.parse(response)[12],
                ign: JSON.parse(response)[6]
            };

            $.post("getNames.php", JSON.stringify(uuidNameObj), function(names) {
                var namesParsed = JSON.parse(names);
                var namesString = namesParsed[0];
                for (var i=1; i<namesParsed.length;i++) {
                    namesString += ", " + namesParsed[i];
                }
                $("#heading").attr('data-original-title', namesString);
            });

            // Info box below name
            infoBox(response);
            function infoBox(response) {

                var quests = JSON.parse(response)[13];

                $("#heading").html(formatRank(JSON.parse(response)[5], JSON.parse(response)[6], JSON.parse(response)[7], JSON.parse(response)[8], JSON.parse(response)[9], JSON.parse(response)[10], JSON.parse(response)[11]));
                function formatRank(rank, rankColour, name, monthlyPackageRank, oldRank, rankNameColour, staffRank) {
                    if (staffRank == "HELPER") {
                        if (lightmode === "dark") {
                            prefix = "<span style='text-shadow: 1px 1px #858585; color:#5555FF'>[HELPER] " + name + "</span>"
                        } else {
                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#5555FF'>[HELPER] " + name + "</span>"
                        }
                    } else if (staffRank == "MODERATOR") {
                        if (lightmode === "dark") {
                            prefix = "<span style='text-shadow: 1px 1px #414141; color:#008000'>[MOD] " + name + "</span>"
                        } else {
                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#008000'>[MOD] " + name + "</span>"
                        }
                    } else if (staffRank == "ADMIN") {
                        if (lightmode === "dark") {
                            prefix = "<span style='text-shadow: 1px 1px #3f3f3f; color:#FF5555'>[ADMIN] " + name + "</span>"
                        } else {
                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#FF5555'>[ADMIN] " + name + "</span>"
                        }
                    } else if (staffRank == "YOUTUBER") {
                        if (lightmode === "dark") {
                            prefix = "<span style='text-shadow: 1px 1px #373737; color:#FF5555'>[</span><span style='text-shadow: 1px 1px #373737; color:#FFFFFF'>YOUTUBE</span><span style='text-shadow: 1px 1px #373737; color:#FF5555'>] " + name + "</span>"
                        } else {
                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#FF5555'>[</span><span style='text-shadow: 1px 1px #eee; color:#FFFFFF'>YOUTUBE</span><span style='text-shadow: 1px 1px #eee; color:#FF5555'>] " + name + "</span>"
                        }
                    } else {
                        if (rank) {
                            switch (rank) {
                                case "MVP_PLUS":

                                    var colour = "";
                                    var prefix = "";

                                    if (monthlyPackageRank == "SUPERSTAR") {

                                        colour = getRankColour(rankColour);

                                        if (rankNameColour == "AQUA") {
                                            if (lightmode === "dark") {
                                                prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>[MVP" + "<span style='text-shadow: 1px 1px #444; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>] " + name + "</span>";
                                            } else {
                                                prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>[MVP" + "<span style='text-shadow: 1px 1px #eee; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>] " + name + "</span>";
                                            }

                                        } else {
                                            if (lightmode === "dark") {
                                                prefix = "<span style='text-shadow: 1px 1px #444; color:#FFAA00'>[MVP" + "<span style='text-shadow: 1px 1px #444; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #444; color:#FFAA00'>] " + name + "</span>";
                                            } else {
                                                prefix = "<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>[MVP" + "<span style='text-shadow: 1px 1px #eee; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>] " + name + "</span>";
                                            }
                                        }

                                    } else {

                                        colour = getRankColour(rankColour);

                                        if (lightmode === "dark") {
                                            prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>[MVP" + "<span style='text-shadow: 1px 1px #444; color:#" + colour + "'>+<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>] " + name + "</span>";
                                        } else {
                                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>[MVP" + "<span style='text-shadow: 1px 1px #eee; color:#" + colour + "'>+<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>] " + name + "</span>";
                                        }
                                    }
                                    break;
                                case "MVP":
                                    if (lightmode === "dark") {
                                        prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>[MVP] " + name + "</span>";
                                    } else {
                                        prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>[MVP] " + name + "</span>";
                                    }
                                    break;
                                case "VIP_PLUS":
                                    if (lightmode === "dark") {
                                        prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE63C'>[VIP" + "<span style='text-shadow: 1px 1px #444; color:#FFAA00'>+<span style='text-shadow: 1px 1px #444; color:#3CE63C'>] " + name + "</span>";
                                    } else {
                                        prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE63C'>[VIP" + "<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>+<span style='text-shadow: 1px 1px #eee; color:#3CE63C'>] " + name + "</span>";
                                    }
                                    break;
                                case "VIP":
                                    if (lightmode === "dark") {
                                        prefix = "<p style='text-shadow: 1px 1px #444; color:#3CE63C'>[VIP] " + name;
                                    } else {
                                        prefix = "<p style='text-shadow: 1px 1px #eee; color:#3CE63C'>[VIP] " + name;
                                    }
                                    break
                            }
                        } else if (oldRank) {
                            switch (oldRank) {
                                case "MVP_PLUS":

                                    var colour = "";
                                    var prefix = "";

                                    if (monthlyPackageRank == "SUPERSTAR") {

                                        switch (rankColour) {
                                            case "BLACK":
                                                colour = "000000"
                                                break;
                                            case "DARK_GRAY":
                                                colour = "555555"
                                                break;
                                            case "DARK_PURPLE":
                                                colour = "AA00AA"
                                                break;
                                            case "DARK_GREEN":
                                                colour = "008000"
                                                break;
                                            case "DARK_RED":
                                                colour = "AA0000"
                                                break;
                                            case "PINK":
                                                colour = "FF55FF"
                                                break;
                                            case "WHITE":
                                                colour = "FFFFFF"
                                                break;
                                            case "BLUE":
                                                colour = "5555FF"
                                                break;
                                            case "YELLOW":
                                                colour = "FFFF55"
                                                break;
                                            case "GOLD":
                                                colour = "FFAA00"
                                                break;
                                            case "DARK_AQUA":
                                                colour = "00AAAA"
                                                break;
                                            default:
                                                colour = "FF5555"

                                        }
                                        if (rankNameColour == "AQUA") {
                                            if (lightmode === "dark") {
                                                prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>[MVP" + "<span style='text-shadow: 1px 1px #444; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>] " + name + "</span>";
                                            } else {
                                                prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>[MVP" + "<span style='text-shadow: 1px 1px #eee; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>] " + name + "</span>";
                                            }

                                        } else {
                                            if (lightmode === "dark") {
                                                prefix = "<span style='text-shadow: 1px 1px #444; color:#FFAA00'>[MVP" + "<span style='text-shadow: 1px 1px #444; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #444; color:#FFAA00'>] " + name + "</span>";
                                            } else {
                                                prefix = "<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>[MVP" + "<span style='text-shadow: 1px 1px #eee; color:#" + colour + "'>++<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>] " + name + "</span>";
                                            }
                                        }
                                    } else {

                                        colour = getRankColour(rankColour);

                                        if (lightmode === "dark") {
                                            prefix = "<span style='text-shadow: 1px 1px #444; color:#FFAA00'>[MVP" + "<span style='text-shadow: 1px 1px #444; color:#" + colour + "'>+<span style='text-shadow: 1px 1px #444; color:#FFAA00'>] " + name + "</span>";
                                        } else {
                                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>[MVP" + "<span style='text-shadow: 1px 1px #eee; color:#" + colour + "'>+<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>] " + name + "</span>";
                                        }

                                    }
                                    break;
                                    case "MVP":
                                        if (lightmode === "dark") {
                                            prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE6E6'>[MVP] " + name + "</span>";
                                        } else {
                                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE6E6'>[MVP] " + name + "</span>";
                                        }
                                        break;
                                    case "VIP_PLUS":
                                        if (lightmode === "dark") {
                                            prefix = "<span style='text-shadow: 1px 1px #444; color:#3CE63C'>[VIP" + "<span style='text-shadow: 1px 1px #444; color:#FFAA00'>+<span style='text-shadow: 1px 1px #444; color:#3CE63C'>] " + name + "</span>";
                                        } else {
                                            prefix = "<span style='text-shadow: 1px 1px #eee; color:#3CE63C'>[VIP" + "<span style='text-shadow: 1px 1px #eee; color:#FFAA00'>+<span style='text-shadow: 1px 1px #eee; color:#3CE63C'>] " + name + "</span>";
                                        }
                                        break;
                                    case "VIP":
                                        if (lightmode === "dark") {
                                            prefix = "<p style='text-shadow: 1px 1px #444; color:#3CE63C'>[VIP] " + name;
                                        } else {
                                            prefix = "<p style='text-shadow: 1px 1px #eee; color:#3CE63C'>[VIP] " + name;
                                        }
                                        break
                            }
                        } else if (rank == "NONE" || oldRank == "NONE" || (!oldRank && !rank)) {
                            if (lightmode === "dark") {
                                prefix = "<span style='text-shadow: 1px 1px #444; color:#AAAAAA'>" + name + "</span>"
                            } else {
                                prefix = "<span style='text-shadow: 1px 1px #eee; color:#AAAAAA'>" + name + "</span>"
                            }
                        }

                    }

                    return prefix
                }

                // print quests
                printNumQuests(quests);
                printLevel(response);

                function printNumQuests(quests) {

                    var numQuestsCompleted = 0;

                    $.each(quests, function(individualQuestsName, individualQuestsObject) {
                        $.each(individualQuestsObject, function(completionsName, completionsObject) {
                            if (completionsName === "completions") {
                                $.each(completionsObject, function() {
                                    numQuestsCompleted += 1;
                                });
                            }
                        });
                    });

                    var card="";
                    if (lightmode === 'dark') {
                        card += "<div class='card border-default mb-3 dark'>";
                    } else {
                        card += "<div class='card border-default mb-3'>";
                    }
                    card += "	<div id='info' class='card-body row text-center'>";
                    if (lightmode === "dark") {
                        card += "		<div class='col-sm'><a href='/quests/" + ign + "' style='color:#c1c1c1;'><u class='dark'>Quests Completed</u> <span class='badge badge-pill badge-secondary'>" + numQuestsCompleted + "</span></a></div>";
                    } else {
                        card += "		<div class='col-sm'><a href='/quests/" + ign + "' style='color:#212529;'><u>Quests Completed</u> <span class='badge badge-pill badge-secondary'>" + numQuestsCompleted + "</span></a></div>";
                    }
                    card += "	</div>";
                    card += "</div>";

                    $("#gen").html(card);

                    return numQuestsCompleted;

                }

                function printLevel(response) {
                    var exp = JSON.parse(response)[3];
                    var newExp = JSON.parse(response)[4];

                    var level = "<div class='col-sm'>Network Level <span class='badge badge-pill badge-secondary'>" + getNetworkLevel(exp, newExp) + "</span></div>";
                    $("#info").append(level);
                }
            }

            var achievementsDB = [];

            // Achievement Tab
            achievementsTab(achievementsOneTime, achievementsTiered);
            function achievementsTab(achievementsOneTime, achievementsTiered) {

                var overallAchievements = 0;
                var overallPoints = 0;

                var overallSection = "";
                var gameSection = "";
                var specialSection = "";
                var wholeAchievementList = "";
                var achievementList = "";

                var totalPoints = 0;
                var points = 0;
                var achievementsGrandTotal = 0;
                var achievementsGrandDone = 0;

                gameStrings = ["skywars", "arcade", "vampirez", "walls3", "warlords", "quake",
                "walls", "blitz", "tntgames", "gingerbread", "paintball", "supersmash", "copsandcrims", "truecombat",
                "arena", "uhc", "bedwars", "murdermystery", "buildbattle",
                "duels", "prototype", "speeduhc", "skyblock"];

                specialStrings = ["general", "halloween2017", "easter", "christmas2017", "housing"];

                var allStrings = gameStrings.concat(specialStrings);
                var totalAchievementPoints = 0;

                $.get("updates/oldAchievements.php", function (response) {
                    parsedResponse = JSON.parse(response);
                    newAchievements = achievementObject.achievements;
                    if (parsedResponse[0] == 1) {
                        oldAchievements = JSON.parse(parsedResponse[1]);
                        newAchievementsList = [];
                        $.each(newAchievements, function(newGame, newGameObject) {
                            $.each(newGameObject.one_time, function(newAchievement, newAchievementObject) {
                                newAchievementsList.push(newGame + " one_time " + newAchievement);
                            });
                            $.each(newGameObject.tiered, function(newAchievement, newAchievementObject) {
                                newAchievementsList.push(newGame + " tiered " + newAchievement);
                            });
                        });

                        oldAchievementsList = [];
                        $.each(oldAchievements, function(oldGame, oldGameObject) {
                            $.each(oldGameObject.one_time, function(oldAchievement, oldAchievementObject) {
                                oldAchievementsList.push(oldGame + " one_time " + oldAchievement);
                            });
                            $.each(oldGameObject.tiered, function(oldAchievement, oldAchievementObject) {
                                oldAchievementsList.push(oldGame + " tiered " + oldAchievement);
                            });
                        });
                        difference = newAchievementsList.diff(oldAchievementsList);
                        if (difference.length > 0) {
                            $.post("updates/addNewAchievement.php", JSON.stringify({time:parsedResponse[2],path:difference}));
                        }
                    }
                    $.post("updates/getNewAchievements.php", function(response3) {
                        var newAchievementList = JSON.parse(response3);

                        var tableRows = "";
                        // for each game (info)
                        $.each(achievementsInfo, function(game, gameObject) {

                            hasNewAchievement = false;
                            totalPoints = 0;
                            points = 0;
                            achievementsDone = 0;
                            achievementsTotal = 0;

                            achievementList += "    <div class='tab-pane fade' id='list-" + game + "' role='tabpanel' aria-labelledby='list-" + game + "-list'>";
                            achievementList += "        <h2>" + getEnGameNames(game) + "</h2>";
                            achievementList += "        <div class='card'>";
                            if (lightmode === "dark") {
                                achievementList += "        <table class='table table-dark' id='" + game + "-table' style='margin-bottom:0;'>";
                            } else {
                                achievementList += "        <table class='table' id='" + game + "-table' style='margin-bottom:0;'>";
                            }
                            achievementList += "            <thead>";
                            achievementList += "                <tr>";
                            achievementList += "                    <th scope='col'>Name</th>";
                            achievementList += "                    <th scope='col'>Description</th>";
                            achievementList += "                    <th scope='col'>Points</th>";
                            achievementList += "                </tr>";
                            achievementList += "            </thead>";
                            achievementList += "            <tbody>";

                            var achievementListPart = "";
                            totalPointsObject[game] = gameObject.total_points;

                            // for each tiered achievement (info)
                            $.each(gameObject.tiered, function(achievementName, achievementObject) {
                                if (achievementObject.legacy != true) {
                                    var tableRow = "";
                                    tableRow += "            <tr>";
                                    hasNew = false;
                                    $.each(newAchievementList, function(key, value) {
                                        if (game + " tiered " + achievementName == value.path[0]) {
                                            hasNewAchievement = true;
                                            hasNew = true;
                                            tableRow += "            <th>" + achievementObject.name + " <span class='badge badge-primary'>New!</span></th>";
                                        }
                                    })
                                    if (!hasNew) {
                                        tableRow += "                <th>" + achievementObject.name + "</th>";
                                    }
                                    achievementListPart = "";
                                    achievementListPart += "            <td>";

                                    var completed = true;
                                    var savedAmount = 0;
                                    var topAmount = 0;

                                    var value = achievementsTiered[game + "_" + achievementName.toLowerCase()];
                                    if (value != null) {
                                        for (var tier=0;tier<achievementObject.tiers.length;tier++) {
                                            topAmount = value;
                                            if (value >= achievementObject.tiers[tier].amount) {
                                                points += achievementObject.tiers[tier].points;
                                                achievementsDone++;
                                                achievementListPart += "          <span class='badge badge-success badge-pill'>" + achievementObject.tiers[tier].points + "</span>";
                                                savedAmount = achievementObject.tiers[tier].amount;
                                                topAmount = achievementObject.tiers[tier].amount;
                                            } else {
                                                if (completed == true) {
                                                    savedAmount = achievementObject.tiers[tier].amount;
                                                    achievementListPart += "      <span class='badge badge-warning badge-pill'>" + achievementObject.tiers[tier].points + "</span>";
                                                    completed = false;
                                                } else {
                                                    achievementListPart += "      <span class='badge badge-danger badge-pill'>" + achievementObject.tiers[tier].points + "</span>";
                                                }
                                            }
                                            achievementsTotal++;
                                            totalPoints += achievementObject.tiers[tier].points;
                                        }
                                    } else {
                                        for (var tier=0;tier<achievementObject.tiers.length;tier++) {
                                            achievementListPart += "               <span class='badge badge-danger badge-pill'>" + achievementObject.tiers[tier].points + "</span>";
                                        }
                                        savedAmount = achievementObject.tiers[0].amount;
                                        topAmount = 0;
                                    }

                                    var desc = achievementObject.description.replace("%s","<span class='badge badge-pill badge-secondary'>" + topAmount + "/" + savedAmount + "</span>");

                                    achievementListPart = "<td>" + desc + "</td>" + achievementListPart;

                                    tableRow += achievementListPart;
                                    tableRow +=                   "</td>";
                                    tableRow += "            </tr>";
                                    achievementList += tableRow;
                                    tableRows += tableRow;
                                }
                            });

                            // for each one_time achievement (info)
                            $.each(gameObject.one_time, function(achievementName, achievementObject) {
                                if (achievementObject.legacy != true) {
                                    var tableRow = "";
                                    tableRow += "            <tr>";
                                    hasNew = false;
                                    $.each(newAchievementList, function(key, value) {
                                        if (game + " one_time " + achievementName == value.path[0]) {
                                            hasNewAchievement = true;
                                            hasNew = true;
                                            tableRow += "            <th>" + achievementObject.name + " <span class='badge badge-primary'>New!</span></th>";
                                        }
                                    })
                                    if (!hasNew) {
                                        tableRow += "                <th>" + achievementObject.name + "</th>";
                                    }
                                    tableRow += "                <td>" + achievementObject.description + "</td>";
                                    tableRow += "                <td>";

                                    var found = false;
                                    totalPoints += achievementObject.points;
                                    achievementsTotal++;

                                    var i = 0;
                                    while (!found && i<achievementsOneTime.length) {
                                        if (achievementsOneTime[i] == (game + "_" + achievementName.toLowerCase())) {
                                            tableRow += "              <span class='badge badge-success badge-pill'>" + achievementObject.points + "</span>";
                                            points += achievementObject.points;
                                            achievementsDone++;
                                            found = true;
                                        }
                                        i++;
                                    }
                                    if (!found) {
                                        tableRow += "                  <span class='badge badge-danger badge-pill'>" + achievementObject.points + "</span>";
                                    }
                                    tableRow +=                   "</td>";
                                    tableRow += "            </tr>";
                                    achievementList += tableRow;
                                    tableRows += tableRow;
                                }
                            });

                            achievementList += "            </tbody>";
                            achievementList += "        </table>";
                            achievementList += "        </div>";
                            achievementList += "        <p id='" + game + "-noresults' hidden>No results found</p>";
                            achievementList += "    </div>";

                            var percentage = achievementsDone/achievementsTotal;
                            var colour = getPercentageColour(percentage);
                            var enPercentage = Math.floor(percentage*100);
                            var achievementsPercentage = enPercentage;
                            var pointsPercentage =  Math.floor((points/totalPoints)*100);

                            percentageObject[game] = {
                                                        "achievementsDone":achievementsDone,
                                                        "achievementsTotal":achievementsTotal,
                                                        "achievementsPercentage":achievementsPercentage,
                                                        "pointsPercentage":pointsPercentage,
                                                        "totalPoints":totalPoints,
                                                        "points":points,
                                                        "game":game
                                                    };

                            for (var i=0;i<gameStrings.length;i++) {
                                if (game == gameStrings[i]) {
                                    if (lightmode === 'dark') {
                                        gameSection += "<a game='" + game + "' class='game list-group-item list-group-item-action dark' id='list-" + game + "-list' data-toggle='list' href='#list-" + game + "' role='tab' aria-controls='" + game + "' style='padding:0.40rem 1.25rem;'>" + getEnGameNames(game);
                                    } else {
                                        gameSection += "<a game='" + game + "' class='game list-group-item list-group-item-action' id='list-" + game + "-list' data-toggle='list' href='#list-" + game + "' role='tab' aria-controls='" + game + "' style='padding:0.40rem 1.25rem;'>" + getEnGameNames(game);
                                    }
                                    gameSection += " <span class='percentages' id='" + game + "-percentage'>" + enPercentage + "% (" + achievementsDone + "/" + achievementsTotal + ")</span>";
                                    if (hasNewAchievement) {
                                        gameSection += " <span class='badge badge-primary'>New!</span>";
                                    }
                                    if (lightmode === "dark") {
                                        gameSection += "    <div class='progress dark'>";
                                    } else {
                                        gameSection += "    <div class='progress'>";
                                    }
                                    gameSection += "        <div id='" + game + "-bar' class='progress-bar' role='progressbar' style='width: " + enPercentage + "%; background-color: " + colour + "' aria-valuenow='" + enPercentage + "' aria-valuemin='0' aria-valuemax='100'></div>";
                                    gameSection += "    </div>";
                                    gameSection += "</a>";
                                }
                            }

                            for (var i=0;i<specialStrings.length;i++) {
                                if (game == specialStrings[i]) {
                                    if (lightmode === 'dark') {
                                        specialSection += "<a game='" + game + "' class='game list-group-item list-group-item-action dark' id='list-" + game + "-list' data-toggle='list' href='#list-" + game + "' role='tab' aria-controls='" + game + "' style='padding:0.40rem 1.25rem;'>" + getEnGameNames(game);
                                    } else {
                                        specialSection += "<a game='" + game + "' class='game list-group-item list-group-item-action' id='list-" + game + "-list' data-toggle='list' href='#list-" + game + "' role='tab' aria-controls='" + game + "' style='padding:0.40rem 1.25rem;'>" + getEnGameNames(game);
                                    }
                                    specialSection += " <span class='percentages' id='" + game + "-percentage'>" + enPercentage + "% (" + achievementsDone + "/" + achievementsTotal + ")</span>";
                                    if (hasNewAchievement) {
                                        specialSection += " <span class='badge badge-primary'>New!</span>";
                                    }
                                    if (lightmode === "dark") {
                                        specialSection += "     <div class='progress dark'>";
                                    } else {
                                        specialSection += "     <div class='progress'>";
                                    }
                                    specialSection += "         <div id='" + game + "-bar' class='progress-bar' role='progressbar' style='width: " + enPercentage + "%; background-color: " + colour + "' aria-valuenow='" + enPercentage + "' aria-valuemin='0' aria-valuemax='100'></div>";
                                    specialSection += "     </div>";
                                    specialSection += "</a>";
                                }
                            }

                            overallAchievements += achievementsDone;
                            overallPoints += points;

                            achievementsDB.push([game, [points, achievementsDone]]);

                            if (points == gameObject.total_points && points != 0) {
                                maxedGames.push(game);
                            }
                            achievementsGrandDone += achievementsDone;
                            achievementsGrandTotal += achievementsTotal;

                        });

                        achievementListEnd = "";
                        achievementListEnd += "    <div class='tab-pane fade show active' id='list-overall' role='tabpanel' aria-labelledby='list-overall-list'>";
                        achievementListEnd += "        <h2>Overall</h2>";
                        achievementListEnd += "        <div class='card'>";
                        if (lightmode === "dark") {
                            achievementListEnd += "        <table class='table table-dark' id='overall-table' style='margin-bottom:0;'>";
                        } else {
                            achievementListEnd += "        <table class='table' id='overall-table' style='margin-bottom:0;'>";
                        }
                        achievementListEnd += "            <thead>";
                        achievementListEnd += "                <tr>";
                        achievementListEnd += "                    <th scope='col'>Name</th>";
                        achievementListEnd += "                    <th scope='col'>Description</th>";
                        achievementListEnd += "                    <th scope='col'>Points</th>";
                        achievementListEnd += "                </tr>";
                        achievementListEnd += "            </thead>";
                        achievementListEnd += "            <tbody>";
                        achievementListEnd += tableRows;
                        achievementListEnd += "            </tbody>";
                        achievementListEnd += "            </table>";
                        achievementListEnd += "        </div>";
                        achievementListEnd += "        <p id='overall-noresults' hidden>No results found</p>";
                        achievementListEnd += "    </div>";
                        achievementList = achievementListEnd + achievementList;

                        achievementsDB.push(["all", [achievementPointsOfficial, overallAchievements]]);
                        achievementsDB.push(["maxed", [maxedGames.length, 0]]);

                        $("#info").append("<div class='col-sm'>Achievement Points <span class='badge badge-pill badge-secondary'>" + achievementPointsOfficial + "</span></div>");

                        $.each(achievementsInfo, function(game, gameObject) {
                            totalAchievementPoints += gameObject.total_points;
                        });
                        totalPointsObject["all"] = totalAchievementPoints;

                        var card = "";
                        if (lightmode === 'dark') {
                            card += "<div class='card border-default mb-3 dark list-group' role='tablist'>";
                            card += "<a game='overall' class='game dark list-group-item list-group-item-action' id='list-overall-list' data-toggle='list' href='#list-overall' role='tab' aria-controls='overall' aria-selected='true'>";
                        } else {
                            card += "<div class='card border-default mb-3 list-group' role='tablist'>";
                            card += "<a game='overall' class='game list-group-item list-group-item-action' id='list-overall-list' data-toggle='list' href='#list-overall' role='tab' aria-controls='overall' aria-selected='true'>";
                        }
                        card += "	<div id='info' class='card-body'>";
                        card += "		<p>Achievements Completion Progress</p>";
                        if (lightmode === "dark") {
                            card += "    <div class='progress dark'>";
                        } else {
                            card += "    <div class='progress'>";
                        }
                        var percentage = overallPoints/totalAchievementPoints;
                        var colour = getPercentageColour(percentage);
                        var enPercentage = Math.floor(percentage*100);
                        card += "           <div class='progress-bar progress-bar-striped bg' role='progressbar' style='width: " + (percentage * 100) + "%; background-color: " + colour + "' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'><b>"+ enPercentage + "% (" + numberWithCommas(overallPoints) + " / " + numberWithCommas(totalAchievementPoints) + ")</b></div>";
                        card += "		</div>";
                        card += "	</div>";
                        card += "	</a>";
                        card += "</div>";

                        $("#gen").append(card);

                        percentageObject["overall"] = {
                                                    "achievementsDone":achievementsGrandDone,
                                                    "achievementsTotal":achievementsGrandTotal,
                                                    "achievementsPercentage":Math.floor(achievementsGrandDone/achievementsGrandTotal*100),
                                                    "pointsPercentage":enPercentage,
                                                    "totalPoints":totalAchievementPoints,
                                                    "points":overallPoints,
                                                    "game":"overall"
                                                };

                        gameSection = "<div class='list-group' role='tablist'>" + gameSection + "</div>";
                        specialSection = "<div class='list-group' role='tablist'>" + specialSection + "</div>";

                        var listTab = gameSection + specialSection;

                        $("#nav-tabContent").append(achievementList);
                        $("#side").append(listTab);

                        leaderboardTab(ign, achievementsDB, maxedGames);

                        $("#loading").html("");
                        $("#hidden").fadeIn(500);
                        $("#footer").fadeIn(500);
                    });
                });

            }

            // Leaderboard tab
            function leaderboardTab(ign, achievementsDB, maxedGames) {
                ignObj = {"ign": ign, "achievements": achievementsDB, "uuid": JSON.parse(response)[12], "maxed": maxedGames};
                $.post("updateLeaderboard.php", JSON.stringify(ignObj), function (users) {
                    ignObj = {"ign": ign, "game": "all", "num": 250};
                    $.post("displayLeaderboard.php", JSON.stringify(ignObj), function (users) {

                        users = JSON.parse(users);

                        var head = "";

                        head += "<tr>";
                        head += "   <th scope='col'>#</th>";
                        head += "   <th scope='col'>Username</th>";
                        head += "   <th scope='col'>Achievement Points</th>";
                        head += "</tr>";

                        $("#thead").html(head);

                        for (index in users[0]) {
                            var record = "";

                            if (users[0][index].ign == ign) {
                                if (lightmode === "dark") {
                                    record += "<tr class='table-active dark'>";
                                } else {
                                    record += "<tr class='table-active'>";
                                }
                            } else {
                                record += "<tr>";
                            }

                            if (index == 0) {
                                record += "<th scope='row'><i class='fa fa-trophy' style='color: gold;' title='#1 Quester'></i> " + parseInt(parseInt(index)+1) + "</th>";
                            } else if (index == 1) {
                                record += "<th scope='row'><i class='fa fa-trophy' style='color: silver;' title='#2 Quester'></i> " + parseInt(parseInt(index)+1) + "</th>";
                            } else if (index == 2) {
                                record += "<th scope='row'><i class='fa fa-trophy' style='color: #A67D3D;' title='#3 Quester'></i> " + parseInt(parseInt(index)+1) + "</th>";
                            } else {
                                record += "<th scope='row'>" + parseInt(parseInt(index)+1) + "</th>";
                            }

                            if (users[0][index].ign == ign) {
                                record +=    "<td><a href='https://notifly.zone/achievements/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                            } else {
                                record +=    "<td><a href='https://notifly.zone/achievements/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                            }

                            if (totalPointsObject["all"] == users[0][index].points) {
                                record += "<td><i><b>" + users[0][index].points + "</b></i></td>" + "</tr>";
                            } else {
                                record += "<td>" + users[0][index].points + "</td>" + "</tr>";
                            }
                            $("#tbody").append(record);

                        }

                        var alert = "";
                        alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " ap</span> in <span class='badge badge-pill badge-dark'>All games</span></div>";
                        $("#alert-overall").append(alert);

                    });
                });
            }

        });

    });

    $("#search").on("keyup input", function() {
        var value = $(this).val().toUpperCase();
        $("#tbody tr").filter(function() {
            $(this).toggle($(this).text().toUpperCase().indexOf(value) > -1)
        });
    });

    $(".games").on("click", function() {
        var game = $(this).attr("id");
        if (game == "all") {
            ignObj = {"ign": ign, "game": game, "num": 250};
        } else {
            ignObj = {"ign": ign, "game": game, "num": 100};
        }

        $("#tableLoad").html("<div style='width: 100%; height: 100px;'><div style=''><i id='spinner' class='fa fa-angellist fa-spin fa-2x fa-fw'></i></div></div>");

        var head = "";
        head += "<tr>";
        head += "   <th scope='col'>#</th>";
        head += "   <th scope='col'>Username</th>";
        if (game == "maxed") {
            head += "   <th scope='col'>Maxed Games</th>";
        } else {
            head += "   <th scope='col'>Achievement Points</th>";
        }
        head += "</tr>";

        $.post("displayLeaderboard.php", JSON.stringify(ignObj), function (users) {
            $("#thead").html(head);
            $("#tbody").html("");
            if (users != "") {
                users = JSON.parse(users);

                for (var index=0;index<users[0].length;index++) {
                    var record = "";

                    if (users[0][index].ign == ign) {
                        if (lightmode === "dark") {
                            record += "<tr class='table-active dark'>";
                        } else {
                            record += "<tr class='table-active'>";
                        }
                    } else {
                        record += "<tr>";
                    }

                    if (index == 0) {
                        record += "<th scope='row'><i class='fa fa-trophy' style='color: gold;' title='#1 AP Hunter'></i> " + parseInt(parseInt(index)+1) + "</th>";
                    } else if (index == 1) {
                        if (users[0][0].points == users[0][index].points) {
                            record += "<th scope='row'><i class='fa fa-trophy' style='color: gold;' title='#1 AP Hunter'></i> " + parseInt(parseInt(0)+1) + "</th>";
                        } else {
                            record += "<th scope='row'><i class='fa fa-trophy' style='color: silver;' title='#2 AP Hunter'></i> " + parseInt(parseInt(index)+1) + "</th>";
                        }
                    } else if (index == 2) {
                        if (users[0][0].points == users[0][index].points) {
                            record += "<th scope='row'><i class='fa fa-trophy' style='color: gold;' title='#1 AP Hunter'></i> " + parseInt(parseInt(0)+1) + "</th>";
                        } else {
                            record += "<th scope='row'><i class='fa fa-trophy' style='color: #A67D3D;' title='#3 AP Hunter'></i> " + parseInt(parseInt(index)+1) + "</th>";
                        }
                    } else {
                        if (users[0][index].points == users[0][0].points) {
                            record += "<th scope='row'><i class='fa fa-trophy' style='color: gold;' title='#1 AP Hunter'></i> " + parseInt(parseInt(0)+1) + "</th>";
                        } else {
                            record += "<th scope='row'>" + parseInt(parseInt(index)+1) + "</th>";
                        }
                    }

                    if (users[0][index].ign == ign) {
                        record +=    "<td><a href='https://notifly.zone/achievements/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                    } else {
                        record +=    "<td><a href='https://notifly.zone/achievements/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                    }

                    if (totalPointsObject[game] == users[0][index].points) {
                        record += "<td><i><b>" + users[0][index].points + "</b></i></td>" + "</tr>";
                    } else {
                        record += "<td>" + users[0][index].points + "</td>" + "</tr>";
                    }

                    $("#tbody").append(record);

                }
                var alert = "";

                if (users[1] != null) {
                    if (game == "maxed") {
                        if (users[2] == 0) {
                            alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are not placed as you have completed the achievements of <span class='badge badge-pill badge-dark'>0</span> games</div>";
                        } else {
                            alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " games maxed</span></div>";
                        }
                    } else {
                        alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " ap</span> in <span class='badge badge-pill badge-dark'>" + getEnGameNames(game) + "</span></div>";
                    }
                } else {
                    if (game == "maxed") {
                        alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are not placed as you have completed the achievements of <span class='badge badge-pill badge-dark'>0</span> games</div>";
                    } else {
                        alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are not placed as you have completed <span class='badge badge-pill badge-dark'>0</span> achievements in <span class='badge badge-pill badge-dark'>" + getEnGameNames(game) + "</span></div>";
                    }
                }

                $("#alert-overall").html(alert);
            }
        });
    });

    if ($('#back-to-top').length) {
        var scrollTrigger = 100, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $('#back-to-top').addClass('show');
                } else {
                    $('#back-to-top').removeClass('show');
                }
            };
        backToTop();
        $(window).on('scroll', function () {
            backToTop();
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    }

    $('body').on('click', '.list-group a', function() {
        // removes active class from all other list-groups
        $(this).parent().parent().children().children(".active").removeClass("active");
    });

    $("body").on("click", "a.game", function() {
        gameFilter = $(this).attr("game");
        getRadios();
        applyFilters();
    });

    function applyFilters() {
        var found = 0;
        if (radioProgress == "Both" && radioType == "Both") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                found = 1;
                $(this).show();
            });
        } else if (radioProgress == "Completed" && radioType == "Both") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if ($(this).html().includes("badge-warning") || $(this).html().includes("badge-danger")) {
                    $(this).hide();
                } else {
                    found = 1;
                    $(this).show($(this).html().includes("success"));
                }
            });
        } else if (radioProgress == "Uncompleted" && radioType == "Both") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if ($(this).html().includes("badge-danger") || $(this).html().includes("badge-warning")) {
                    $(this).show();
                    found = 1;
                } else {
                    $(this).hide();
                }
            });
        } else if (radioProgress == "Both" && radioType == "One Time") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if ($(this).html().includes(">5") && $(this).html().includes(">10")) {
                    $(this).hide();
                } else {
                    found = 1;
                    $(this).show();
                }
            });
        } else if (radioProgress == "Completed" && radioType == "One Time") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if (!($(this).html().includes(">5") && $(this).html().includes(">10")) && !($(this).html().includes("badge-danger") || $(this).html().includes("badge-warning"))) {
                    $(this).show();
                    found = 1;
                } else {
                    $(this).hide();
                }
            });
        } else if (radioProgress == "Uncompleted" && radioType == "One Time") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if (($(this).html().includes("badge-danger") || $(this).html().includes("badge-warning")) && !($(this).html().includes(">5") && $(this).html().includes(">10"))) {
                    $(this).show();
                    found = 1;
                } else {
                    $(this).hide();
                }
            });
        } else if (radioProgress == "Both" && radioType == "Tiered") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if ($(this).html().includes(">5") && $(this).html().includes(">10")) {
                    $(this).show();
                    found = 1;
                } else {
                    $(this).hide();
                }
            });
        } else if (radioProgress == "Completed" && radioType == "Tiered") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if ($(this).html().includes(">5") && $(this).html().includes(">10") && !(($(this).html().includes("badge-warning") || $(this).html().includes("badge-danger")))) {
                    $(this).show();
                    found = 1;
                } else {
                    $(this).hide();
                }
            });
        } else if (radioProgress == "Uncompleted" && radioType == "Tiered") {
            $("#" + gameFilter + "-table > tbody > tr").filter(function() {
                if ($(this).html().includes(">5") && $(this).html().includes(">10") && ($(this).html().includes("badge-warning") || $(this).html().includes("badge-danger"))) {
                    $(this).show();
                    found = 1;
                } else {
                    $(this).hide();
                }
            });
        }
        if (found == 0) {
            $("#" + gameFilter + "-noresults").show();
        } else {
            $("#" + gameFilter + "-noresults").hide();
        }
    }

    function getRadios() {
        if ($("#filterProgressBoth").is(':checked')) {
            radioProgress = "Both";
        } else if ($("#filterProgressCompleted").is(':checked')) {
            radioProgress = "Completed";
        } else if ($("#filterProgressUncompleted").is(':checked')) {
            radioProgress = "Uncompleted";
        }

        if ($("#filterTypeBoth").is(':checked')) {
            radioType = "Both";
        } else if ($("#filterTypeOnetime").is(':checked')) {
            radioType = "One Time";
        } else if ($("#filterTypeTiered").is(':checked')) {
            radioType = "Tiered";
        }
    }

    $(".filters .form-check-input").on("change", function() {
        getRadios();
        applyFilters();
    });

    $("#pointsRadio").on("change", function() {
        $.each(percentageObject, function(game, values) {
            $("#"+game+"-percentage").html(values.pointsPercentage + "% (" + values.points + "/" + values.totalPoints + ")");
            $("#"+game+"-bar").css("width", values.pointsPercentage + "%");
            $("#"+game+"-bar").css("background-color", getPercentageColour(values.points/values.totalPoints));
        });
    });

    $("#achievementsRadio").on("change", function() {
        $.each(percentageObject, function(game, values) {
            $("#"+game+"-percentage").html(values.achievementsPercentage + "% (" + values.achievementsDone + "/" + values.achievementsTotal + ")");
            $("#"+game+"-bar").css("width", values.achievementsPercentage + "%");
            $("#"+game+"-bar").css("background-color", getPercentageColour(values.achievementsDone/values.achievementsTotal));
        });
    });

});

function getPercentageColour(percentage) {

    var colour = "rgb(";

    var colour1 = "rgb(140,190,167)"; // 1st
    var colour2 = "rgb(28,110,140)"; // 2nd
    var colour3 = "rgb(170,80,170)"; // 3rd

    var val1 = 0;
    var val2 = 0;

    var range = 0;

    var reg = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/m;

    var sel1 = "";
    var sel2 = "";

    if (percentage < 0.5) {
        percentage = (percentage*2);
        sel1 = colour1;
        sel2 = colour2;
    } else {
        percentage = (percentage-0.5)*2;
        sel1 = colour2;
        sel2 = colour3;
    }

    for (var i=1;i<4;i++) {
        val1 = parseInt(sel1.match(reg)[i]);
        val2 = parseInt(sel2.match(reg)[i]);
        range = Math.abs(val1-val2);
        if (i==1) {
            if (val1 > val2) {
                colour += val1 - Math.floor(range*percentage);
            } else {
                colour += val1 + Math.floor(range*percentage);
            }
        } else {
            if (val1 > val2) {
                colour += "," + parseInt(val1 - Math.floor(range*percentage));
            } else {
                colour += "," + parseInt(val1 + Math.floor(range*percentage));
            }
        }
    }
    colour += ")";

    return colour;
}

function getEnGameNames(game_id) {

    var enGameName = "";

    switch(game_id) {
        case "arcade":
            enGameName = "Arcade";
            break;
        case "arena":
            enGameName = "Arena Brawl";
            break;
        case "bedwars":
            enGameName = "Bedwars";
            break;
        case "blitz":
            enGameName = "Blitz";
            break;
        case "copsandcrims":
            enGameName = "Cops and Crims";
            break;
        case "truecombat":
            enGameName = "Crazy Walls";
            break;
        case "walls3":
            enGameName = "Mega Walls";
            break;
        case "murdermystery":
            enGameName = "Murder Mystery";
            break;
        case "paintball":
            enGameName = "Paintball";
            break;
        case "quake":
            enGameName = "Quakecraft";
            break;
        case "skyclash":
            enGameName = "Skyclash";
            break;
        case "skywars":
            enGameName = "Skywars";
            break;
        case "skyblock":
            enGameName = "Skyblock";
            break;
        case "supersmash":
            enGameName = "Smash Heroes";
            break;
        case "speeduhc":
            enGameName = "Speed UHC";
            break;
        case "gingerbread":
            enGameName = "Turbo Kart Racers";
            break;
        case "tntgames":
            enGameName = "TNT Games";
            break;
        case "uhc":
            enGameName = "UHC";
            break;
        case "vampirez":
            enGameName = "Vampire Z";
            break;
        case "walls":
            enGameName = "Walls";
            break;
        case "warlords":
            enGameName = "Warlords";
            break;
        case "buildbattle":
            enGameName = "Build battle";
            break;
        case "duels":
            enGameName = "Duels";
            break;
        case "skyblock":
            enGameName = "Skyblock";
            break;
        case "prototype":
            enGameName = "The Pit";
            break;
        case "general":
            enGameName = "General";
            break;
        case "easter":
            enGameName = "Easter";
            break;
        case "halloween2017":
            enGameName = "Halloween";
            break;
        case "christmas2017":
            enGameName = "Christmas";
            break;
        case "maxed":
            enGameName = "Games Maxed";
            break;
        case "housing":
            enGameName = "Housing";
            break;
        default:
            enGameName = game_id

    }

    return enGameName;
}

function getColour(game) {

    var colour = "";

    switch (game) {

        case "skywars":
            colour = "5D8AA8";
            break;
        case "skyblock":
            colour = "8ECDAC";
            break;
        case "warlords":
            colour = "87A96B";
            break;
        case "prototype":
            colour = "7FFFD4";
            break;
        case "quake":
            colour = "E9D66B";
            break;
        case "walls3":
            colour = "FF9966";
            break;
        case "truecombat":
            colour = "89CFF0";
            break;
        case "walls":
            colour = "F4C2C2";
            break;
        case "hungergames":
            colour = "5F5FFC";
            break;
        case "vampirez":
            colour = "DE5D83";
            break;
        case "tntgames":
            colour = "BF94E4";
            break;
        case "gingerbread":
            colour = "FFC1CC";
            break;
        case "paintball":
            colour = "E97451";
            break;
        case "copsandcrims":
            colour = "A3C1AD";
            break;
        case "arena":
            colour = "007BA7";
            break;
        case "arcade":
            colour = "E4D00A";
            break;
        case "skyclash":
            colour = "738678";
            break;
        case "bedwars":
            colour = "986960";
            break;
        case "murdermystery":
            colour = "BDB76B";
            break;
        case "supersmash":
            colour = "734F96";
            break;
        case "buildbattle":
            colour = "EDC9AF";
            break;
        case "duels":
            colour = "C0C0C0";
            break;
        case "uhc":
            colour = "CD5C5C";
            break;
        case "speeduhc":
            colour = "B2C1FF";
            break;
        default:
            colour = "F0F0F0";

    }

    return colour;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function darkmode() {
    if (localStorage.getItem('mode') === 'dark') {
        $("body").addClass('dark');
        $("table").addClass('table-dark');
        $(".nav-link active").addClass('dark');
        $(".modal-content").addClass('dark');
        $(".dropdown-menu").addClass('dark');
        $(".dropdown-item").addClass('dark');
        $(".nav-link.active").addClass('dark');
        $("#darkmode").removeClass('btn-outline-dark');
        $("#darkmode").addClass('btn-outline-light');
        $("#darkmode").html("Light Mode");
        $(".form-control").addClass('dark');

        // Apply the grey theme
        Highcharts.setOptions({
            colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
    '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
            chart: {
                backgroundColor: '#2a2a2b',
                style: {
                    fontFamily: '\'Unica One\', sans-serif'
                },
                plotBorderColor: '#606063'
            },
            title: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                }
            },
            subtitle: {
                style: {
                    color: '#E0E0E3',
                    textTransform: 'uppercase'
                }
            },
            xAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                title: {
                    style: {
                        color: '#A0A0A3'

                    }
                }
            },
            yAxis: {
                gridLineColor: '#707073',
                labels: {
                    style: {
                        color: '#E0E0E3'
                    }
                },
                lineColor: '#707073',
                minorGridLineColor: '#505053',
                tickColor: '#707073',
                tickWidth: 1,
                title: {
                    style: {
                        color: '#A0A0A3'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                style: {
                    color: '#F0F0F0'
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        color: '#F0F0F3',
                        style: {
                            fontSize: '13px'
                        }
                    },
                    marker: {
                        lineColor: '#333'
                    }
                },
                boxplot: {
                    fillColor: '#505053'
                },
                candlestick: {
                    lineColor: 'white'
                },
                errorbar: {
                    color: 'white'
                }
            },
            legend: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                itemStyle: {
                    color: '#E0E0E3'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                },
                title: {
                    style: {
                        color: '#C0C0C0'
                    }
                }
            },
            credits: {
                style: {
                    color: '#666'
                }
            },
            labels: {
                style: {
                    color: '#707073'
                }
            },
            drilldown: {
                activeAxisLabelStyle: {
                    color: '#F0F0F3'
                },
                activeDataLabelStyle: {
                    color: '#F0F0F3'
                }
            },
            navigation: {
                buttonOptions: {
                    symbolStroke: '#DDDDDD',
                    theme: {
                        fill: '#505053'
                    }
                }
            },
            // scroll charts
            rangeSelector: {
                buttonTheme: {
                    fill: '#505053',
                    stroke: '#000000',
                    style: {
                        color: '#CCC'
                    },
                    states: {
                        hover: {
                            fill: '#707073',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: '#000003',
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        }
                    }
                },
                inputBoxBorderColor: '#505053',
                inputStyle: {
                    backgroundColor: '#333',
                    color: 'silver'
                },
                labelStyle: {
                    color: 'silver'
                }
            },
            navigator: {
                handles: {
                    backgroundColor: '#666',
                    borderColor: '#AAA'
                },
                outlineColor: '#CCC',
                maskFill: 'rgba(255,255,255,0.1)',
                series: {
                    color: '#7798BF',
                    lineColor: '#A6C7ED'
                },
                xAxis: {
                    gridLineColor: '#505053'
                }
            },
            scrollbar: {
                barBackgroundColor: '#808083',
                barBorderColor: '#808083',
                buttonArrowColor: '#CCC',
                buttonBackgroundColor: '#606063',
                buttonBorderColor: '#606063',
                rifleColor: '#FFF',
                trackBackgroundColor: '#404043',
                trackBorderColor: '#404043'
            }
        });

    } else {
        $("body").removeClass('dark');
        $("table").removeClass('table-dark');
        $(".nav-link active").removeClass('dark');
        $(".modal-content").removeClass('dark');
        $(".dropdown-menu").removeClass('dark');
        $(".dropdown-item").removeClass('dark');
        $(".nav-link.active").removeClass('dark');
        $("#darkmode").removeClass('btn-outline-light');
        $("#darkmode").addClass('btn-outline-dark');
        $("#darkmode").html("Dark Mode");
        $(".form-control").removeClass('dark');
    }
}

function getRankColour(rankColour) {
    var colour = "";

    switch (rankColour) {
        case "BLACK":
            colour = "000000"
            break;
        case "DARK_GRAY":
            colour = "555555"
            break;
        case "DARK_PURPLE":
            colour = "AA00AA"
            break;
        case "DARK_GREEN":
            colour = "008000"
            break;
        case "DARK_RED":
            colour = "AA0000"
            break;
        case "PINK":
            colour = "FF55FF"
            break;
        case "WHITE":
            colour = "FFFFFF"
            break;
        case "BLUE":
            colour = "5555FF"
            break;
        case "YELLOW":
            colour = "FFFF55"
            break;
        case "GOLD":
            colour = "FFAA00"
            break;
        case "DARK_AQUA":
            colour = "00AAAA"
            break;
        default:
            colour = "FF5555"

    }

    return colour;
}

function convertData(data, firstLogin) {
    var startDay = data[0][0];
    var day = new Date();
    var endDay = day.getTime();

    isLastDay = startDay == endDay;
    dayTick = 1000 * 60 * 60 * 24;
    temp = [];

    //Create new array with 0 values for each day
    temp.push([startDay, 0])
    while(!isLastDay) {
        startDay += dayTick;
        temp.push([startDay, 0])

        isLastDay = startDay >= endDay;
    }

    //Override all values with existing days
    for (var i = 0; i < data.length; i++) {
        for(var j = 0; j < temp.length; j++) {
            if (temp[j][0] == data[i][0]) {
                temp[j][1] = data[i][1];
                break;
            }
        }
    }

    return temp
}

function getNetworkLevel(exp, newExp) {

    var BASE = 10000;
    var GROWTH = 2500;

    var HALF_GROWTH = 0.5 * GROWTH;

    var REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
    var REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
    var GROWTH_DIVIDES_2 = 2 / GROWTH;

    var totalExp = exp + newExp;
    return getLevel(totalExp);

    function getLevel(exp) {
        return exp < 0 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp));
    }

    function getExactLevel(exp) {
        return getLevel(exp) + getPercentageToNextLevel(exp);
    }

    function getExpFromLevelToNext(level) {
        return level < 1 ? BASE : GROWTH * (level - 1) + BASE;
    }

    function getTotalExpToLevel(level) {
        var lv = Math.floor(level);
        var x0 = getTotalExpToFullLevel(lv);
        if (level === lv) return x0;
        return (getTotalExpToFullLevel(lv + 1) - x0) * (level % 1) + x0;
    }

    function getTotalExpToFullLevel(level) {
        return (HALF_GROWTH * (level - 2) + BASE) * (level - 1);
    }

    function getPercentageToNextLevel(exp) {
        var lv = getLevel(exp);
        var x0 = getTotalExpToLevel(lv);
        return (exp - x0) / (getTotalExpToLevel(lv + 1) - x0);
    }
}

function getPercentageToNextLevel(exp, newExp) {

    var BASE = 10000;
    var GROWTH = 2500;

    var HALF_GROWTH = 0.5 * GROWTH;

    var REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
    var REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
    var GROWTH_DIVIDES_2 = 2 / GROWTH;

    var totalExp = exp + newExp;
    return getPercentageToNextLevel(exp);

    function getLevel(exp) {
        return exp < 0 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp));
    }

    function getExactLevel(exp) {
        return getLevel(exp) + getPercentageToNextLevel(exp);
    }

    function getExpFromLevelToNext(level) {
        return level < 1 ? BASE : GROWTH * (level - 1) + BASE;
    }

    function getTotalExpToLevel(level) {
        var lv = Math.floor(level);
        var x0 = getTotalExpToFullLevel(lv);
        if (level === lv) return x0;
        return (getTotalExpToFullLevel(lv + 1) - x0) * (level % 1) + x0;
    }

    function getTotalExpToFullLevel(level) {
        return (HALF_GROWTH * (level - 2) + BASE) * (level - 1);
    }

    function getPercentageToNextLevel(exp) {
        var lv = getLevel(exp);
        var x0 = getTotalExpToLevel(lv);
        return (exp - x0) / (getTotalExpToLevel(lv + 1) - x0);
    }
}

function getXPToNextLevel(exp, newExp) {

    var BASE = 10000;
    var GROWTH = 2500;

    var HALF_GROWTH = 0.5 * GROWTH;

    var REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
    var REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
    var GROWTH_DIVIDES_2 = 2 / GROWTH;

    var totalExp = exp + newExp;

    var XP_Progress = totalExp - getTotalExpToFullLevel(getLevel(totalExp));
    var value = getExpFromLevelToNext(getLevel(totalExp)) - XP_Progress;

    return value;

    function getLevel(exp) {
        return exp < 0 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp));
    }

    function getExactLevel(exp) {
        return getLevel(exp) + getPercentageToNextLevel(exp);
    }

    function getExpFromLevelToNext(level) {
        return level < 1 ? BASE : GROWTH * (level - 1) + BASE;
    }

    function getTotalExpToLevel(level) {
        var lv = Math.floor(level);
        var x0 = getTotalExpToFullLevel(lv);
        if (level === lv) return x0;
        return (getTotalExpToFullLevel(lv + 1) - x0) * (level % 1) + x0;
    }

    function getTotalExpToFullLevel(level) {
        return (HALF_GROWTH * (level - 2) + BASE) * (level - 1);
    }

    function getPercentageToNextLevel(exp) {
        var lv = getLevel(exp);
        var x0 = getTotalExpToLevel(lv);
        return (exp - x0) / (getTotalExpToLevel(lv + 1) - x0);
    }
}
