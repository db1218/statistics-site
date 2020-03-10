<?php

    $credentials = include('../credentials.php');

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $games = $nameInput->quests;
    $uuid = urlencode($nameInput->uuid);

    // Create connection
    $conn = mysqli_connect($credentials['host'], $credentials['username'], $credentials['password'], $credentials['dbname']);

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        // get the entry for that player and gamemode
        $sql = "SELECT * FROM total_quests WHERE id='" . $uuid . "';";
        $result = $conn->query($sql);
        // for each gamemode
        foreach ($games as $game) {
            // if player is already in there
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    // if correct game
                    if ($game[0] == $row["game"]) {
                        if ($game[1] != $row["quests"]) {
                            // if quests have changed
                            $sql = "UPDATE total_quests SET quests='" . $game[1] . "', ign='" . $ign . "' WHERE id='" . $uuid . "' AND game='" . $game[0] . "';";
                            if ($conn->query($sql) === FALSE) {
                                echo "Error: " . $sql . "<br>" . $conn->error;
                            }
                        } else if ($row["ign"] != $ign) {
                            // update name
                            $sql = "UPDATE total_quests SET ign='" . $ign . "' WHERE id='" . $uuid . "' AND game='" . $game[0] . "';";
                            if ($conn->query($sql) === FALSE) {
                                echo "Error: " . $sql . "<br>" . $conn->error;
                            }
                        }
                    }
                }
            } else {
                if ($game[1] != 0) {
                    $sql = "INSERT INTO total_quests (id, quests, ign, game) VALUES('" . $uuid . "', '" . $game[1] . "', '" . $ign . "', '" . $game[0] . "');";
                    if ($conn->query($sql) === FALSE) {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                }
            }
        }
    }

    $conn->close();
