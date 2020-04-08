<html lang="en">
<head>

    <!-- Google Tag Manager -->
    <script>(function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start':
                    new Date().getTime(), event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-KHVQV8L');</script>
    <!-- End Google Tag Manager -->

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../favicon.ico">

    <title>The Questing Mod | Hypixel Questing Tool</title>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" crossorigin="anonymous"></script>

    <!-- Font Awesome -->
    <script src="https://use.fontawesome.com/de8c2544bf.js"></script>

    <!-- Local files -->
    <link href="../main.css" rel="stylesheet" type="text/css">
    <script src="main.js"></script>

</head>

<!-- Modal -->
<div class="modal fade" id="versionsModal" tabindex="-1" role="dialog" aria-labelledby="versionsModalTitle"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="versionsModalTitle">Previous versions</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Version</th>
                        <th scope="col">Filename</th>
                        <th scope="col">Released</th>
                        <th scope="col"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">2.7</th>
                        <td>TheQuestingMod-2.7.jar</td>
                        <td>08/04/20</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Updated blitz weekly">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.6</th>
                        <td>TheQuestingMod-2.6.jar</td>
                        <td>21/02/20</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Added staff support">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.5</th>
                        <td>TheQuestingMod-2.5.jar</td>
                        <td>19/07/19</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Properly updated blitz quests">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.4</th>
                        <td>TheQuestingMod-2.4.jar</td>
                        <td>21/06/19</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Updated speed uhc quests">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.3</th>
                        <td>TheQuestingMod-2.3.jar</td>
                        <td>14/05/19</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Updated blitz quests (-chaos, +chests)">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.2</th>
                        <td>TheQuestingMod-2.2.jar</td>
                        <td>02/04/19</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Fixed arena brawl daily kills quest (10 kills -> 5 kills)">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.1</th>
                        <td>TheQuestingMod-2.1.jar</td>
                        <td>31/03/19</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Added new warlords 'All Star' weekly quest">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">2.0</th>
                        <td>TheQuestingMod-2.0.jar</td>
                        <td>29/03/19</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="First release.">
                                Notes
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" style="font-weight: normal;">1.0</th>
                        <td><a><s>TheQuestingMod-1.0.jar</s></a></td>
                        <td>07/09/18</td>
                        <td>
                            <a href="#" data-container="body" data-toggle="popover" data-placement="right"
                               data-content="Outdated version containing security flaw">
                                Notes
                            </a>
                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<body class="text-center">
<div class="background-img"></div>
<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column content">
    <header class="masthead mb-auto" style="margin-bottom: 10px;">
        <div class="inner">
            <a href="https://notifly.zone">return to <h3 class="masthead-brand">Notifly.zone</h3></a>
        </div>
    </header>

    <main role="main" class="inner cover">

        <div class="modal-dialog" role="document" style="margin-top: 10px; margin-bottom: 10px;">
            <div class="modal-content" style="border: none">
                <div class="modal-header">
                    <h1 class="modal-title text-center" style="margin: 0 auto;">The Questing Mod</h1>
                </div>
                <div class="modal-body">
                    <p class="lead" style="margin-bottom: 0px;">A 1.8.9 forge mod to make quest tracking easier. Type
                        <mark>/q help</mark>
                        in game for list of commands
                    </p>
                    <hr>
                    <dl class="row" style="text-align: left;">
                        <dt class="col-sm-4">Commands</dt>
                        <dd class="col-sm-8"><b>Description</b></dd>
                        <dt class="col-sm-4">/q</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Shows quests for game that you are in</dd>
                        <dt class="col-sm-4">/q [ign]</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Shows quests for game that player is in</dd>
                        <dt class="col-sm-4">/q [ign] [game]</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Shows quests for ign & game specified</dd>
                        <dt class="col-sm-4">/q games</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Lists gamemode aliases</dd>
                        <dt class="col-sm-4">/q weekly [ign] [game]</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Shows weekly quests for ign/game</dd>
                        <dt class="col-sm-4">/q info [ign]</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">View general hypixel stats</dd>
                        <dt class="col-sm-4">/q site [ign]</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Link to notifly.zone page</dd>
                        <dt class="col-sm-4">/q api [key]</dt>
                        <dd class="col-sm-8" style="margin-bottom: 0px;">Must enter your api key to use the mod</dd>
                    </dl>
                    <hr>
                    <div class="row">
                        <div class="col">
                            <a href="/mod/screenshot1.png" target="_blank">
                                <img src="screenshot1.png" alt="Blitz Quests" class="img-thumbnail">
                            </a>
                        </div>
                        <div class="col">
                            <a href="/mod/screenshot2.png" target="_blank">
                                <img src="screenshot2.png" alt="Build Battle Quests" class="img-thumbnail">
                            </a>
                        </div>
                        <div class="col">
                            <a href="/mod/screenshot3.png" target="_blank">
                                <img src="screenshot3.png" alt="Help Menu" class="img-thumbnail">
                            </a>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-light" data-toggle="modal" data-target="#versionsModal">
                        Versions
                    </button>
                    <p class="lead" style="margin-bottom:0px;">
                        <a href="versions/TheQuestingMod-2.7.jar" class="btn btn-lg btn-primary" id="downloadHomepage">Download
                            <i class="fa fa-download"></i></a>
                    </p>
                </div>
            </div>
        </div>

    </main>

    <footer class="mastfoot mt-auto">
        <div class="inner">
            <p>Developed by <a href="https://twitter.com/notifly_" target="_blank">@Notifly</a></p>
        </div>
    </footer>
</div>
</body>
</html>
