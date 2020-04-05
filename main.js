$(function() {

    $('[data-toggle="popover"]').popover();
    $('[data-toggle="tooltip"]').tooltip();

    darkmode();
    page(0);

    $("#spinner").hide();

    $("#username").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#submit").click();
        }
    });

    $("#page").on("click", function() {
        localStorage.setItem('page', (localStorage.getItem('page') || 'achievements') === 'achievements' ? 'quests' : 'achievements');
        page(100);
    });

    $("#submit").click(function() {

        let user = $("#username").val().replace(/\s/g, '');

        $("#errorText").fadeOut(1000);
        $("#spinner").show();

        $.post("https://notifly.zone/get_name.php", JSON.stringify({ign:user}), function(ign) {
            if (ign === "player") {
                $("#spinner").hide();
                $("#errorText").html("<b>Error!</b> Player not found").fadeIn(1000);
            } else if (ign === "api") {
                $("#spinner").hide();
                $("#errorText").html("<b>Error!</b> Hypixel API Down").fadeIn(1000);
            } else {
                if (localStorage.getItem('page') === "quests") {
                    window.location.href = "/quests/" + JSON.parse(ign);
                } else {
                    window.location.href = "/achievements/" + JSON.parse(ign);
                }

            }
        });
    });

    $("#darkmode").click(function() {
        localStorage.setItem('mode', (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark');
        darkmode();
    });

    function page(delay) {
        if (localStorage.getItem('page') === 'quests') {
            $("#pageName").fadeOut(delay, function() {
                $("#pageName").text("Quests").fadeIn(delay);
            });
        } else {
            $("#pageName").fadeOut(delay, function() {
                $("#pageName").text("Achievements").fadeIn(delay);
            });
        }
    }

    function darkmode() {
        if (localStorage.getItem('mode') === 'dark') {
            $("body").addClass('dark');
            $(".modal-content").addClass('dark');
            $("#darkmode").removeClass('btn-outline-dark').addClass('btn-outline-light').html("Light Mode");
            $("#pageName").addClass('dark');
        } else {
            $("body").removeClass('dark');
            $(".modal-content").removeClass('dark');
            $("#darkmode").removeClass('btn-outline-light').addClass('btn-outline-dark').html("Dark Mode");
            $("#pageName").removeClass('dark');
        }
    }

});
