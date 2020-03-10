<?php

    $credentials = include('../credentials.php');

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $games = $nameInput->achievements;
    $uuid = urlencode($nameInput->uuid);
    $maxed = urlencode($nameInput->maxed);
    $maxedCount = urlencode($nameInput->maxedCount);

    // Create connection
    $conn = mysqli_connect($credentials['host'], $credentials['username'], $credentials['password'], "achievements");

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        // for each gamemode
        foreach ($games as $game) {
            // get the entry for that player and gamemode
            $sql = "SELECT * FROM per_game WHERE id='" . $uuid . "' AND game='" . $game[0] . "';";
            $result = $conn->query($sql);
            // if player is already in there
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    if ($game[1][0] != $row["points"]) {
                        // if points have changed
                        $sql = "UPDATE per_game SET points='" . $game[1][0] . "', achievements='" . $game[1][1] . "', ign='" . $ign . "' WHERE id='" . $uuid . "' AND game='" . $game[0] . "';";
                        if ($conn->query($sql) === FALSE) {
                            echo "Error: " . $sql . "<br>" . $conn->error;
                        }
                    } else if ($row["ign"] != $ign) {
                        // update name
                        $sql = "UPDATE per_game SET ign='" . $ign . "' WHERE id='" . $uuid . "' AND game='" . $game[0] . "';";
                        if ($conn->query($sql) === FALSE) {
                            echo "Error: " . $sql . "<br>" . $conn->error;
                        }
                    }
                }
            } else {
                if ($game[1][0] != 0) {
                    $sql = "INSERT INTO per_game (id, points, ign, game, achievements) VALUES('" . $uuid . "', '" . $game[1][0] . "', '" . $ign . "', '" . $game[0] . "', '" . $game[1][1] . "');";
                    if ($conn->query($sql) === FALSE) {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                }
            }
        }

        // maxed games
        // if ($maxCount != 0) {
        //     $sql = "SELECT * FROM per_game WHERE id='" . $uuid . "' AND game='maxed';";
        //     $result = $conn->query($sql);
        //
        //     if ($result->num_rows > 0) {
        //         while($row = $result->fetch_assoc()) {
        //             if ($row["points"] != $nameInput->maxedCount) {
        //                 // if points have changed
        //                 $sql = "UPDATE per_game SET points='" . $maxedCount . "' WHERE id='" . $uuid . "' AND game='maxed';";
        //                 if ($conn->query($sql) === FALSE) {
        //                     echo "Error: " . $sql . "<br>" . $conn->error;
        //                 }
        //             } else if ($row["ign"] != $ign) {
        //                 // if name has changed
        //                 $sql = "UPDATE per_game SET ign='" . $ign . "' WHERE id='" . $uuid . "' AND game='maxed';";
        //                 if ($conn->query($sql) === FALSE) {
        //                     echo "Error: " . $sql . "<br>" . $conn->error;
        //                 }
        //             }
        //         }
        //     } else {
        //         $sql = "INSERT INTO per_game (id, points, ign, game, achievements) VALUES('" . $uuid . "', '" . $maxedCount . "', '" . $ign . "', 'maxed', '0');";
        //         if ($conn->query($sql) === FALSE) {
        //             echo "Error: " . $sql . "<br>" . $conn->error;
        //         }
        //     }
        // }
    }

    $conn->close();
