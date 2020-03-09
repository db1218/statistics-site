<?php

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ignEncoded = urlencode($nameInput->ign);

    ini_set("allow_url_fopen", 1);

    if (strlen($ignEncoded) > 16) {
      $url = file_get_contents("https://api.hypixel.net/player?key=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX&uuid=$ignEncoded");
    } else {
      $url = file_get_contents("https://api.hypixel.net/player?key=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX&name=$ignEncoded");
    }

    $JSONobj = json_decode($url);

    if ($JSONobj->player == null) {
        if ($JSONobj->success == null) {
            echo "api";
        } else {
            echo "player";
        }
    } else {
        $player = $JSONobj->player->displayname;
        echo json_encode($player);
    }
