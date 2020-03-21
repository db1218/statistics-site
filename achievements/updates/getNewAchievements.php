<?php
    $array = json_decode(file_get_contents("new.json"));
    $newArray = array(); // add achievements that are still new
    $hasChanged = False;
    foreach ($array as $achievement) {
        // if a week has passed, remove
        if ($achievement->time < time()*1000 - 604800000) {
            $hasChanged = True;
        } else {
            array_push($newArray, $achievement);
        }
    }
    if ($hasChanged == True) {
        file_put_contents("new.json", json_encode($newArray));
        echo json_encode($newArray);
    } else {
        echo json_encode($array);
    }

