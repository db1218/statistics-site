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

    document.title = ign + " | Hypixel Questing Tool";

    $.get("https://api.hypixel.net/resources/quests", function (response) {

        questsInfo = response.quests;

        $.post("get_data.php", JSON.stringify(nameInputObj), function(response) {

            var quests = JSON.parse(response)[0];

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
            numQuestsCompleted = infoBox(quests, response);
            function infoBox(quests, response) {

                var rank = JSON.parse(response)[4];
                var rankColour = JSON.parse(response)[5];

                $("#heading").html(formatRank(JSON.parse(response)[4], JSON.parse(response)[5], JSON.parse(response)[6], JSON.parse(response)[7], JSON.parse(response)[8], JSON.parse(response)[9], JSON.parse(response)[10]));
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
                numQuestsCompleted = printNumQuests(quests);
                printLevel(response);
                printAchievements(JSON.parse(response)[11]);

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

                    // Update Leaderboard
                    updateLeaderboard(numQuestsCompleted, ign);

                    function updateLeaderboard(numQuestsCompleted, ign) {
                        ignQuestsObj = {"ign": ign, "quests": [["all", numQuestsCompleted]], "uuid": JSON.parse(response)[12]}
                        $.post("updateLeaderboard.php", JSON.stringify(ignQuestsObj));
                    }

                    var card="";
                    if (lightmode === 'dark') {
                        card += "<div class='card border-default mb-3 dark'>";
                    } else {
                        card += "<div class='card border-default mb-3'>";
                    }
                    card += "	<div id='info' class='card-body row text-center'>";
                    card += "		<div class='col-sm'>Quests Completed <span class='badge badge-pill badge-secondary'>" + numQuestsCompleted + "</span></div>";
                    card += "	</div>";
                    card += "</div>";

                    $("#gen").html(card);

                    return numQuestsCompleted;

                } // Loops through all quests and totals them - returns num of quests

                function printLevel(response) {
                    var exp = JSON.parse(response)[1];
                    var newExp = JSON.parse(response)[2];

                    var card = "";
                    if (lightmode === 'dark') {
                        card += "<div class='card border-default mb-3 dark'>";
                    } else {
                        card += "<div class='card border-default mb-3'>";
                    }
                    card += "	<div id='info' class='card-body'>";
                    card += "		<p>Progress to next level</p>";
                    if (lightmode === "dark") {
                        card += "		<div class='progress dark'>";
                    } else {
                        card += "		<div class='progress'>";
                    }
                    var percentage = getPercentageToNextLevel(exp, newExp);
                    var colour = getPercentageColour(percentage);
                    if (percentage*100 >= 20) {
                        card += "       <div class='progress-bar progress-bar-striped bg' role='progressbar' style='width: " + (percentage * 100) + "%; background-color: " + colour + "' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'>"+ Math.floor(getPercentageToNextLevel(exp, newExp) * 100) + "% (" + getXPToNextLevel(exp, newExp).toLocaleString() + " xp)</div>";
                    } else {
                        card += "       <div class='progress-bar progress-bar-striped bg' role='progressbar' style='width: " + (percentage * 100) + "%; background-color: " + colour + "' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'>"+ Math.floor(getPercentageToNextLevel(exp, newExp) * 100) + "%</div>";
                    }
                    card += "		</div>";
                    card += "	</div>";
                    card += "</div>";

                    $("#gen").append(card);

                    var level = "<div class='col-sm'>Network Level <span class='badge badge-pill badge-secondary'>" + getNetworkLevel(exp, newExp) + "</span></div>";
                    $("#info").append(level);

                }

                function printAchievements(achievementPoints) {
                    if (achievementPoints != null) {
                        if (lightmode === "dark") {
                            var level = "<div class='col-sm'><a href='/achievements/" + ign + "' style='color:#c1c1c1;'><u class='dark'>Achievement Points</u> <span class='badge badge-pill badge-secondary'>" + achievementPoints + "</a></span></div>";
                        } else {
                            var level = "<div class='col-sm'><a href='/achievements/" + ign + "' style='color:#212529;'><u>Achievement Points</u> <span class='badge badge-pill badge-secondary'>" + achievementPoints + "</a></span></div>";
                        }
                        $("#info").append(level);
                    }
                }

                return numQuestsCompleted;

            }

            // Daily & Weekly tabs
            var questList = questTabs(questsInfo, quests);
            function questTabs(questsInfo, questsAPI) {

                totalQuestsPossible = 0;
                questsDoneToday = 0;
                expEarntToday = 0;
                weeklyDoneToday = 0;

                //Put most info in object for each quest
                var questVars = constructQuestArray(questsAPI);

                function constructQuestArray(questsAPI) {

                    var questsList = [];
                    var questsObj = {};

                    $.each(questsAPI, function(keyID, value) {
                        // quests is player's api quest data
                        var questsGameObject = {};
                        questsGameObject.id = keyID;
                        questsGameObject.game = getQuestGames(keyID);

                        $.each(questsInfo, function(key, quests) {
                            $.each(quests, function(key1, quest) {
                                if (quest.id == keyID) {
                                    questsGameObject.name = quest.name;
                                    questsGameObject.colour = getColour(questsGameObject.game);
                                }
                            });
                        });

                        $.each(value, function(key, value) {
                            if (key === "completions") {
                                questsGameObject.completions = value.length;
                                questsGameObject.latest = value[value.length - 1];
                                questsGameObject.active = {};
                            } else if (key === "active") {
                                questsGameObject.active = value.objectives;
                            }
                        });
                        questsList.push(questsGameObject);
                        questsObj[questsGameObject.id] = questsGameObject;

                    });

                    return [questsObj, questsList];
                }

                populate(questsInfo, questVars[0], questVars[1]);

                function populate(questsInfo, questsAPI, questsList) {

                    //for each game
                    $.each(questsInfo, function(game, quests) {
                        //key = game, value = list of quests for game
                        if (game != "skyclash" && game != "speeduhc") {
                            newCard(game, quests, questsAPI);
                        }
                    });

                    // Game card
                    function newCard(game, questsInfo, questsAPI) {

                        var card = "";
                        if (lightmode === 'dark') {
                            card += "<div class='card dark'>";
                        } else {
                            card += "<div class='card'>";
                        }
                        card += "    <div class='card-body'>";
                        card += "        <h4 class='card-title'>" + getEnGameNames(game) + "</h4>";

                        var dailyCard = card + "<div id='accordion-" + game + "-daily' role='tablist' aria-multiselectable='true'>";
                        var weeklyCard = card + "<div id='accordion-" + game + "-weekly' role='tablist' aria-multiselectable='true'>";

                        // For each quest in game
                        $.each(questsInfo, function(key, questINFO) {

                            // Seperates daily and weekly quests
                            if (questINFO.name.includes("Daily") || questINFO.name.includes("Mythic")) {
                                totalQuestsPossible += 1;
                                if (lightmode === 'dark') {
                                    dailyCard += "        <div class='card dark1'>";
                                } else {
                                    dailyCard += "        <div class='card'>";
                                }
                                dailyCard += "            <div class='card-header justify-content-between d-flex' role='tab' id='heading-" + game + "-" + key + "-QUEST" + "'>";
                                dailyCard += "                <h5 class='mb-0'>";
                                dailyCard += "                    <a data-toggle='collapse' data-parent='#accordion-" + game + "-daily' href='#collapse-" + game + "-" + key + "-QUEST" + "' aria-expanded='false' aria-controls='collapse-" + game + "-" + key + "-QUEST" + "' class='collapsed'>";
                                property = questINFO.id;
                                questName = questINFO.name.match(/: ([a-zA-Z !(),0-9]*)/m);
                                dailyCard += questName[1];
                                dailyCard += "                    </a>";
                                dailyCard += "                </h5>";
                                if ($(questsAPI[property]).length && !jQuery.isEmptyObject(questsAPI[property].latest)) {
                                    if (doneToday(questsAPI[property].latest.time) == "Not done") {
                                        if (jQuery.isEmptyObject(questsAPI[property].active)) {
                                            //Quest not started
                                            dailyCard += "    <span id='" + game + "-" + key + "-danger' class='badge badge-danger badge-pill'><i class='fa fa-times' aria-hidden='true'></i></span>";
                                        } else {
                                            // quest started
                                            dailyCard += "    <span id='" + game + "-" + key + "-warning' class='badge badge-warning badge-pill'><i class='fa fa-minus' aria-hidden='true'></i></span>";
                                        }
                                    } else {
                                        // if quest is fully completed
                                        dailyCard += "        <span id='" + game + "-" + key + "-success' class='badge badge-success badge-pill'><i class='fa fa-check' aria-hidden='true'></i></span>";
                                        expEarntToday += questINFO.rewards[0].amount;
                                        questsDoneToday += 1;
                                    }
                                } else {
                                    dailyCard +="             <span id='" + game + "-" + key + "-danger' class='badge badge-danger badge-pill'><i class='fa fa-times' aria-hidden='true'></i></span>";
                                }
                                dailyCard += "            </div>";
                                dailyCard += "            <div id='collapse-" + game + "-" + key + "-QUEST" + "' class='collapse' role='tabpanel' aria-labelledby='heading-" + game + "-" + key + "-QUEST" + "' aria-expanded='false' style=''>";
                                dailyCard += "                <div class='card-block'>";

                                // For each objective in objectives
                                $.each(questINFO.objectives, function(objectiveKey, objectiveData) {

                                    var description = "";

                                    if (questINFO.description.includes("\n") && (questINFO.objectives.length > 1)) {
                                        description = questINFO.description.split("\n")[objectiveKey];
                                    } else {
                                        description = questINFO.description;
                                    }

                                    if (objectiveData.type == "IntegerObjective") {
                                        goal = objectiveData.integer
                                    } else {
                                        goal = 1;
                                    }

                                    // opening li tag
                                    if (lightmode === "dark") {
                                        dailyCard += "            <li class='list-group-item d-flex justify-content-between align-items-center info dark'>";
                                    } else {
                                        dailyCard += "            <li class='list-group-item d-flex justify-content-between align-items-center info'>";
                                    }

                                    // if done quest before
                                    if ($(questsAPI[property]).length && !jQuery.isEmptyObject(questsAPI[property].latest)) {

                                        // latest time completed quest
                                        var latest = questsAPI[property].latest.time;

                                        // if quest not done
                                        if (doneToday(latest) === "Not done") {
                                            if (jQuery.isEmptyObject(questsAPI[property].active)) {

                                                // print quest not started
                                                dailyCard += description + "<span class='badge badge-pill badge-danger'>0/" + goal + "</span>";
                                            } else {
                                                var objectiveID = Object.keys(questsAPI[property].active);

                                                var numMyObjectives = 0;
                                                $.each(questINFO.objectives, function() {
                                                    numMyObjectives++;
                                                });

                                                var numAPIObjectives = 0;
                                                $.each(questsAPI[property].active, function() {
                                                    numAPIObjectives++;
                                                });

                                                // if started both objectives
                                                if (numMyObjectives === numAPIObjectives) {

                                                    if (goal == questsAPI[property].active[objectiveData.id]) {
                                                        dailyCard += description + "<span class='badge badge-pill badge-success'>";
                                                        dailyCard += goal
                                                    } else {
                                                        if (lightmode === "dark") {
                                                            dailyCard += description + "<span class='badge badge-pill badge-warning dark'>";
                                                        } else {
                                                            dailyCard += description + "<span class='badge badge-pill badge-warning'>";
                                                        }

                                                        dailyCard += questsAPI[property].active[objectiveData.id]
                                                    }
                                                    dailyCard += "/" + goal + "</span>";


                                                } else {

                                                    if (objectiveID == objectiveData.id) {
                                                        dailyCard += description + "<span class='badge badge-pill badge-success'>";
                                                        dailyCard += goal;
                                                        dailyCard += "/" + goal + "</span>";
                                                    } else {
                                                        dailyCard += description + "<span class='badge badge-pill badge-danger'>";
                                                        dailyCard += 0;
                                                        dailyCard += "/" + goal + "</span>";
                                                    }

                                                }
                                            }
                                        } else {
                                            //Quest done
                                            dailyCard += description + "<span class='badge badge-pill badge-success' id=''>" + goal + "/" + goal + "</span>";

                                        }
                                    } else {
                                        // quest not done
                                        dailyCard += description + "<span class='badge badge-pill badge-danger' id=''>0/" + goal + "</span>";
                                    }

                                    dailyCard += "                </li>";
                                });

                                dailyCard += "                </div>";
                                dailyCard += "            </div>";
                                dailyCard += "        </div>";
                            } else if (questINFO.name.includes("Weekly") || questINFO.name.startsWith("Special")) {
                                if (lightmode === 'dark') {
                                    weeklyCard += "        <div class='card dark1'>";
                                } else {
                                    weeklyCard += "        <div class='card'>";
                                }
                                property = questINFO.id;
                                questIDNAME = property;
                                weeklyCard += "        <div id='progress-header-" + questIDNAME + "'>";
                                weeklyCard += "            <div class='card-header justify-content-between d-flex' role='tab' id='heading-" + game + "-" + key + "-WEEKLY-QUEST" + "'>";
                                weeklyCard += "                <h5 class='mb-0'>";
                                weeklyCard += "                    <a data-toggle='collapse' data-parent='#accordion-" + game + "-weekly' href='#collapse-" + game + "-" + key + "-WEEKLY-QUEST" + "' aria-expanded='false' aria-controls='collapse-" + game + "-" + key + "-WEEKLY-QUEST" + "' class='collapsed'>";
                                questName = questINFO.name.match(/: ([a-zA-Z !(),0-9]*)/m);
                                weeklyCard += questName[1];
                                weeklyCard += "                    </a>";
                                weeklyCard += "                </h5>";
                                weeklyCard += "            </div>";
                                weeklyCard += "        </div>";
                                weeklyCard += "       <div id='collapse-" + game + "-" + key + "-WEEKLY-QUEST" + "'  class='collapse' role='tabpanel' aria-labelledby='heading-" + game + "-" + key + "-WEEKLY-QUEST" + "' aria-expanded='false'>";
                                weeklyCard += "           <div class='card-block'>";

                                var percentage = 0;
                                var objectiveCounter = 0;

                                // For each objective in objectives
                                $.each(questINFO.objectives, function(objectiveKey, objectiveData) {

                                    var description = "";

                                    if (questINFO.description.includes("\n") && (questINFO.objectives.length > 1)) {
                                        description = questINFO.description.split("\n")[objectiveKey];
                                    } else {
                                        description = questINFO.description;
                                    }

                                    objectiveCounter++;

                                    if (objectiveData.type == "IntegerObjective") {
                                        goal = objectiveData.integer
                                    } else {
                                        goal = 1;
                                    }

                                    // opening li tag
                                    if (lightmode == "dark") {
                                        weeklyCard += "       <li class='list-group-item d-flex justify-content-between align-items-center info dark'>";
                                    } else {
                                        weeklyCard += "       <li class='list-group-item d-flex justify-content-between align-items-center info'>";
                                    }
                                    // if done quest before
                                    if ($(questsAPI[property]).length && ((!jQuery.isEmptyObject(questsAPI[property].latest)) || (!jQuery.isEmptyObject(questsAPI[property].active)))) {

                                        // if quest started for first time
                                        if (!jQuery.isEmptyObject(questsAPI[property].active)) {

                                            var objectiveID = Object.keys(questsAPI[property].active);

                                            var numMyObjectives = 0;
                                            $.each(questINFO.objectives, function() {
                                                numMyObjectives++;
                                            });

                                            var numAPIObjectives = 0;
                                            $.each(questsAPI[property].active, function() {
                                                numAPIObjectives++;
                                            });

                                            // if started both objectives
                                            if (numMyObjectives === numAPIObjectives) {

                                                // if completed
                                                if (goal == questsAPI[property].active[objectiveData.id]) {
                                                    weeklyCard += description + "<span class='badge badge-pill badge-success'>";
                                                    weeklyCard += goal;
                                                    percentage += 1;
                                                } else {
                                                    // not completed
                                                    if (lightmode === "dark") {
                                                        weeklyCard += description + "<span class='badge badge-pill badge-warning dark'>";
                                                    } else {
                                                        weeklyCard += description + "<span class='badge badge-pill badge-warning'>";
                                                    }
                                                    percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                    weeklyCard += questsAPI[property].active[objectiveData.id]
                                                }
                                                weeklyCard += "/" + goal + "</span>";

                                            } else {
                                                if (objectiveID == objectiveData.id) {
                                                    if (questsAPI[property].active[objectiveData.id] == goal) {
                                                        weeklyCard += description + "<span class='badge badge-pill badge-success'>";
                                                        weeklyCard += goal;
                                                        weeklyCard += "/" + goal + "</span>";
                                                        percentage += 1;
                                                    } else {
                                                        weeklyCard += description + "<span class='badge badge-pill badge-warning'>";
                                                        weeklyCard += questsAPI[property].active[objectiveData.id];
                                                        weeklyCard += "/" + goal + "</span>";
                                                        percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                    }

                                                } else {
                                                    if (questsAPI[property].active[objectiveData.id] == null) {
                                                        weeklyCard += description + "<span class='badge badge-pill badge-danger'>";
                                                        weeklyCard += 0;
                                                        weeklyCard += "/" + goal + "</span>";
                                                        percentage += 0;
                                                    } else {
                                                        if (questsAPI[property].active[objectiveData.id] == goal) {
                                                            weeklyCard += description + "<span class='badge badge-pill badge-success'>";
                                                            weeklyCard += goal;
                                                            weeklyCard += "/" + goal + "</span>";
                                                            percentage += 1;
                                                        } else {
                                                            weeklyCard += description + "<span class='badge badge-pill badge-warning'>";
                                                            weeklyCard += questsAPI[property].active[objectiveData.id];
                                                            weeklyCard += "/" + goal + "</span>";
                                                            percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                        }
                                                    }

                                                }

                                            }

                                        } else {
                                            // latest time completed quest
                                            var latest = questsAPI[property].latest.time;
                                            // if quest not done
                                            if (doneThisWeek(latest) == "Not done") {
                                                if (jQuery.isEmptyObject(questsAPI[property].active)) {
                                                    // print quest not started
                                                    weeklyCard += description + "<span class='badge badge-pill badge-danger'>0/" + goal + "</span>";
                                                } else {

                                                    var objectiveID = Object.keys(questsAPI[property].active);

                                                    var numMyObjectives = 0;
                                                    $.each(questINFO.objectives, function() {
                                                        numMyObjectives++;
                                                    });

                                                    var numAPIObjectives = 0;
                                                    $.each(questsAPI[property].active, function() {
                                                        numAPIObjectives++;
                                                    });

                                                    // if started both objectives
                                                    if (numMyObjectives === numAPIObjectives) {

                                                        // if completed
                                                        if (goal == questsAPI[property].active[objectiveData.id]) {
                                                            weeklyCard += description + "<span class='badge badge-pill badge-success'>";
                                                            weeklyCard += goal;
                                                            percentage += 1;
                                                        } else {
                                                            // not completed
                                                            if (lightmode === "dark") {
                                                                weeklyCard += description + "<span class='badge badge-pill badge-warning dark'>";
                                                            } else {
                                                                weeklyCard += description + "<span class='badge badge-pill badge-warning'>";
                                                            }
                                                            percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                            weeklyCard += questsAPI[property].active[objectiveData.id]
                                                        }
                                                        weeklyCard += "/" + goal + "</span>";

                                                    } else {

                                                        if (objectiveID == objectiveData.id) {
                                                            weeklyCard += description + "<span class='badge badge-pill badge-success'>";
                                                            weeklyCard += goal;
                                                            weeklyCard += "/" + goal + "</span>";
                                                            percentage += 1;
                                                        } else {
                                                            weeklyCard += description + "<span class='badge badge-pill badge-danger'>";
                                                            weeklyCard += 0;
                                                            weeklyCard += "/" + goal + "</span>";
                                                            percentage += 0;
                                                        }

                                                    }

                                                }
                                            } else {
                                                // quest done
                                                weeklyCard += description + "<span class='badge badge-pill badge-success' id=''>" + goal + "/" + goal + "</span>";
                                                percentage += 1;

                                            }
                                        }
                                    } else {
                                        // quest not done at all
                                        weeklyCard += description + "<span class='badge badge-pill badge-danger' id=''>0/" + goal + "</span>";
                                        percentage += 0;
                                    }
                                    weeklyCard += "           </li>";
                                });

                                weeklyCard += "           </div>";
                                weeklyCard += "       </div>";
                                weeklyCard += "       <div class='card-body'>";
                                if (lightmode === "dark") {
                                    weeklyCard += "		<div class='progress dark2'>";
                                } else {
                                    weeklyCard += "		<div class='progress'>";
                                }
                                percentage /= objectiveCounter;
                                if (percentage == 1) {
                                    weeklyCard += "           <div class='progress-bar progress-bar-striped bg-success' role='progressbar' style='width: " + 100 + "%'></div>";
                                    if (doneToday(questsAPI[property].latest.time) == "Done") {
                                        weeklyDoneToday += 1;
                                        expEarntToday += questINFO.rewards[0].amount;
                                    }
                                } else {
                                    weeklyCard += "           <div class='progress-bar progress-bar-striped bg-warning' role='progressbar' style='width: " + percentage*100 + "%'></div>";
                                }
                                weeklyCard += "           </div>";
                                weeklyCard += "       </div>";
                                weeklyCard += "   </div>";

                            }

                        });

                        dailyCard += "       </div>";
                        dailyCard += "   </div>";
                        dailyCard +="</div>";

                        $("#daily-quests").append(dailyCard);

                        weeklyCard += "       </div>";
                        weeklyCard += "   </div>";
                        weeklyCard +="</div>";
                        $("#weekly-quests").append(weeklyCard);

                    }

                }

                var weeklyText = "";

                if (weeklyDoneToday == 1) {
                    weeklyText = " (including " + 1 + " weekly quest)";
                } else if (weeklyDoneToday > 1) {
                    weeklyText = " (including " + weeklyDoneToday + " weekly quests)";
                }

                var alert = "<div style='text-align: center; border;' class='alert' style='background-color: #fffff;' role='alert'>You have done <span class='badge badge-pill badge-dark'><b>" + questsDoneToday + "</b> / " + totalQuestsPossible + "</span> daily quests today, that's  <span class='badge badge-pill badge-dark'>" + Math.round((questsDoneToday/totalQuestsPossible)*100) + "%</span>";
                alert += "<br>Earning a total of <span class='badge badge-pill badge-dark'><b>" + numberWithCommas(expEarntToday) + "</b></span> exp <i>" + weeklyText + "</i></div>";
                $("#alert-daily").append(alert);

                return questVars[1];

            }

            // Calendar tabs
            calendarTab(quests, questList);
            function calendarTab(quests, questList) {
                var formattedEventData = [];
                $.each(quests, function(quest, questData) {
                    if (questData.completions != null) {
                        for (var i = 0; i < questData.completions.length; i++) {

                            var offset = moment().format("Z");
                            offset = offset.substring(0, 3);

                            var start = questData.completions[i].time + (parseInt(offset)*3600000);

                            var colour = "#";
                            var game = "";
                            var questName = "";

                            $.each(questList, function(key, value) {
                                if (value.id == quest) {
                                    if (value.name != null) {
                                        questName = value.name.match(/: ([a-zA-Z !(),0-9]*)/m)[1];
                                        colour += value.colour;
                                        questName += " (" + getEnGameNames(value.game) + ")";
                                    } else {
                                        game = getEnQuestNames(value.id);
                                        colour += getColour(game);
                                        questName = "(Old) " + game.match(/: ([a-zA-Z !(),0-9]*)/m)[1]; //
                                        questName += " (" + getEnGameNames(game) + ")";
                                    }

                                }
                            });

                            formattedEventData.push({
                                title: questName,
                                start: start,
                                end: start+1,
                                color: colour
                            });

                        }

                    }
                });

                $('#calendar-div').fullCalendar({
                    themeSystem: 'bootstrap4',
                    header: {center: 'month,basicWeek'},
                    events: formattedEventData,
                    nowIndicator: true,
                    views: {
                        month: {
                            eventLimit: 6 // adjust to 6 only for agendaWeek/agendaDay
                        }
                    },
                    height: "auto",
                    aspectRatio: 1.2,
                    showNonCurrentDates: false,
                    timeFormat: 'HH:mm',
                    eventTextColor: 'black',
                    firstDay: 1
                })
            }

            $("#loading").html("");
            $("#hidden").fadeIn(500);
            $("#footer").fadeIn(500);

            // Leaderboard tab
            overalLeaderboardTab(ign, numQuestsCompleted);
            function overalLeaderboardTab(ign, numQuestsCompleted) {
                ignObj = {"ign": ign, "game": "all", "uuid": JSON.parse(response)[12], "num": 250};
                $.post("displayLeaderboard.php", JSON.stringify(ignObj), function (users) {

                    users = JSON.parse(users);

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
                            record +=    "<td><a href='/quests/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                        } else {
                            record +=    "<td><a href='/quests/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                        }


                        record += "<td>" + users[0][index].quests + "</td>" + "</tr>";
                        $("#tbody").append(record);

                    }

                    var alert = "";
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in <span class='badge badge-pill badge-dark'>All games</span></div>";
                    $("#alert-overall").append(alert);

                });
            }

            // Stats tab
            var expEarntMonth = 0
            statsTab(questList, quests, JSON.parse(response)[3], JSON.parse(response)[12], questsInfo);
            function statsTab(questList, quests, firstLogin, uuid, questsInfo) {

                gameStrings = ["skywars", "arcade", "vampirez", "walls3", "battleground", "quake",
                "walls", "hungergames", "tntgames", "gingerbread", "paintball", "supersmash", "mcgo", "truecombat",
                "arena", "uhc", "skyclash", "bedwars", "murdermystery", "buildbattle",
                "duels", "prototype", "speeduhc"];

                // Quests/Game
                stats1(questList, gameStrings)
                function stats1(questList, gameStrings) {
                    var questsAllGamesChart = Highcharts.chart('questsAllGamesChart', {
                        chart: {
                            type: 'pie',
                        },
                        title: {
                            text: 'Quests/Game'
                        },
                        series: [{
                            name: 'Quests',
                            colorByPoint: true,
                            data: []
                        }],
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: true,
                            buttons: {
                                contextButton: {
                                    menuItems: ['viewFullscreen', 'separator', 'downloadJPEG', 'downloadPNG']
                                }
                            }
                        }
                    });

                    var games = {};

                    for (gameIndex in gameStrings) {
                        games[gameStrings[gameIndex]] = 0;
                    }

                    for (index in questList) {
                        for (gameIndex in gameStrings) {
                            if (questList[index].game == gameStrings[gameIndex]) {
                                if (questList[index].completions != null) {
                                    games[gameStrings[gameIndex]] += questList[index].completions
                                }
                            }
                        }
                    }

                    var games2 = games;

                    var sortable = [];
                    for (var game in games2) {
                        sortable.push([game, games2[game]]);
                    }

                    ignQuestsObj = {"ign": ign, "quests": sortable, "uuid": JSON.parse(response)[12]}
                    $.post("updateLeaderboard.php", JSON.stringify(ignQuestsObj));

                    sortable.sort(function(a, b) {
                        return a[1] - b[1];
                    });

                    for (game in sortable) {
                        questsAllGamesChart.series[0].addPoint({name: getEnGameNames(sortable[game][0]), y: sortable[game][1]});
                    }
                }

                // Quests/Time
                questsPerMonth = stats2(quests, firstLogin, uuid, ign)
                function stats2(quests, firstLogin, uuid, ign) {

                    var questsPerDay = new Object();
                    var questsPerDay2 = new Object();
                    var questsPerMonth = new Object();

                    var monthNow = moment().tz('America/New_York').format('MM');
                    var yearNow = moment().tz('America/New_York').format('YYYY');
                    var thisMonth = yearNow + "-" + monthNow

                    // add quests to questsPerDay object
                    $.each(quests, function(key, value) {
                        if (value.completions != null) {
                            for (var i=0; i < value.completions.length; i++) {

                                // for calendar
                                var date = new Date(value.completions[i].time);

                                var dateString = date.getFullYear() + "-";
                                if ((date.getMonth()+1) < 10) {
                                    dateString += "0" + (date.getMonth()+1) + "-"
                                } else {
                                    dateString += (date.getMonth()+1) + "-"
                                }

                                if (date.getDate() < 10) {
                                    dateString += "0" + date.getDate()
                                } else {
                                    dateString += date.getDate()
                                }

                                var coolDate = new Date(dateString);
                                var coolDateString = coolDate.getTime();

                                if (coolDateString in questsPerDay2) {
                                    questsPerDay2[coolDateString] += 1
                                } else {
                                    questsPerDay2[coolDateString] = 1
                                }

                                // for record monthly quests
                                var convertedTime = moment(value.completions[i].time).tz('America/New_York').startOf('day');

                                var fullDateString = convertedTime.format('YYYY') + "-" + convertedTime.format('MM') + "-" + convertedTime.format('DD');
                                var monthDateString = convertedTime.format('YYYY') + "-" + convertedTime.format('MM');

                                var unix = convertedTime.format('x');

                                if (fullDateString in questsPerDay) {
                                    questsPerDay[fullDateString] += 1
                                } else {
                                    questsPerDay[fullDateString] = 1
                                }

                                if (monthDateString in questsPerMonth) {
                                    if (monthDateString == thisMonth) {
                                        $.each(questsInfo, function(key2, questINFO) {
                                            for (var i=0;i<questINFO.length;i++) {
                                                if (questINFO[i].id == key) {
                                                    expEarntMonth += questINFO[i].rewards[0].amount;
                                                }
                                            }
                                        });
                                    }
                                    questsPerMonth[monthDateString] += 1
                                } else {
                                    if (monthDateString == thisMonth) {
                                        $.each(questsInfo, function(key2, questINFO) {
                                            for (var i=0;i<questINFO.length;i++) {
                                                if (questINFO[i].id == key) {
                                                    expEarntMonth += questINFO[i].rewards[0].amount;
                                                }
                                            }
                                        });
                                    }
                                    questsPerMonth[monthDateString] = 1
                                }

                            }
                        }
                    });

                    var data2 = [];

                    $.each(questsPerMonth, function(key, value) {
                        data2.push([key, value])
                    });

                    data2 = data2.sort(sortFunctionTime);

                    function sortFunctionTime(a, b) {
                        if (a[0] === b[0]) {
                            return 0;
                        }
                        else {
                            return (a[0] < b[0]) ? -1 : 1;
                        }
                    }

                    var data = [];

                    $.each(questsPerDay2, function(key, value) {
                        data.push([parseInt(key), value])
                    });

                    data = convertData(data, firstLogin);

                    var questsAllGamesChart2 = Highcharts.stockChart('questsAllGamesChart2', {
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Quests/Time'
                        },
                        credits: {
                            enabled: false
                        },
                        subtitle: {
                            text: document.ontouchstart === undefined ?
                                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                        },
                        xAxis: {
                            type: 'datetime',
                            ordinal: false
                        },
                        yAxis: {
                            title: {
                                text: 'Quests'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataGrouping: {
                                    enabled: true,
                                    smoothed: true
                                }
                            },
                            area: {
                                fillColor: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 0
                                    },
                                    stops: [
                                        [0, Highcharts.getOptions().colors[0]],
                                        [1, '#2b908f50']
                                    ]
                                },
                                marker: {
                                    radius: 2
                                },
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 1
                                    }
                                },
                                threshold: 0
                            }
                        },
                        series: [{
                            type: 'area',
                            name: 'Quests',
                            data: data
                        }],
                        exporting: {
                            enabled: true,
                            buttons: {
                                contextButton: {
                                    menuItems: ['viewFullscreen', 'separator', 'downloadJPEG', 'downloadPNG']
                                }
                            }
                        }
                    });

                    monthlyOverall(data2, uuid, ign);
                    monthlyLeaderboardTab(data2, ign);

                    return data2;

                }

                // Quests/Month
                stats3(questsPerMonth)
                function stats3(questsPerMonth) {

                    var chart3 = Highcharts.chart('questsAllGamesChart3', {
                        chart: {
                            type: 'spline'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: true,
                            buttons: {
                                contextButton: {
                                    menuItems: ['viewFullscreen', 'separator', 'downloadJPEG', 'downloadPNG']
                                }
                            }
                        },
                        title: {
                            text: 'Quests/Month'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Quests'
                            }
                        },
                        xAxis: {
                            type: 'category',
                            title: {
                                text: 'Month'
                            }
                        },
                        tooltip: {
                            crosshairs: true
                        },
                        plotOptions: {
                            spline: {
                                marker: {
                                    radius: 4,
                                    lineColor: '#666666',
                                    lineWidth: 1
                                }
                            }
                        },
                        series: [{
                            name: "Quests",
                            data: questsPerMonth
                        }]
                    });

                }

                // Quests/Quest
                stats4(questList, gameStrings, questsInfo)
                function stats4(questList, gameStrings, questsInfo) {

                    var games = [];
                    var questName = "";
                    var questColour = "";

                    for (gameIndex in gameStrings) {
                        games.push({"name":getEnGameNames(gameStrings[gameIndex])});
                    }

                    // for each quest
                    for (index in questList) {
                        // for each game
                        for (gameIndex in gameStrings) {
                            // if correct game
                            if (questList[index].game == gameStrings[gameIndex]) {
                                // if quest has been completed before
                                if (questList[index].completions != null) {
                                    if (games[gameIndex].data == null) {
                                        games[gameIndex].data = [];
                                    }

                                    questName = questList[index].name;
                                    questColour = questList[index].colour;

                                    if (questList[index].name != null) {
                                        games[gameIndex].data.push({"name":questName, "value":questList[index].completions, "color":"#"+questColour});
                                    } else {
                                        games[gameIndex].data.push({"name":"(Old) "+getEnQuestNames(questList[index].id), "value":questList[index].completions, "color":"#"+getColour(questList[index].game)});
                                    }
                                }
                            }
                        }
                    }

                    var questsAllGamesChart4 = Highcharts.chart('questsAllGamesChart4', {
                        chart: {
                            type: 'packedbubble',
                            height: "auto"
                        },
                        title: {
                            text: 'Quests/Quest'
                        },
                        tooltip: {
                            useHTML: false,
                            pointFormat: '<b>{point.name}:</b> {point.value} quests'
                        },
                        plotOptions: {
                            packedbubble: {
                                minSize: '5',
                                maxSize: '50',
                                layoutAlgorithm: {
                                    splitSeries: false,
                                    gravitationalConstant: 0.02
                                },
                                dataLabels: {
                                    enabled: false
                                },
                            }
                        },
                        legend: {
                            title: {
                                text: "Games"
                            },
                            enabled: true,
                            align: 'left',
                            layout: 'vertical',
                            verticalAlign: 'middle',
                            adjustChartSize: true,
                            navigation: {
                            	enabled: false
                            }
                        },
                        series: games,
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: true,
                            buttons: {
                                contextButton: {
                                    menuItems: ['viewFullscreen', 'separator', 'downloadJPEG', 'downloadPNG']
                                }
                            }
                        }
                    });

                }

            }

            function monthlyOverall(monthQuest, uuid, ign) {

                uuidObj = {"uuid": uuid, "quests": monthQuest, "ign": ign}
                $.post("updateMonthlyOverallLeaderboard.php", JSON.stringify(uuidObj), function() {
                    idObj = {"uuid": uuid};
                    $.post("displayMonthlyOverallLeaderboard.php", JSON.stringify(idObj), function(users) {

                        users = JSON.parse(users);

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
                                record +=    "<td><a href='/quests/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                            } else {
                                record +=    "<td><a href='/quests/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                            }

                            record += "<td>" + users[0][index].quests + "</td>";
                            record += "<td>" + convertDate(users[0][index].month) + "</td>" + "</tr>";
                            $("#tbody-monthly-record").append(record);

                        }

                        var alert = "";
                        alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with a record of <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in the month of <span class='badge badge-pill badge-dark'>" + convertDate(users[3]) + "</span></div>";
                        $("#alert-monthly-record").append(alert);

                    });
                });

            }

            function monthlyLeaderboardTab(monthQuest, ign) {

                var monthNow = moment().tz('America/New_York').format('MM');
                var yearNow = moment().tz('America/New_York').format('YYYY');
                var thisMonth = yearNow + "-" + monthNow;
                var questsThisMonth = 0;

                // if they have done a quest this month
                if (monthQuest[monthQuest.length-1][0] == thisMonth) {
                    questsThisMonth = monthQuest[monthQuest.length-1][1];
                    ignQuestsObj = {"ign": ign, "quests": questsThisMonth};
                }

                // display monthly leaderboard
                ignObj = {"ign": ign, "uuid": JSON.parse(response)[12], thisMonth};
                $.post("displayMonthlyLeaderboard.php", JSON.stringify(ignObj), function(users) {

                    users = JSON.parse(users);

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
                            record +=    "<td><a href='/quests/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                        } else {
                            record +=    "<td><a href='/quests/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                        }


                        record += "<td>" + users[0][index].quests + "</td>" + "</tr>";
                        $("#tbody-monthly").append(record);

                    }

                    var alert = "";
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>";
                    alert += "   You are currently placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + questsThisMonth + " quests</span> this month,";
                    alert += "   earning a total of <span class='badge badge-pill badge-dark'>" + numberWithCommas(expEarntMonth) + "</span> exp";
                    alert += "</div>";
                    $("#alert-monthly").append(alert);

                });

            }

            yearlyLeaderboardTab(ign, "2020");
            function yearlyLeaderboardTab(ign, year) {
                var questsThisYear = 0;
                // display monthly leaderboard
                ignObj = {"ign": ign, "year": year};
                $.post("displayYearlyLeaderboard.php", JSON.stringify(ignObj), function(users) {
                    users = JSON.parse(users);
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
                            record +=    "<td><a href='/quests/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                        } else {
                            record +=    "<td><a href='/quests/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                        }

                        record += "<td>" + users[0][index].quests + "</td>";
                        $("#tbody-yearly").append(record);

                    }
                    var alert = "";
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>";
                    if (users[1] == 0) {
                        alert += "   You are not placed because you completed <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in <span class='badge badge-pill badge-dark'>" + year + "</span>";
                    } else {
                        alert += "   You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in <span class='badge badge-pill badge-dark'>" + year + "</span>";
                    }
                    alert += "</div>";
                    $("#alert-yearly").append(alert);
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

    $("#search-month").on("keyup input", function() {
        var value = $(this).val().toUpperCase();
        $("#tbody-monthly-record tr").filter(function() {
            $(this).toggle($(this).text().toUpperCase().indexOf(value) > -1)
        });
    });

    $("#search-year").on("keyup input", function() {
        var value = $(this).val().toUpperCase();
        $("#tbody-yearly tr").filter(function() {
            $(this).toggle($(this).text().toUpperCase().indexOf(value) > -1)
        });
    });

    $(".games").on("click", function() {
        var game = $(this).attr("id");
        if (game == "all") {
            ignObj = {"ign": ign, "game": game, "num": 250};
        } else {
            ignObj = {"ign": ign, "game": game, "num": 25};
        }

        // $("#tbody").html("");
        $("#tableLoad").html("<div style='width: 100%; height: 100px;'><div style=''><i id='spinner' class='fa fa-angellist fa-spin fa-2x fa-fw'></i></div></div>");

        $.post("displayLeaderboard.php", JSON.stringify(ignObj), function (users) {
            // $("#tableLoad").html("");
            $("#tbody").html("");
            if (users != "") {
                users = JSON.parse(users);
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
                        record +=    "<td><a href='/quests/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                    } else {
                        record +=    "<td><a href='/quests/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                    }

                    record += "<td>" + users[0][index].quests + "</td>" + "</tr>";
                    $("#tbody").append(record);

                }
                var alert = "";

                if (users[1] != null) {
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in <span class='badge badge-pill badge-dark'>" + getEnGameNames(game) + "</span></div>";
                } else {
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#" + "∞" + "</span> with <span class='badge badge-pill badge-dark'>" + 0 + " quests</span> in <span class='badge badge-pill badge-dark'>" + getEnGameNames(game) + "</span></div>";
                }

                $("#alert-overall").html(alert);
            }
        });
    });

    $("#yearly-loading").hide()
    $(".years").on("click", function() {
        var year = $(this).attr("id");
        ignObj = {"ign": ign, "year": year};
        $("#tbody-yearly").fadeOut(500);
        $("#yearly-loading").fadeIn(100);
        $.post("displayYearlyLeaderboard.php", JSON.stringify(ignObj), function(users) {
            $("#tbody-yearly").html("");
            users = JSON.parse(users);
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
                    record +=    "<td><a href='/quests/" + users[0][index].uuid + "'><b>" + users[0][index].ign + "</b></a></td>";
                } else {
                    record +=    "<td><a href='/quests/" + users[0][index].uuid + "'>" + users[0][index].ign + "</a></td>";
                }

                record += "<td>" + users[0][index].quests + "</td>";
                $("#tbody-yearly").append(record);

            }
            var alert = "";
            alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>";
            if (users[1] == 0) {
                alert += "   You are not placed because you completed <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in <span class='badge badge-pill badge-dark'>" + year + "</span>";
            } else {
                alert += "   You are placed <span class='badge badge-pill badge-dark'>#" + users[1] + "</span> with <span class='badge badge-pill badge-dark'>" + users[2] + " quests</span> in <span class='badge badge-pill badge-dark'>" + year + "</span>";
            }
            alert += "</div>";
            $("#yearly-loading").hide();
            $("#tbody-yearly").fadeIn(1000);
            $("#alert-yearly").html(alert);
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

});

function getPercentageColour(percentage) {

    var colour = "rgb(";

    var colour1 = "rgb(220,53,69)"; // red
    var colour2 = "rgb(255,193,7)"; // yellow
    var colour3 = "rgb(40,167,69)"; // green

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

function getEnQuestNames(quest_id) {

    var enQuestName = "";

    switch(quest_id) {
        case "uhc_daily":
            enQuestName = "Daily Quest: UHC Daily";
            break;
        case "bedwars_weekly_santa":
            enQuestName = "Weekly Quest: Santa";
            break;
        case "bedwars_daily_gifts":
            enQuestName = "Daily Quest: Gifts";
            break;
        case "bedwars_daily_nigthmaress":
            enQuestName = "Daily Quest: Nightmares";
            break;
        case "bedwars_weekly_pumpkinator":
            enQuestName = "Weekly Quest: Pumpkinator";
            break;
        case "space_mission":
            enQuestName = "Quest: Space Mission";
            break;
        case "tnt_addict":
            enQuestName = "Quest: TNT addict";
            break;
        case "blitz_special_daily_north_pole":
            enQuestName = "Daily Quest: Special North Pole";
            break;
        case "skywars_special_north_pole":
            enQuestName = "Daily Quest: Special North Pole";
            break;
        case "skywars_weekly_hard_chest":
            enQuestName = "Weekly Quest: Hard Chests";
            break;
        case "tnt_daily_play":
            enQuestName = "Daily Quest: Play";
            break;
        case "skywars_mega_doubles_wins":
            enQuestName = "Weekly Quest: Mega doubles wins";
            break;
        case "explosive_games":
            enQuestName = "Quest: Explosive Games!";
            break;
        case "skywars_halloween_harvest":
            enQuestName = "Daily Quest: Halloween Harvest";
            break;
        case "blitzerk":
            enQuestName = "Quest: Blitzerk";
            break;
        case "insane_brawler":
            enQuestName = "Daily Quest: Insane Brawler";
            break;
        case "normal_brawler":
            enQuestName = "Daily Quest: Normal Brawler";
            break;
        case "hunting_season":
            enQuestName = "Daily Quest: Hunting Season";
            break;
        case "megawaller":
            enQuestName = "Quest: Megawaller";
            break;
        case "uhc_addict":
            enQuestName = "Quest: Speed UHC Addict";
            break;
        case "bedwars_daily_nightmares":
            enQuestName = "Daily Quest: Nightmares";
            break;
        case "welcome_to_hell":
            enQuestName = "Quest: Welcome to Hell";
            break;
        case "serial_killer":
            enQuestName = "Quest: Serial Killer";
            break;
        case "nugget_warriors":
            enQuestName = "Quest: Nugget Warriors";
            break;
        case "warriors_journey":
            enQuestName = "Quest: Warriors Journey";
            break;
        case "warlords_win":
            enQuestName = "Daily Quest: Warlords Win";
            break;
        case "blitz_win_chaos":
            enQuestName = "Daily Quest: Chaos Win";
            break;
        case "bedwars_daily_gifts":
            enQuestName = "Daily Quest: Gifts";
            break;
        default:
            enQuestName = "Quest: idk"
    }

    return enQuestName;
}

function getQuestGames(key) {
    if (key.includes("skywars")) {
        return "skywars";
    } else if (key.includes("warlords")) {
        return "battleground";
    } else if (key.includes("prototype_pit_")) {
        return "prototype";
    } else if (key.includes("quake")) {
        return "quake";
    } else if (key.includes("mega_walls")) {
        return "walls3";
    } else if (key.includes("crazy")) {
        return "truecombat";
    } else if (key.includes("walls")) {
        return "walls";
    } else if (key.includes("blitz")) {
        return "hungergames";
    } else if (key.includes("vampirez")) {
        return "vampirez";
    } else if (key.includes("tnt")) {
        return "tntgames";
    } else if (key.includes("gingerbread")) {
        return "gingerbread";
    } else if (key.includes("paintball")) {
        return "paintball";
    } else if (key.includes("cvc")) {
        return "mcgo";
    } else if (key.includes("arena")) {
        return "arena";
    } else if (key.includes("arcade")) {
        return "arcade";
    } else if (key.includes("skyclash")) {
        return "skyclash";
    } else if (key.includes("bedwars")) {
        return "bedwars";
    } else if (key.includes("mm_")) {
        return "murdermystery";
    } else if (key.includes("supersmash")) {
        return "supersmash";
    } else if (key.includes("build")) {
        return "buildbattle";
    } else if (key.includes("duels")) {
        return "duels";
    } else if (key.includes("brawler")) {
        return "speeduhc";
    } else if (key.includes("hunting_season")) {
        return "speeduhc";
    } else if (key.includes("uhc_madness")) {
        return "speeduhc";
    } else if (key.includes("uhc_addict")) {
        return "speeduhc";
    } else if (key.includes("uhc")) {
        return "uhc";
    } else if (key.includes("explosive_games")) {
        return "tntgames";
    } else if (key.includes("megawaller")) {
        return "walls3";
    } else if (key.includes("waller")) {
        return "walls";
    } else if (key.includes("gladiator")) {
        return "arena";
    } else if (key.includes("space_mission")) {
        return "quake";
    }

}

function getEnGameNames(game_id) {

    var enGameName = "";

    switch(game_id) {
        case "arcade":
            enGameName = "Arcade";
            break;
        case "all":
            enGameName = "All Games";
            break;
        case "blitz":
            enGameName = "Blitz";
            break;
        case "arena":
            enGameName = "Arena Brawl";
            break;
        case "bedwars":
            enGameName = "Bedwars";
            break;
        case "hungergames":
            enGameName = "Blitz";
            break;
        case "crazy_walls":
            enGameName = "Crazy Walls";
            break;
        case "the_pit":
            enGameName = "The Pit";
            break;
        case "tnt":
            enGameName = "TNT Games";
            break;
        case "mega_walls":
            enGameName = "Mega Walls";
            break;
        case "murder_mystery":
            enGameName = "Murder Mystery";
            break;
        case "arena_brawl":
            enGameName = "Arena Brawl";
            break;
        case "build_battle":
            enGameName = "Build Battle";
            break;
        case "cvc":
            enGameName = "Cops and Crims";
            break;
        case "tkr":
            enGameName = "Turbo Kart Racers";
            break;
        case "warlords":
            enGameName = "Warlords";
            break;
        case "mcgo":
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
        case "speed_uhc":
            enGameName = "Speed UHC";
            break;
        case "supersmash":
            enGameName = "Smash Heroes";
            break;
        case "smash_heroes":
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
        case "battleground":
            enGameName = "Warlords";
            break;
        case "buildbattle":
            enGameName = "Build battle";
            break;
        case "duels":
            enGameName = "Duels";
            break
        case "prototype":
            enGameName = "The Pit";
            break
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
        case "battleground":
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
        case "crazywalls":
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
        case "mcgo":
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

function doneToday(questTime) {

    var questTimeObject = new Date(questTime);

    var dayQuest = moment(questTimeObject).tz('America/New_York').format('DD') // day of month of last quest EDT (SERVER)
    var dayNow = moment().tz('America/New_York').format('DD'); // day of month of today EDT (SERVER)

    var monthQuest = moment(questTimeObject).tz('America/New_York').format('MM'); // month of year of last quest EDT (SERVER)
    var monthNow = moment().tz('America/New_York').format('MM'); // month of year of today EDT (SERVER)

    var yearQuest = moment(questTimeObject).tz('America/New_York').format('YYYY'); // year of last quest EDT (SERVER)
    var yearNow = moment().tz('America/New_York').format('YYYY'); // year of today EDT (SERVER)

    if ((dayNow - dayQuest == 0) && (monthNow - monthQuest == 0) && (yearNow - yearQuest == 0)) {
        return "Done";
    } else {
        return "Not done";
    }
}

function doneThisWeek(GMT_timeLastQuest) {

    var EDT_timeLastQuest = GMT_timeLastQuest - 14400000;
    var EDT_currentTime = new Date().getTime();

    var date1 = new Date(EDT_timeLastQuest);
    var date2 = new Date(EDT_currentTime);

    if (date2 - date1 <= 604800000) {
        return "Done";
    } else {
        return "Not done";
    }
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

function convertDate(month) {
    var year = month.substring(0,4);
    var month = parseInt(month.substring(5,7));
    var output = "";

    switch(month) {
        case 1: output = "Jan";
            break;
        case 2: output = "Feb";
            break;
        case 3: output = "Mar";
            break;
        case 4: output = "Apr";
            break;
        case 5: output = "May";
            break;
        case 6: output = "Jun";
            break;
        case 7: output = "Jul";
            break;
        case 8: output = "Aug";
            break;
        case 9: output = "Sep";
            break;
        case 10: output = "Oct";
            break;
        case 11: output = "Nov";
            break;
        case 12: output = "Dec";
            break;
        }

    return output + " " + year;

}
