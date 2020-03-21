<!DOCTYPE html>
<html>
    <head>

        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KHVQV8L');</script>
        <!-- End Google Tag Manager -->

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>Hypixel Achievements Tool</title>
        <meta name="robots" content="noindex, nofollow">
        <meta name="googlebot" content="noindex, nofollow">

        <!-- Favicon -->
        <link rel="shortcut icon" href="https://notifly.zone/favicon.ico" type="image/x-icon">
        <link rel="icon" href="https://notifly.zone/favicon.ico" type="image/x-icon">

        <!-- Apple Touch Icon -->
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120-precomposed.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152-precomposed.png">

        <!-- jQuery -->
        <script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>

        <!-- Bootstrap -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" crossorigin="anonymous"></script>

        <!-- Local files -->
        <link href="../main.css?ver=1.1" rel="stylesheet" type="text/css">
        <script src="achievements.js" type="module"></script>

        <!-- Moment -->
        <script src="https://momentjs.com/downloads/moment.js" rel="script" type="application/javascript"></script>
        <script src="https://momentjs.com/downloads/moment-timezone-with-data.js" rel="script" type="application/javascript"></script>

        <!-- Font Awesome -->
        <script src="https://use.fontawesome.com/de8c2544bf.js"></script>

        <!-- High Charts -->
        <script src="https://code.highcharts.com/stock/highstock.js"></script>
        <script src="http://code.highcharts.com/highcharts-more.js"></script>
        <script src="https://code.highcharts.com/stock/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/streamgraph.js"></script>
        <script src="https://code.highcharts.com/modules/series-label.js"></script>
        <script src="https://rawgithub.com/highcharts/adapt-chart-to-legend/master/adapt-chart-to-legend.js"></script>

        <!-- FullCalendar -->
        <link rel='stylesheet' href='../fullcalendar/fullcalendar.css?ver=1.1' />
        <script src='../fullcalendar/fullcalendar.js?ver=1.1'></script>

    </head>

    <body>
        <div id="loading">
            <div class="modal-dialog" style="padding: 10% 0;">
                <div class="modal-content" style="border: none">
                    <div class="modal-content" style="border: none">
                        <h1 id="headingLoad" class="display-4" style="pointer-events: none; width: 100%">
                            <?php
                                $credentials = include('../credentials.php');
                                $key = $credentials['api-key'];

                                $ign = $_GET["ign"];
                                if (strlen($ign) > 16) {
                                  $url = file_get_contents("https://api.hypixel.net/player?key=$key&uuid=$ign");
                                } else {
                                  $url = file_get_contents("https://api.hypixel.net/player?key=$key&name=$ign");
                                }
                                $JSONobj = json_decode($url);

                                session_start();

                                if ($JSONobj->player == null) {
                                    if ($JSONobj->success == null) {
                                        $_SESSION['e'] = "api";
                                    } else {
                                        $_SESSION['e'] = "player";
                                    }
                                    echo "<script type='text/javascript'>location.href = '/';</script>";
                                } else {
                                    $player = $JSONobj->player->displayname;
                                    echo "Loading ";
                                    echo "<div id='ign' style='display: inline-block;'>";
                                    if (substr($player, -1) == 's') {
                                        echo $player;
                                        echo "</div>'";
                                    } else {
                                        echo $player;
                                        echo "</div>'s";
                                    }
                                    echo "<br>Achievements...";
                                };?>
                            <br>
                            <br>
                            <div class='sk-folding-cube'>
                                <div class='sk-cube1 sk-cube'></div>
                                <div class='sk-cube2 sk-cube'></div>
                                <div class='sk-cube4 sk-cube'></div>
                                <div class='sk-cube3 sk-cube'></div>
                            </div>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" id="hidden" style="display: none">
            <div class="box">
                <h1 id="heading" class="display-4" data-toggle="tooltip"></h1>
            </div>
            <div>
                <div id="gen"></div>
                <ul class="nav nav-tabs flex-column flex-sm-row" role="tablist" id="tab-menu">
                    <li class="nav-item">
                        <a class="nav-link" href="../../">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#achievements" role="tab" aria-controls="achievements" aria-selected="true">Achievements</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#leaderboards" role="tab" aria-controls="leaderboards" aria-selected="falsse">Leaderboards</a>
                    </li>
                    <li class="nav-item ml-auto">
                        <a class="nav-link" onclick="location.reload();" href="">Refresh</a>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="achievements" role="tabpanel" aria-labelledby="achievements-tab">
                        <br>
                        <div id="alert-achievements"></div>
                        <div class="row">
                            <div class="col-md-4" id="side">
                                <div style="padding-bottom: 1em;">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="radioOptions" id="pointsRadio" value="option1">
                                        <label class="form-check-label" for="pointsRadio">% by points</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="radioOptions" id="achievementsRadio" value="option2" checked>
                                        <label class="form-check-label" for="achievementsRadio">% by achievements</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div>
                                    <div class="row">
                                        <div class="col" style="padding-right:0">
                                            <small>Progress</small>
                                            <div id="stateFilter" class="filters">
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="radioProgress" id="filterProgressBoth" value="option1" checked>
                                                    <label class="form-check-label" for="filterProgressBoth">Both</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="radioProgress" id="filterProgressCompleted" value="option2">
                                                    <label class="form-check-label" for="filterProgressCompleted">Completed</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="radioProgress" id="filterProgressUncompleted" value="option3">
                                                    <label class="form-check-label" for="filterProgressUncompleted">Uncompleted</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col" style="padding-left:0">
                                            <small>Type</small>
                                            <div id="typeFilter" class="filters">
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="radioType" id="filterTypeBoth" value="option4" checked>
                                                    <label class="form-check-label" for="filterTypeBoth">Both</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="radioType" id="filterTypeOnetime" value="option5">
                                                    <label class="form-check-label" for="filterTypeOnetime">One Time</label>
                                                </div>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="radio" name="radioType" id="filterTypeTiered" value="option6">
                                                    <label class="form-check-label" for="filterTypeTiered">Tiered</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-content" id="nav-tabContent"></div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="leaderboards" role="tabpanel" aria-labelledby="leaderboards-tab">
                        <br>
                        <ul class="nav nav-pills">
                            <li class="nav-item">
                                <a id="all" class="nav-link active games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="true">Overall</a>
                            </li>
                            <li class="nav-item">
                                <a id="arcade" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Arcade</a>
                            </li>
                            <li class="nav-item">
                                <a id="arena" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Arena Brawl</a>
                            </li>
                            <li class="nav-item">
                                <a id="bedwars" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Bedwars</a>
                            </li>
                            <li class="nav-item">
                                <a id="blitz" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Blitz</a>
                            </li>
                            <li class="nav-item">
                                <a id="buildbattle" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Build Battle</a>
                            </li>
                            <li class="nav-item">
                                <a id="copsandcrims" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Cops vs Crims</a>
                            </li>
                            <li class="nav-item">
                                <a id="truecombat" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Crazy Walls</a>
                            </li>
                            <li class="nav-item">
                                <a id="duels" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Duels</a>
                            </li>
                            <li class="nav-item">
                                <a id="walls3" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Mega Walls</a>
                            </li>
                            <li class="nav-item">
                                <a id="murdermystery" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Murder Mystery</a>
                            </li>
                            <li class="nav-item">
                                <a id="paintball" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Paintball</a>
                            </li>
                            <li class="nav-item">
                                <a id="quake" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Quakecraft</a>
                            </li>
                            <li class="nav-item">
                                <a id="skyblock" class="nav-link games muted" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Skyblock</a>
                            </li>
                            <li class="nav-item">
                                <a id="skywars" class="nav-link games muted" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Skywars</a>
                            </li>
                            <li class="nav-item">
                                <a id="supersmash" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Smash Hereos</a>
                            </li>
                            <li class="nav-item">
                                <a id="speeduhc" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Speed UHC</a>
                            </li>
                            <li class="nav-item">
                                <a id="gingerbread" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Turbo Kart Racers</a>
                            </li>
                            <li class="nav-item">
                                <a id="tntgames" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">TNT Games</a>
                            </li>
                            <li class="nav-item">
                                <a id="uhc" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">UHC</a>
                            </li>
                            <li class="nav-item">
                                <a id="vampirez" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Vampire Z</a>
                            </li>
                            <li class="nav-item">
                                <a id="walls" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Walls</a>
                            </li>
                            <li class="nav-item">
                                <a id="warlords" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Warlords</a>
                            </li>
                            <li class="nav-item">
                                <a id="maxed" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false"><b><i>Maxed Games</i></b></a>
                            </li>
                        </ul>
                        <br>
                        <input type="text" class="form-control" id="search" name="search" autocomplete="off" placeholder="Search">
                        <br>
                        <div id="alert-overall"></div>
                        <br>
                        <div>
                            <table class="table">
                                <thead id="thead">
                                </thead>
                                <tbody id="tbody">
                                </tbody>
                            </table>
                        </div>
                        <tbody id="tableLoad">
                        </tbody>
                    </div>
                </div>
            </div>
        </div>
        <div id="footer" class="modal-dialog" style="display: none">
            <div class="modal-content" style="border: none">
                <div class="modal-body">
                    <div class="float-left">
                        <button type="button" class="btn btn-outline-dark" id="darkmode">Dark Mode</button>
                    </div>
                    <div class="float-right">
                        <button id="back-to-top" type="button" class="btn btn-light">Scroll to top</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
