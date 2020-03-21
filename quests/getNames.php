<?php

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $uuid = urlencode($nameInput->uuid);
    $ign = urlencode($nameInput->ign);

    $url = file_get_contents("https://api.mojang.com/user/profiles/$uuid/names");

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
