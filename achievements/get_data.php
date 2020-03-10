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
        $response = array($playerData->achievements, $playerData->achievementsOneTime, $playerData->achievementPoints, $playerData->networkExp, $playerData->networkLevel, $playerData->newPackageRank, $playerData->rankPlusColor, $playerData->displayname, $playerData->monthlyPackageRank, $playerData->packageRank, $playerData->monthlyRankColor, $playerData->rank, $playerData->uuid, $playerData->quests);
        echo json_encode($response);
    }
