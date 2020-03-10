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

	       <!-- Meta Data -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    	<meta name="description" content="Hypixel Questing Tool">
    	<meta name="keywords" content="hypixel, quests, questing, notifly">
    	<meta name="author" content="Notifly">
        <meta name="robots" content="noindex, nofollow">
        <meta name="googlebot" content="noindex, nofollow">

        <title>Hypixel Questing Tool</title>

        <!-- Favicon -->
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
        <link rel="icon" href="favicon.ico" type="image/x-icon">

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
        <link href="https://notifly.zone/main.css" rel="stylesheet" type="text/css">
        <script src="https://notifly.zone/main.js" rel="script" type="application/javascript"></script>

        <!-- Font Awesome -->
        <script src="https://kit.fontawesome.com/48b9fa1487.js" crossorigin="anonymous"></script>

    </head>

    <body>
        <div class="modal-dialog">
            <div class="modal-content" style="border: none">
                <div class="modal-header">
                    <div style="margin: auto; width: 100%;" id="page">
                        <div style="margin: auto; width: 128px; height: 128px">
                            <img class="mx-auto d-block" style="pointer-events: none;" src="bottle.gif">
                        </div>
                        <h1 class="display-4" style="pointer-events: none">Notifly.zone</h1>
                        <h1 class="display-5" style="pointer-events: none">
                            <u id="pageName">Quests</u>
                        </h1>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input list="users" name="username" type="text" class="form-control" id="username" autocomplete="off">
                        <small id="errorText" class="form-text text-danger">
                        <?php
                            session_start();
                            if ($_SESSION['e'] == "player") {
                                echo "<b>Error!</b> Player not found";
                                $_SESSION['e'] = "";
                            } else if ($_SESSION['e'] == "api") {
                                echo "<b>Error!</b> Hypixel API is down";
                                $_SESSION['e'] = "";
                            }
                        ?>
                        </small>
                        <datalist id="users">
                        </datalist>
                        <br>
                        <div class="row">
                            <div class="col">
                                <a href="https://twitter.com/Notifly_" target="_blank" class="btn btn-primary" style="width:100%">
                                    Ideas or bugs? <i class="fab fa-twitter fa-lg"></i> me
                                </a>
                            </div>
                            <div class="col">
                                <a id="quote" tabindex="0" class="btn btn-light" style="width:100%">
                                    Smile :) <i class="fas fa-cloud-sun fa-lg"></i>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-dark mr-auto" id="darkmode" style="white-space: nowrap;">Dark Mode</button>
                    <i id="spinner" class="fas fa-dove fa-spin fa-lg fa-fw"></i>
                    <button id="submit" type="button" class="btn btn-outline-primary">Submit</button>
                </div>
            </div>
        </div>
    </body>
</html>
