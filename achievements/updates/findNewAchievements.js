$(function() {
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    $.get("oldAchievements.php", function (response) {
        let parsedResponse = JSON.parse(response);
        $.get("https://api.hypixel.net/resources/achievements", function (response2) {
            let newAchievements = response2.achievements;
            let newAchievementsList;
            let oldAchievements;
            let oldAchievementsList;
            let difference;
            if (parsedResponse[0] === 1) {
                oldAchievements = JSON.parse(parsedResponse[1]);
                newAchievementsList = [];
                $.each(newAchievements, function (newGame, newGameObject) {
                    $.each(newGameObject.one_time, function (newAchievement, newAchievementObject) {
                        newAchievementsList.push(newGame + " one_time " + newAchievement);
                    });
                    $.each(newGameObject.tiered, function (newAchievement, newAchievementObject) {
                        newAchievementsList.push(newGame + " tiered " + newAchievement);
                    });
                });

                oldAchievementsList = [];
                $.each(oldAchievements, function (oldGame, oldGameObject) {
                    $.each(oldGameObject.one_time, function (oldAchievement, oldAchievementObject) {
                        oldAchievementsList.push(oldGame + " one_time " + oldAchievement);
                    });
                    $.each(oldGameObject.tiered, function (oldAchievement, oldAchievementObject) {
                        oldAchievementsList.push(oldGame + " tiered " + oldAchievement);
                    });
                });
                difference = newAchievementsList.diff(oldAchievementsList);
                console.log(oldAchievementsList);
                console.log(newAchievementsList);
                console.log(difference);
                if (difference.length > 0) {
                    $.post("addNewAchievement.php", JSON.stringify({time: parsedResponse[2], path: difference}));
                }
            }
            $.post("getNewAchievements.php", function(response3) {
                console.log(response3);
            });
        });
    });
});
