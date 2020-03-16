<?php

    $credentials = include('../credentials.php');
    $key = $credentials['api-key'];

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ignEncoded = urlencode($nameInput->ign);

    $url = file_get_contents("https://api.hypixel.net/player?key=$key&name=$ignEncoded");

    $JSONobj = json_decode($url);

    if ($JSONobj->player == null) {
        echo ($JSONobj->success == null) ? "api" : "player";
    } else {
        $response = array('quests' => $JSONobj->player->quests,
            'networkExp' => $JSONobj->player->networkExp,
            'networkLevel' => $JSONobj->player->networkLevel,
            'firstLogin' => $JSONobj->player->firstLogin,
            'newPackageRank' => $JSONobj->player->newPackageRank,
            'rankPlusColor' => $JSONobj->player->rankPlusColor,
            'displayname' => $JSONobj->player->displayname,
            'monthlyPackageRank' => $JSONobj->player->monthlyPackageRank,
            'packageRank' => $JSONobj->player->packageRank,
            'monthlyRankColor' => $JSONobj->player->monthlyRankColor,
            'rank' => $JSONobj->player->rank,
            'achievementPoints' => $JSONobj->player->achievementPoints,
            'uuid' => $JSONobj->player->uuid);
        echo json_encode($response);
    }
