<?php

    ini_set('display_errors', 0);

    $response = null;

    $json_info = file_get_contents("dailyQuestInfo.json");
    $dailyInfo = json_decode($json_info);

    $response[0] = $dailyInfo;

    $json_info = file_get_contents("weeklyQuestInfo.json");
    $weeklyInfo = json_decode($json_info);

    $response[1] = $weeklyInfo;

    echo json_encode($response);
