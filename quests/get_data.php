<?php

    $credentials = include('../credentials.php');
    $key = $credentials['api-key'];

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ignEncoded = urlencode($nameInput->ign);

    $url = file_get_contents("https://api.hypixel.net/player?key=$key&name=$ignEncoded");

    $JSONobj = json_decode($url);

    if ($JSONobj->player == null) {
        if ($JSONobj->success == null) {
            echo "api";
        } else {
            echo "player";
        }
    } else {
        $response = array($JSONobj->player->quests, $JSONobj->player->networkExp, $JSONobj->player->networkLevel, $JSONobj->player->firstLogin, $JSONobj->player->newPackageRank, $JSONobj->player->rankPlusColor, $JSONobj->player->displayname, $JSONobj->player->monthlyPackageRank, $JSONobj->player->packageRank, $JSONobj->player->monthlyRankColor, $JSONobj->player->rank, $JSONobj->player->achievementPoints, $JSONobj->player->uuid);
        echo json_encode($response);
    }
