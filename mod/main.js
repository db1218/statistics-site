$(function () {
    $('[data-toggle="popover"]').popover();

    $("#downloadHomepage").on("click", function () {
        $.post("updateDownloads.php", JSON.stringify({"version": "2.6"}));
    });

    if (localStorage.getItem('mode') === 'dark') {
        $("body").addClass('dark');
        $(".modal-content").addClass('dark');
        $("table").addClass('dark');
    } else {
        $("body").removeClass('dark');
        $(".modal-content").removeClass('dark');
        $("table").removeClass('dark');
    }

});