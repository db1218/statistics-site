    <?php

        ini_set('display_errors', 0);
        $request = file_get_contents("php://input");
        $nameInput = json_decode($request);
        $ignEncoded = urlencode($nameInput->ign);

        ini_set("allow_url_fopen", 1);
        $url = file_get_contents("https://api.hypixel.net/player?key=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX&name=$ignEncoded");

        $JSONobj = json_decode($url);
        $playerData = $JSONobj->player;

        if ($playerData == null) {
            echo "Player not found";
        } else {
            $response = array($playerData->achievements, $playerData->achievementsOneTime, $playerData->achievementPoints, $playerData->networkExp, $playerData->networkLevel, $playerData->newPackageRank, $playerData->rankPlusColor, $playerData->displayname, $playerData->monthlyPackageRank, $playerData->packageRank, $playerData->monthlyRankColor, $playerData->rank, $playerData->uuid, $playerData->quests);
            echo json_encode($response);
        }
