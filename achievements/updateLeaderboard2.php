<?php

    ini_set('display_errors', 0);
    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $games = $nameInput->achievements;
    $uuid = urlencode($nameInput->uuid);
    $maxed = urlencode($nameInput->maxed);
    $maxedCount = urlencode($nameInput->maxedCount);

    $servername = "";
    $username = "";
    $password = "";
    $dbname = "";

    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        // for each gamemode
        foreach ($games as $game) {
            // get the entry for that player and gamemode
            $sql = "UPDATE per_game SET points='" . $game[1][0] . "', ign='" . $ign . "', achievements='" . $game[1][1] . "' where id='" . $uuid . "' AND game='" . $game[0] . "';";
            if ($conn->query($sql) === FALSE) {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
            echo $conn->affected_rows;
        }
    }

    $conn->close();
