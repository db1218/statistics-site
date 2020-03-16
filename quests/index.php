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
        <title>Hypixel Questing Tool</title>
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
        <link href="https://notifly.zone/main.css?ver=1.1" rel="stylesheet" type="text/css">
        <script src="./quests.js" type="module"></script>

        <!-- Moment -->
        <script src="https://momentjs.com/downloads/moment.js" rel="script" type="application/javascript"></script>
        <script src="https://momentjs.com/downloads/moment-timezone-with-data.js" rel="script" type="application/javascript"></script>

        <!-- Font Awesome -->
        <script src="https://use.fontawesome.com/de8c2544bf.js"></script>

        <!-- High Charts -->
        <script src="https://code.highcharts.com/stock/highstock.js"></script>
        <script src="https://code.highcharts.com/highcharts-more.js"></script>
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
                                    echo "<br>Quests...";
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
                        <a class="nav-link active" data-toggle="tab" href="#daily" role="tab" aria-controls="daily" aria-selected="true">Daily</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#weekly" role="tab" aria-controls="weekly" aria-selected="false">Weekly</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Leaderboards <span class="badge badge-primary">New</span></a>
                        <div class="dropdown-menu" id="dropdown">
                            <a class="dropdown-item" data-toggle="tab" href="#overall">Overall</a>
                            <a class="dropdown-item" data-toggle="tab" href="#monthly">Monthly</a>
                            <a class="dropdown-item" data-toggle="tab" href="#monthly-record">Monthly Record</a>
                            <a class="dropdown-item" data-toggle="tab" href="#yearly">Yearly <span class="badge badge-secondary">New</span></a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#stats" role="tab" aria-controls="stats" aria-selected="false">Stats</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#calendar" role="tab" aria-controls="calendar" aria-selected="false">Calendar</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/mod/" role="tab" aria-selected="false" data-toggle="tooltip" data-placement="top" title="Questing Mod"><b>Mod</b></a>
                    </li>
                    <li class="nav-item ml-auto">
                        <a class="nav-link" onclick="location.reload();" href="">Refresh</a>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="daily" role="tabpanel" aria-labelledby="daily-tab">
                        <br>
                        <div id="alert-daily"></div>
                        <div id="daily-stats">
                            <div id="daily-quests" class="card-columns"></div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="weekly" role="tabpanel" aria-labelledby="weekly-tab">
                        <br>
                        <div id="weekly-stats">
                            <div id="weekly-quests" class="card-columns"></div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="overall" role="tabpanel" aria-labelledby="overall-tab">
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
                                <a id="hungergames" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Blitz</a>
                            </li>
                            <li class="nav-item">
                                <a id="buildbattle" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Build Battle</a>
                            </li>
                            <li class="nav-item">
                                <a id="mcgo" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Cops vs Crims</a>
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
                                <a id="skyclash" class="nav-link games muted" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Skyclash</a>
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
                                <a id="prototype" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">The Pit</a>
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
                                <a id="battleground" class="nav-link games" href="#" data-toggle="tab" role="tabpanel" aria-controls="games" aria-selected="false">Warlords</a>
                            </li>
                        </ul>
                        <br>
                        <input type="text" class="form-control" id="search" name="search" autocomplete="off" placeholder="Search">
                        <br>
                        <div id="alert-overall"></div>
                        <br>
                        <div>
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Quests</th>
                                </tr>
                                </thead>
                                <tbody id="tbody">
                                </tbody>
                            </table>
                        </div>
                        <tbody id="tableLoad">
                        </tbody>
                    </div>
                    <div class="tab-pane fade" id="monthly" role="tabpanel" aria-labelledby="monthly-tab">
                        <br>
                        <div id="alert-monthly"></div>
                        <br>
                        <div>
                            <table class="table" id="monthlyTable">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Quests</th>
                                </tr>
                                </thead>
                                <tbody id="tbody-monthly"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="monthly-record" role="tabpanel" aria-labelledby="monthly-record-tab">
                        <br>
                        <input type="text" class="form-control" id="search-month" name="search-month" autocomplete="off" placeholder="Search">
                        <br>
                        <div id="alert-monthly-record"></div>
                        <br>
                        <div>
                            <table class="table" id="monthlyRecordTable">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Quests</th>
                                    <th scope="col">Month</th>
                                </tr>
                                </thead>
                                <tbody id="tbody-monthly-record"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="yearly" role="tabpanel" aria-labelledby="yearly-tab">
                        <br>
                        <ul class="nav nav-pills">
                            <li class="nav-item">
                                <a id="2020" class="nav-link active years" href="#" data-toggle="tab" role="tabpanel" aria-controls="years" aria-selected="true">2020</a>
                            </li>
                            <li class="nav-item">
                                <a id="2019" class="nav-link years" href="#" data-toggle="tab" role="tabpanel" aria-controls="years" aria-selected="false">2019</a>
                            </li>
                            <li class="nav-item">
                                <a id="2018" class="nav-link years" href="#" data-toggle="tab" role="tabpanel" aria-controls="years" aria-selected="false">2018</a>
                            </li>
                            <li class="nav-item">
                                <a id="2017" class="nav-link years" href="#" data-toggle="tab" role="tabpanel" aria-controls="years" aria-selected="false">2017</a>
                            </li>
                            <li class="nav-item">
                                <a id="2016" class="nav-link years" href="#" data-toggle="tab" role="tabpanel" aria-controls="years" aria-selected="false">2016</a>
                            </li>
                        </ul>
                        <br>
                        <input type="text" class="form-control" id="search-year" name="search-year" autocomplete="off" placeholder="Search">
                        <br>
                        <div id="alert-yearly"></div>
                        <br>
                        <div>
                            <div id="yearly-loading">
                                Loading...
                            </div>
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Quests</th>
                                </tr>
                                </thead>
                                <tbody id="tbody-yearly"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                        <br>
                        <div id="stats">
                            <div id="stats" class="card-columns1">
                                <div id="questsAllGamesChart2"></div>
                                <hr style="margin-top: 2rem; margin-bottom: 2rem;">
                                <div id="questsAllGamesChart3"></div>
                                <div id="sum"></div>
                                <hr style="margin-top: 2rem; margin-bottom: 2rem;">
                                <div id="questsAllGamesChart"></div>
                                <hr style="margin-top: 2rem; margin-bottom: 2rem;">
                                <div id="questsAllGamesChart4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="calendar" role="tabpanel" aria-labelledby="calendar-tab">
                        <br>
                        <div>
                            <div id="calendar-div" style="margin-bottom: 30px">
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="awards" role="tabpanel" aria-labelledby="awards">
                        <br>
                        <div>
                            <div id="awards" style="margin-bottom: 30px">
                            </div>
                        </div>
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
