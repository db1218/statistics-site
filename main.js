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

    $("#submit").click(function() {

        var user = $("#username").val();
        user = user.replace(/\s/g, '');

        $("#errorText").fadeOut(1000);
        $("#spinner").show();

        var nameInput = {
            ign:user
        };

        $.post("https://notifly.zone/get_name.php", JSON.stringify(nameInput), function(ign) {
            if (ign === "player") {
                $("#spinner").hide();
                $("#errorText").html("<b>Error!</b> Player not found");
                $("#errorText").fadeIn(1000);
            } else if (ign === "api") {
                $("#spinner").hide();
                $("#errorText").html("<b>Error!</b> Hypixel API Down");
                $("#errorText").fadeIn(1000);
            } else {
                var ign = JSON.parse(ign);
                if (localStorage.getItem('page') == "quests") {
                    window.location.href = "/quests/" + ign;
                } else {
                    window.location.href = "/achievements/" + ign;
                }

            }
        });
    });

    $("#darkmode").click(function() {
        localStorage.setItem('mode', (localStorage.getItem('mode') || 'dark') === 'dark' ? 'light' : 'dark');
        darkmode();
    });

    function darkmode() {
        if (localStorage.getItem('mode') === 'dark') {
            $("body").addClass('dark');
            $(".modal-content").addClass('dark');
            $("#darkmode").removeClass('btn-outline-dark');
            $("#darkmode").addClass('btn-outline-light');
            $("#darkmode").html("Light Mode");
            $("#pageName").addClass('dark');
        } else {
            $("body").removeClass('dark');
            $(".modal-content").removeClass('dark');
            $("#darkmode").removeClass('btn-outline-light');
            $("#darkmode").addClass('btn-outline-dark');
            $("#darkmode").html("Dark Mode");
            $("#pageName").removeClass('dark');
        }
    }

    // var text = "";

    // $("#quote").click(function() {
    //     if (text == "") {
    //         $('#quote').popover({content: "Loading...", placement: "top", trigger: "focus"});
    //         $("#quote").popover('toggle');
    //         $.get("https://quotes.rest/qod.json?category=inspire", function(response) {
    //             text = response.contents.quotes[0].quote + " -" + response.contents.quotes[0].author;
    //             $('#quote').popover("dispose").popover({content: text, placement: "top", trigger: "focus"});
    //             $("#quote").popover('toggle');
    //         });
    //     } else {
    //         $('#quote').popover({content: text, placement: "top", trigger: "focus"});
    //         $("#quote").popover('toggle');
    //     }
    // });

});
