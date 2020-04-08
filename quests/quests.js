import {colourParser, getDisplayName} from "../Utilities/FormatName.js";
import {generateLeaderboard} from "../Utilities/GenerateLeaderboard.js";

$(function() {

    $('[data-toggle="tooltip"]').tooltip();

    const hash = window.location.hash;
    hash && $('ul.nav a[href="' + hash + '"]').tab('show');

    $('.nav-tabs a').click(function () {
       $(this).tab('show');
       var scrollmem = $('body').scrollTop();
       window.location.hash = this.hash;
       $('html,body').scrollTop(scrollmem);
    });

    darkmode();

    var lightmode = localStorage.getItem('mode');

    $("#darkmode").click(function() {
        localStorage.setItem('mode', (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark');
        location.reload();
    });

    $("#tab-menu .nav-link").on("click", function() {
        if (lightmode === "dark") {
            if ($(this).attr("aria-expanded") != null) {
                if ($(this).attr("aria-expanded") === "false") {
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
    });

    const ign = $("#ign").html().trim();

    document.title = `${ign} | Hypixel Questing Tool`;

    $.get("https://api.hypixel.net/resources/quests", function (response) {

        var questsInfo = response.quests;

        $.post("get_data.php", JSON.stringify({ign: ign}), function(response) {

            const resp = JSON.parse(response);
            const quests = resp.quests;

            $.post("getNames.php", JSON.stringify({uuid: resp.uuid, ign: resp.displayname}), function(names) {

                const namesParsed = JSON.parse(names);
                var namesString = namesParsed[0];
                for (let i=1; i<namesParsed.length; i++) {
                    namesString += ", " + namesParsed[i];
                }
                $("#heading").attr('data-original-title', namesString);
            });

            // Info box below name
            var numQuestsCompleted = infoBox(quests);
            function infoBox(quests) {

                const rankString = getDisplayName(resp.packageRank, resp.newPackageRank, resp.rankPlusColor, resp.displayname, resp.monthlyRankColor, resp.rank, resp.monthlyPackageRank);

                $("#heading").html(colourParser(rankString));

                // print quests
                printLevel();
                printAchievements(resp.achievementPoints);

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
                        $.post("updateLeaderboard.php", JSON.stringify({"ign": ign, "quests": [["all", numQuestsCompleted]], "uuid": resp.uuid}));
                    }

                    var card="";
                    card += `<div class='card border-default mb-3 ${lightmode === "dark" ? "dark" : ""}'>`;
                    card += "	<div id='info' class='card-body row text-center'>";
                    card += `\t\t<div class='col-sm'>Quests Completed <span class='badge badge-pill badge-secondary'>${numQuestsCompleted}</span></div>`;
                    card += "	</div>";
                    card += "</div>";

                    $("#gen").html(card);

                    return numQuestsCompleted;

                } // Loops through all quests and totals them - returns num of quests

                function printLevel() {
                    var exp = resp.networkExp;
                    var newExp = resp.networkLevel;

                    var card = "";
                    card += `<div class='card border-default mb-3 ${lightmode === "dark" ? "dark" : ""}'>`;
                    card += "	<div id='info' class='card-body'>";
                    card += "		<p>Progress to next level</p>";
                    card += `		<div class='progress ${lightmode === "dark" ? "dark" : ""}'>`;
                    var percentage = getPercentageToNextLevel(exp, newExp);
                    var colour = getPercentageColour(percentage);
                    if (percentage*100 >= 20) {
                        card += `       <div class='progress-bar progress-bar-striped bg' role='progressbar' style='width: ${percentage * 100}%; background-color: ${colour}' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'>${Math.floor(getPercentageToNextLevel(exp, newExp) * 100)}% (${getXPToNextLevel(exp, newExp).toLocaleString()} xp)</div>`;
                    } else {
                        card += `       <div class='progress-bar progress-bar-striped bg' role='progressbar' style='width: ${percentage * 100}%; background-color: ${colour}' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'>${Math.floor(getPercentageToNextLevel(exp, newExp) * 100)}%</div>`;
                    }
                    card += "		</div>";
                    card += "	</div>";
                    card += "</div>";

                    $("#gen").append(card);

                    var level = `<div class='col-sm'>Network Level <span class='badge badge-pill badge-secondary'>${getNetworkLevel(exp, newExp)}</span></div>`;
                    $("#info").append(level);

                }

                function printAchievements(achievementPoints) {
                    if (achievementPoints != null) {
                        $("#info").append(`<div class='col-sm'><a href='/achievements/"${ign}"' style='color:#c1c1c1;'><u class='${lightmode === "dark" ? "dark" : ""}'>Achievement Points</u> <span class='badge badge-pill badge-secondary'>"${achievementPoints}</a></span></div>`);
                    }
                }

                return printNumQuests(quests);

            }

            // Daily & Weekly tabs
            var questList = questTabs(questsInfo, quests);
            function questTabs(questsInfo, questsAPI) {

                var totalQuestsPossible = 0;
                var questsDoneToday = 0;
                var expEarntToday = 0;
                var weeklyDoneToday = 0;

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
                                if (quest.id === keyID) {
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

                populate(questsInfo, questVars[0]);

                function populate(questsInfo, questsAPI) {

                    //for each game
                    $.each(questsInfo, function(game, quests) {
                        //key = game, value = list of quests for game
                        if (game !== "skyclash" && game !== "speeduhc") {
                            newCard(game, quests, questsAPI);
                        }
                    });

                    // Game card
                    function newCard(game, questsInfo, questsAPI) {

                        var card = `<div class='card ${lightmode === "dark" ? "dark" : ""}'>`;
                        card += "    <div class='card-body'>";
                        card += `        <h4 class='card-title'>${getEnGameNames(game)}</h4>`;

                        var dailyCard = `${card}<div id='accordion-${game}-daily' role='tablist' aria-multiselectable='true'>`;
                        var weeklyCard = `${card}<div id='accordion-${game}-weekly' role='tablist' aria-multiselectable='true'>`;

                        // For each quest in game
                        $.each(questsInfo, function(key, questINFO) {

                            // Seperates daily and weekly quests
                            if (questINFO.name.includes("Daily") || questINFO.name.includes("Mythic")) {
                                totalQuestsPossible += 1;
                                dailyCard += `        <div class='card ${lightmode === "dark" ? "dark1" : ""}'>`;
                                dailyCard += `            <div class='card-header justify-content-between d-flex' role='tab' id='heading-${game}-${key}-QUEST'>`;
                                dailyCard += "                <h5 class='mb-0'>";
                                dailyCard += `                    <a data-toggle='collapse' data-parent='#accordion-${game}-daily' href='#collapse-${game}-${key}-QUEST' aria-expanded='false' aria-controls='collapse-${game}-${key}-QUEST' class='collapsed'>`;
                                var property = questINFO.id;
                                var questName = questINFO.name.match(/: ([a-zA-Z !(),0-9]*)/m);
                                dailyCard += questName[1];
                                dailyCard += "                    </a>";
                                dailyCard += "                </h5>";
                                if ($(questsAPI[property]).length && !jQuery.isEmptyObject(questsAPI[property].latest)) {
                                    if (doneToday(questsAPI[property].latest.time) === "Not done") {
                                        if (jQuery.isEmptyObject(questsAPI[property].active)) {
                                            //Quest not started
                                            dailyCard += `    <span id='${game}-${key}-danger' class='badge badge-danger badge-pill'><i class='fa fa-times' aria-hidden='true'></i></span>`;
                                        } else {
                                            // quest started
                                            dailyCard += `    <span id='${game}-${key}-warning' class='badge badge-warning badge-pill'><i class='fa fa-minus' aria-hidden='true'></i></span>`;
                                        }
                                    } else {
                                        // if quest is fully completed
                                        dailyCard += `        <span id='${game}-${key}-success' class='badge badge-success badge-pill'><i class='fa fa-check' aria-hidden='true'></i></span>`;
                                        expEarntToday += questINFO.rewards[0].amount;
                                        questsDoneToday += 1;
                                    }
                                } else {
                                    dailyCard +=`             <span id='${game}-${key}-danger' class='badge badge-danger badge-pill'><i class='fa fa-times' aria-hidden='true'></i></span>`;
                                }
                                dailyCard += "            </div>";
                                dailyCard += `            <div id='collapse-${game}-${key}-QUEST' class='collapse' role='tabpanel' aria-labelledby='heading-${game}-${key}-QUEST' aria-expanded='false' style=''>`;
                                dailyCard += "                <div class='card-block'>";

                                // For each objective in objectives
                                $.each(questINFO.objectives, function(objectiveKey, objectiveData) {

                                    var description;

                                    if (questINFO.description.includes("\n") && (questINFO.objectives.length > 1)) {
                                        description = questINFO.description.split("\n")[objectiveKey];
                                    } else {
                                        description = questINFO.description;
                                    }

                                    var goal = objectiveData.type === "IntegerObjective" ? objectiveData.integer : 1;

                                    // opening li tag
                                    dailyCard += `            <li class='list-group-item d-flex justify-content-between align-items-center info ${lightmode === "dark" ? "dark" : ""}'>`;

                                    // if done quest before
                                    if ($(questsAPI[property]).length && !jQuery.isEmptyObject(questsAPI[property].latest)) {

                                        // latest time completed quest
                                        var latest = questsAPI[property].latest.time;

                                        // if quest not done
                                        if (doneToday(latest) === "Not done") {
                                            if (jQuery.isEmptyObject(questsAPI[property].active)) {
                                                // print quest not started
                                                dailyCard += `${description}<span class='badge badge-pill badge-danger'>0/${goal}</span>`;
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

                                                    if (goal === questsAPI[property].active[objectiveData.id]) {
                                                        dailyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                        dailyCard += goal
                                                    } else {
                                                        dailyCard += `${description}<span class='badge badge-pill badge-warning ${lightmode === "dark" ? "dark" : ""}'>`;
                                                        dailyCard += questsAPI[property].active[objectiveData.id]
                                                    }
                                                    dailyCard += `/${goal}</span>`;

                                                } else {

                                                    if (objectiveID === objectiveData.id) {
                                                        dailyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                        dailyCard += goal;
                                                        dailyCard += `/${goal}</span>`;
                                                    } else {
                                                        dailyCard += `${description}<span class='badge badge-pill badge-danger'>`;
                                                        dailyCard += 0;
                                                        dailyCard += `/${goal}</span>`;
                                                    }

                                                }
                                            }
                                        } else {
                                            //Quest done
                                            dailyCard += `${description}<span class='badge badge-pill badge-success' id=''>${goal}/${goal}</span>`;

                                        }
                                    } else {
                                        // quest not done
                                        dailyCard += `${description}<span class='badge badge-pill badge-danger' id=''>0/${goal}</span>`;
                                    }

                                    dailyCard += "                </li>";
                                });

                                dailyCard += "                </div>";
                                dailyCard += "            </div>";
                                dailyCard += "        </div>";
                            } else if (questINFO.name.includes("Weekly") || questINFO.name.startsWith("Special")) {
                                weeklyCard += `        <div class='card ${lightmode === "dark" ? "dark1" : ""}'>`;
                                var property = questINFO.id;
                                weeklyCard += `        <div id='progress-header-${property}'>`;
                                weeklyCard += `            <div class='card-header justify-content-between d-flex' role='tab' id='heading-${game}-${key}-WEEKLY-QUEST'>`;
                                weeklyCard += "                <h5 class='mb-0'>";
                                weeklyCard += `                    <a data-toggle='collapse' data-parent='#accordion-${game}-weekly' href='#collapse-${game}-${key}-WEEKLY-QUEST' aria-expanded='false' aria-controls='collapse-${game}-${key}-WEEKLY-QUEST' class='collapsed'>`;
                                var questName = questINFO.name.match(/: ([a-zA-Z !(),0-9]*)/m);
                                weeklyCard += questName[1];
                                weeklyCard += "                    </a>";
                                weeklyCard += "                </h5>";
                                weeklyCard += "            </div>";
                                weeklyCard += "        </div>";
                                weeklyCard += `       <div id='collapse-${game}-${key}-WEEKLY-QUEST'  class='collapse' role='tabpanel' aria-labelledby='heading-${game}-${key}-WEEKLY-QUEST' aria-expanded='false'>`;
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

                                    const goal = (objectiveData.type === "IntegerObjective") ? objectiveData.integer : 1;

                                    // opening li tag
                                    weeklyCard += `       <li class='list-group-item d-flex justify-content-between align-items-center info ${lightmode === "dark" ? "dark" : ""}'>`;
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
                                                if (goal === questsAPI[property].active[objectiveData.id]) {
                                                    weeklyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                    weeklyCard += goal;
                                                    percentage += 1;
                                                } else {
                                                    // not completed
                                                    weeklyCard += `${description}<span class='badge badge-pill badge-warning ${(lightmode === "dark") ? "dark" : ""}'>`;

                                                    percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                    weeklyCard += questsAPI[property].active[objectiveData.id]
                                                }
                                                weeklyCard += `/${goal}</span>`;

                                            } else {
                                                if (objectiveID === objectiveData.id) {
                                                    if (goal === questsAPI[property].active[objectiveData.id]) {
                                                        weeklyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                        weeklyCard += goal;
                                                        weeklyCard += `/${goal}</span>`;
                                                        percentage += 1;
                                                    } else {
                                                        weeklyCard += `${description}<span class='badge badge-pill badge-warning'>`;
                                                        weeklyCard += questsAPI[property].active[objectiveData.id];
                                                        weeklyCard += `/${goal}</span>`;
                                                        percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                    }

                                                } else {
                                                    if (questsAPI[property].active[objectiveData.id] == null) {
                                                        weeklyCard += `${description}<span class='badge badge-pill badge-danger'>`;
                                                        weeklyCard += 0;
                                                        weeklyCard += `/${goal}</span>`;
                                                        percentage += 0;
                                                    } else {
                                                        if (questsAPI[property].active[objectiveData.id] === goal) {
                                                            weeklyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                            weeklyCard += goal;
                                                            weeklyCard += `/${goal}</span>`;
                                                            percentage += 1;
                                                        } else {
                                                            weeklyCard += `${description}<span class='badge badge-pill badge-warning'>`;
                                                            weeklyCard += questsAPI[property].active[objectiveData.id];
                                                            weeklyCard += `/${goal}</span>`;
                                                            percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                        }
                                                    }

                                                }

                                            }

                                        } else {
                                            // latest time completed quest
                                            var latest = questsAPI[property].latest.time;
                                            // if quest not done
                                            if (doneThisWeek(latest) === "Not done") {
                                                if (jQuery.isEmptyObject(questsAPI[property].active)) {
                                                    // print quest not started
                                                    weeklyCard += `${description}<span class='badge badge-pill badge-danger'>0/${goal}</span>`;
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
                                                        if (goal === questsAPI[property].active[objectiveData.id]) {
                                                            weeklyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                            weeklyCard += goal;
                                                            percentage += 1;
                                                        } else {
                                                            // not completed
                                                            weeklyCard += `${description}<span class='badge badge-pill badge-warning ${lightmode === "dark" ? "dark" : ""}'>`;
                                                            percentage += (questsAPI[property].active[objectiveData.id]/goal);
                                                            weeklyCard += questsAPI[property].active[objectiveData.id]
                                                        }
                                                        weeklyCard += `/${goal}</span>`;

                                                    } else {

                                                        if (objectiveID === objectiveData.id) {
                                                            weeklyCard += `${description}<span class='badge badge-pill badge-success'>`;
                                                            weeklyCard += goal;
                                                            weeklyCard += `/${goal}</span>`;
                                                            percentage += 1;
                                                        } else {
                                                            weeklyCard += `${description}<span class='badge badge-pill badge-danger'>`;
                                                            weeklyCard += 0;
                                                            weeklyCard += `/${goal}</span>`;
                                                            percentage += 0;
                                                        }

                                                    }

                                                }
                                            } else {
                                                // quest done
                                                weeklyCard += `${description}<span class='badge badge-pill badge-success' id=''>${goal}/${goal}</span>`;
                                                percentage += 1;

                                            }
                                        }
                                    } else {
                                        // quest not done at all
                                        weeklyCard += `${description}<span class='badge badge-pill badge-danger' id=''>0/${goal}</span>`;
                                        percentage += 0;
                                    }
                                    weeklyCard += "           </li>";
                                });

                                weeklyCard += "           </div>";
                                weeklyCard += "       </div>";
                                weeklyCard += "       <div class='card-body'>";
                                weeklyCard += `		<div class='progress ${lightmode === "dark" ? "dark2" : ""}'>`;
                                percentage /= objectiveCounter;
                                if (percentage === 1) {
                                    weeklyCard += `           <div class='progress-bar progress-bar-striped bg-success' role='progressbar' style='width: 100%'></div>`;
                                    if (doneToday(questsAPI[property].latest.time) === "Done") {
                                        weeklyDoneToday += 1;
                                        expEarntToday += questINFO.rewards[0].amount;
                                    }
                                } else {
                                    weeklyCard += `           <div class='progress-bar progress-bar-striped bg-warning' role='progressbar' style='width: ${percentage * 100}%'></div>`;
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

                if (weeklyDoneToday === 1) {
                    weeklyText = ` (including 1 weekly quest)`;
                } else if (weeklyDoneToday > 1) {
                    weeklyText = ` (including ${weeklyDoneToday} weekly quests)`;
                }

                var alert = `<div style='text-align: center; border;' class='alert' style='background-color: #FFFFFF' role='alert'>You have done <span class='badge badge-pill badge-dark'><b>${questsDoneToday}</b> / ${totalQuestsPossible}</span> daily quests today, that's  <span class='badge badge-pill badge-dark'>${Math.round((questsDoneToday / totalQuestsPossible) * 100)}%</span>`;
                alert += `<br>Earning a total of <span class='badge badge-pill badge-dark'><b>${numberWithCommas(expEarntToday)}</b></span> exp <i>${weeklyText}</i></div>`;
                $("#alert-daily").append(alert);

                return questVars[1];

            }

            // Calendar tabs
            calendarTab(quests, questList);
            function calendarTab(quests, questList) {
                var formattedEventData = [];
                $.each(quests, function(quest, questData) {
                    if (questData.completions != null) {
                        for (let i = 0; i < questData.completions.length; i++) {

                            var offset = moment().format("Z");
                            offset = offset.substring(0, 3);

                            var start = questData.completions[i].time + (parseInt(offset)*3600000);

                            var colour = "#";
                            var game = "";
                            var questName = "";

                            $.each(questList, function(key, value) {
                                if (value.id === quest) {
                                    if (value.name != null) {
                                        questName = value.name.match(/: ([a-zA-Z !(),0-9]*)/m)[1];
                                        colour += value.colour;
                                        questName += ` (${getEnGameNames(value.game)})`;
                                    } else {
                                        game = getEnQuestNames(value.id);
                                        colour += getColour(game);
                                        questName = `(Old) ${game.match(/: ([a-zA-Z !(),0-9]*)/m)[1]}`; //
                                        questName += ` (${getEnGameNames(game)})`;
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
            overalLeaderboardTab(ign);
            function overalLeaderboardTab(ign) {
                $.post("displayLeaderboard.php", JSON.stringify({"ign": ign, "game": "all", "uuid": resp.uuid, "num": 250}), function (users) {

                    users = JSON.parse(users);
                    $("#tbody").html(generateLeaderboard(users, lightmode, ign));

                    var alert;
                    alert = `<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#${users[1]}</span> with <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in <span class='badge badge-pill badge-dark'>All games</span></div>`;
                    $("#alert-overall").append(alert);

                });
            }

            // Stats tab
            var expEarntMonth = 0;
            statsTab(questList, quests, resp.uuid, questsInfo);
            function statsTab(questList, quests, uuid, questsInfo) {

                const gameStrings = ["skywars", "arcade", "vampirez", "walls3", "battleground", "quake",
                "walls", "hungergames", "tntgames", "gingerbread", "paintball", "supersmash", "mcgo", "truecombat",
                "arena", "uhc", "skyclash", "bedwars", "murdermystery", "buildbattle",
                "duels", "prototype", "speeduhc"];

                // Quests/Time
                var questsPerMonth = stats1(quests, uuid, ign);
                function stats1(quests, uuid, ign) {

                    var questsPerDay = {};
                    var questsPerDay2 = {};
                    var questsPerMonth = {};

                    var monthNow = moment().tz('America/New_York').format('MM');
                    var yearNow = moment().tz('America/New_York').format('YYYY');
                    var thisMonth = yearNow + "-" + monthNow;

                    // populate months
                    var firstDate = moment("2016-01-01");
                    var currentDate = moment(new Date());

                    while (firstDate.unix() <= currentDate.unix()) {
                        questsPerMonth[moment(firstDate).format('YYYY-MM')] = 0;
                        firstDate = moment(firstDate).add(1, 'months');
                    }

                    // add quests to questsPerDay object
                    $.each(quests, function(key, value) {
                        if (value.completions != null) {
                            for (let i=0; i < value.completions.length; i++) {

                                // for calendar
                                var date = new Date(value.completions[i].time);

                                var dateString = `${date.getFullYear()}-`;
                                if ((date.getMonth()+1) < 10) {
                                    dateString += `0${date.getMonth() + 1}-`
                                } else {
                                    dateString += `${date.getMonth() + 1}-`
                                }

                                if (date.getDate() < 10) {
                                    dateString += `0${date.getDate()}`
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

                                var fullDateString = `${convertedTime.format('YYYY')}-${convertedTime.format('MM')}-${convertedTime.format('DD')}`;
                                var monthDateString = `${convertedTime.format('YYYY')}-${convertedTime.format('MM')}`;

                                if (fullDateString in questsPerDay) {
                                    questsPerDay[fullDateString] += 1
                                } else {
                                    questsPerDay[fullDateString] = 1
                                }

                                if (monthDateString === thisMonth) {
                                    $.each(questsInfo, function(key2, questINFO) {
                                        for (let i=0; i<questINFO.length; i++) {
                                            if (questINFO[i].id === key) {
                                                expEarntMonth += questINFO[i].rewards[0].amount;
                                            }
                                        }
                                    });
                                }

                                questsPerMonth[monthDateString] += 1
                            }
                        }
                    });

                    var data2 = [];

                    $.each(questsPerMonth, function(key, value) {
                        data2.push([key, value])
                    });

                    data2 = data2.sort(sortFunctionTime);

                    function sortFunctionTime(a, b) {
                        if (a[0] === b[0]) return 0;
                        else return (a[0] < b[0]) ? -1 : 1;
                    }

                    var data = [];

                    $.each(questsPerDay2, function(key, value) {
                        data.push([parseInt(key), value])
                    });

                    data = convertData(data);

                    Highcharts.stockChart('chart1', {
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
                stats2(questsPerMonth);
                function stats2(questsPerMonth) {
                    Highcharts.chart('chart2', {
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

                // Total Quests/Month
                stats3(questsPerMonth);
                function stats3(questsPerMonth) {

                    var total = 0;
                    var totalQuestsPerMonth = [];

                    $.each(questsPerMonth, function (i, month) {
                        total += month[1];
                        totalQuestsPerMonth.push([month[0], total]);
                    });

                    Highcharts.chart('chart3', {
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
                            text: 'Total Quests / Month'
                        },
                        legend: {
                            enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Total Quests'
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
                            name: "Total Quests",
                            data: totalQuestsPerMonth
                        }]
                    });
                }

                // Quests/Game
                stats4(questList, gameStrings);
                function stats4(questList, gameStrings) {
                    var questsAllGamesChart = Highcharts.chart('chart4', {
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

                    var gameIndex;
                    for (gameIndex in gameStrings) {
                        games[gameStrings[gameIndex]] = 0;
                    }

                    var index;
                    for (index in questList) {
                        var gameIndex;
                        for (gameIndex in gameStrings) {
                            if (questList[index].game === gameStrings[gameIndex]) {
                                if (questList[index].completions != null) {
                                    games[gameStrings[gameIndex]] += questList[index].completions
                                }
                            }
                        }
                    }

                    var games2 = games;

                    var sortable = [];
                    for (let game in games2) {
                        sortable.push([game, games2[game]]);
                    }

                    $.post("updateLeaderboard.php", JSON.stringify({"ign": ign, "quests": sortable, "uuid": resp.uuid}));

                    sortable.sort(function(a, b) {
                        return a[1] - b[1];
                    });

                    for (let game in sortable) {
                        questsAllGamesChart.series[0].addPoint({name: getEnGameNames(sortable[game][0]), y: sortable[game][1]});
                    }
                }

                // Quests/Quest
                stats5(questList, gameStrings);
                function stats5(questList, gameStrings) {

                    var games = [];
                    var questName = "";
                    var questColour = "";

                    var gameIndex;
                    for (gameIndex in gameStrings) {
                        games.push({"name":getEnGameNames(gameStrings[gameIndex])});
                    }

                    // for each quest
                    var index;
                    for (index in questList) {
                        // for each game
                        var gameIndex;
                        for (gameIndex in gameStrings) {
                            // if correct game
                            if (questList[index].game === gameStrings[gameIndex]) {
                                // if quest has been completed before
                                if (questList[index].completions != null) {
                                    if (games[gameIndex].data == null) {
                                        games[gameIndex].data = [];
                                    }

                                    questName = questList[index].name;
                                    questColour = questList[index].colour;

                                    if (questList[index].name != null) {
                                        games[gameIndex].data.push({"name":questName, "value":questList[index].completions, "color":`#${questColour}`});
                                    } else {
                                        games[gameIndex].data.push({"name":`(Old) ${getEnQuestNames(questList[index].id)}`, "value":questList[index].completions, "color":`#${getColour(questList[index].game)}`});
                                    }
                                }
                            }
                        }
                    }

                    Highcharts.chart('chart5', {
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
                $.post("updateMonthlyOverallLeaderboard.php", JSON.stringify({"uuid": uuid, "quests": monthQuest, "ign": ign}), function() {
                    $.post("displayMonthlyOverallLeaderboard.php", JSON.stringify({"uuid": uuid}), function(users) {

                        users = JSON.parse(users);
                        $("#tbody-monthly-record").html(generateLeaderboard(users, lightmode, ign));

                        var alert;
                        alert = `<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#${users[1]}</span> with a record of <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in the month of <span class='badge badge-pill badge-dark'>${convertDate(users[3])}</span></div>`;
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
                if (monthQuest[monthQuest.length-1][0] === thisMonth) {
                    questsThisMonth = monthQuest[monthQuest.length-1][1];
                }

                // display monthly leaderboard
                $.post("displayMonthlyLeaderboard.php", JSON.stringify({"ign": ign, "uuid": resp.uuid, thisMonth}), function(users) {

                    users = JSON.parse(users);
                    $("#tbody-monthly").html(generateLeaderboard(users, lightmode, ign));

                    var alert;
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>";
                    alert += `   You are currently placed <span class='badge badge-pill badge-dark'>#${users[1]}</span> with <span class='badge badge-pill badge-dark'>${questsThisMonth} quests</span> this month,`;
                    alert += `   earning a total of <span class='badge badge-pill badge-dark'>${numberWithCommas(expEarntMonth)}</span> exp`;
                    alert += "</div>";
                    $("#alert-monthly").html(alert);

                });

            }

            yearlyLeaderboardTab(ign, "2020");
            function yearlyLeaderboardTab(ign, year) {
                // display monthly leaderboard
                $.post("displayYearlyLeaderboard.php", JSON.stringify({"ign": ign, "year": year}), function(users) {

                    users = JSON.parse(users);
                    $("#tbody-yearly").html(generateLeaderboard(users, lightmode, ign));

                    var alert;
                    alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>";

                    if (users[1] === 0) {
                        alert += `   You are not placed because you completed <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in <span class='badge badge-pill badge-dark'>${year}</span>`;
                    } else {
                        alert += `   You are placed <span class='badge badge-pill badge-dark'>#${users[1]}</span> with <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in <span class='badge badge-pill badge-dark'>${year}</span>`;
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

        var ignObj = {"ign": ign, "game": game, "num": game === "all" ? 250 : 25};

        $("#tableLoad").html("<div style='width: 100%; height: 100px;'><div style=''><i id='spinner' class='fa fa-angellist fa-spin fa-2x fa-fw'></i></div></div>");

        $.post("displayLeaderboard.php", JSON.stringify(ignObj), function (users) {
            users = JSON.parse(users);
            $("#tbody").html(generateLeaderboard(users, lightmode, ign));

            var alert;
            if (users[1] != null) {
                alert = `<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#${users[1]}</span> with <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in <span class='badge badge-pill badge-dark'>${getEnGameNames(game)}</span></div>`;
            } else {
                alert = `<div style='text-align: center; border;' class='alert alert-dark' role='alert'>You are placed <span class='badge badge-pill badge-dark'>#∞</span> with <span class='badge badge-pill badge-dark'>0 quests</span> in <span class='badge badge-pill badge-dark'>${getEnGameNames(game)}</span></div>`;
            }

            $("#alert-overall").html(alert);
        });
    });

    $("#yearly-loading").hide();
    $(".years").on("click", function() {
        var year = $(this).attr("id");
        $("#tbody-yearly").fadeOut(500);
        $("#yearly-loading").fadeIn(100);
        $.post("displayYearlyLeaderboard.php", JSON.stringify({"ign": ign, "year": year}), function(users) {
            users = JSON.parse(users);
            $("#tbody-yearly").html(generateLeaderboard(users, lightmode, ign));
            var alert;
            alert = "<div style='text-align: center; border;' class='alert alert-dark' role='alert'>";
            if (users[1] === 0) {
                alert += `   You are not placed because you completed <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in <span class='badge badge-pill badge-dark'>${year}</span>`;
            } else {
                alert += `   You are placed <span class='badge badge-pill badge-dark'>#${users[1]}</span> with <span class='badge badge-pill badge-dark'>${users[2]} quests</span> in <span class='badge badge-pill badge-dark'>${year}</span>`;
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
                if (scrollTop > scrollTrigger) $('#back-to-top').addClass('show');
                else $('#back-to-top').removeClass('show');
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

    for (let i=1; i<4; i++) {
        val1 = parseInt(sel1.match(reg)[i]);
        val2 = parseInt(sel2.match(reg)[i]);
        range = Math.abs(val1-val2);
        if (i===1) {
            if (val1 > val2) {
                colour += val1 - Math.floor(range*percentage);
            } else {
                colour += val1 + Math.floor(range*percentage);
            }
        } else {
            if (val1 > val2) {
                colour += `,${parseInt(val1 - Math.floor(range * percentage))}`;
            } else {
                colour += `,${parseInt(val1 + Math.floor(range * percentage))}`;
            }
        }
    }
    colour += ")";

    return colour;
}

function getEnQuestNames(quest_id) {

    var enQuestName;

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

    var enGameName;

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
            break;
        case "prototype":
            enGameName = "The Pit";
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

    var dayQuest = moment(questTimeObject).tz('America/New_York').format('DD'); // day of month of last quest EDT (SERVER)
    var dayNow = moment().tz('America/New_York').format('DD'); // day of month of today EDT (SERVER)

    var monthQuest = moment(questTimeObject).tz('America/New_York').format('MM'); // month of year of last quest EDT (SERVER)
    var monthNow = moment().tz('America/New_York').format('MM'); // month of year of today EDT (SERVER)

    var yearQuest = moment(questTimeObject).tz('America/New_York').format('YYYY'); // year of last quest EDT (SERVER)
    var yearNow = moment().tz('America/New_York').format('YYYY'); // year of today EDT (SERVER)

    return ((dayNow - dayQuest === 0) && (monthNow - monthQuest === 0) && (yearNow - yearQuest === 0)) ? "Done" : "Not done";
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

function convertData(data) {
    var startDay = data[0][0];
    var day = new Date();
    var endDay = day.getTime();

    var isLastDay;
    isLastDay = startDay === endDay;
    var dayTick;
    dayTick = 1000 * 60 * 60 * 24;
    var temp;
    temp = [];

    //Create new array with 0 values for each day
    temp.push([startDay, 0]);
    while(!isLastDay) {
        startDay += dayTick;
        temp.push([startDay, 0]);

        var isLastDay;
        isLastDay = startDay >= endDay;
    }

    //Override all values with existing days
    for (let i = 0; i < data.length; i++) {
        for(let j = 0; j < temp.length; j++) {
            if (temp[j][0] === data[i][0]) {
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

    return getExpFromLevelToNext(getLevel(totalExp)) - XP_Progress;

    function getLevel(exp) {
        return exp < 0 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp));
    }

    function getExpFromLevelToNext(level) {
        return level < 1 ? BASE : GROWTH * (level - 1) + BASE;
    }

    function getTotalExpToFullLevel(level) {
        return (HALF_GROWTH * (level - 2) + BASE) * (level - 1);
    }
}

function convertDate(monthInput) {
    var year = monthInput.substring(0,4);
    var month = parseInt(monthInput.substring(5,7));
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

    return `${output} ${year}`;

}
