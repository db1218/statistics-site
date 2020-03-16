<?php

    $credentials = include('../credentials.php');
    $key = $credentials['api-key'];

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ignEncoded = urlencode($nameInput->ign);

    $url = file_get_contents("https://api.hypixel.net/player?key=$key&name=$ignEncoded");

    $JSONobj = json_decode($url);
    $playerData = $JSONobj->player;

    if ($playerData == null) {
        echo "Player not found";
    } else {
        $response = array('achievements' => $playerData->achievements,
            'achievementsOneTime' => $playerData->achievementsOneTime,
            'achievementPoints' => $playerData->achievementPoints,
            'networkExp' => $playerData->networkExp,
            'networkLevel' => $playerData->networkLevel,
            'newPackageRank' => $playerData->newPackageRank,
            'rankPlusColor' => $playerData->rankPlusColor,
            'displayname' => $playerData->displayname,
            'monthlyPackageRank' => $playerData->monthlyPackageRank,
            'packageRank' => $playerData->packageRank,
            'monthlyRankColor' => $playerData->monthlyRankColor,
            'rank' => $playerData->rank,
            'uuid' => $playerData->uuid,
            'quests' => $playerData->quests);
        echo json_encode($response);
    }
