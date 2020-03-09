<?php
    $input = json_decode(file_get_contents("php://input"));
    $oldJson = file_get_contents("new.json");
    $array = json_decode($oldJson);
    $hasAchievement = False;
    foreach ($array as $achievement) {
        if ($input->path == $achievement->path) {
            $hasAchievement = True;
        }
    }
    if ($hasAchievement == False) {
        array_push($array, $input);
        file_put_contents("new.json", json_encode($array));
    }
    $new = json_decode(file_get_contents("new.json"));
    echo $new;
