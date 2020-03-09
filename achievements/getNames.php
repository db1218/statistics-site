<?php

    ini_set('display_errors', 0);
    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $uuid = urlencode($nameInput->uuid);
    $ign = urlencode($nameInput->ign);

    ini_set("allow_url_fopen", 1);
    $url = file_get_contents('https://api.mojang.com/user/profiles/' . $uuid . '/names');

    $namesJson = json_decode($url);
    $names = [];

    if ($namesJson != null) {
        foreach ($namesJson as $name) {
            if (!(in_array($name->name, $names)) && ($name->name != $ign)) {
                array_push($names, $name->name);
            }

        }
        echo json_encode($names);
    }
