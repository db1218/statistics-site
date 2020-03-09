<?php
    ini_set("allow_url_fopen", 1);
    $url = file_get_contents("https://api.hypixel.net/resources/achievements");
    $JSONobj = json_decode($url);
    $apiLastUpdated = $JSONobj->lastUpdated;
    $updatedAchievements = $JSONobj->achievements;
    $latestTime = file_get_contents("latest.txt");
    if ($apiLastUpdated > json_decode($latestTime)) {
        file_put_contents("latest.txt", $apiLastUpdated);
        $latest = file_get_contents("latest.json");
        file_put_contents("latest.json", json_encode($updatedAchievements));
        echo json_encode([1, $latest, $apiLastUpdated]);
    } else {
        echo json_encode([0]);
    }
