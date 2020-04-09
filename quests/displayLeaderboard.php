<?php

    $credentials = include('../credentials.php');

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $game = urlencode($nameInput->game);
    $num = urlencode($nameInput->num);

    $JSONobj = json_decode(file_get_contents("https://api.mojang.com/users/profiles/minecraft/$ign"));
    $uuid = $JSONobj->id;

    // Create connection
    $conn = mysqli_connect($credentials['host'], $credentials['username'], $credentials['password'], $credentials['dbname']);

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        $sql = "SELECT * FROM total_quests WHERE game='" . $game . "' ORDER BY quests DESC;";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $users = [];
            $counter = 0;

            while($row = $result->fetch_assoc()) {
                $user = new \stdClass();
                $counter = $counter + 1;

                $user->ign = $row['ign'];
                $user->uuid = $row['id'];
                $user->quests = $row['quests'];

                if ($uuid == $row['id'] && $game == $row['game']) {
                    $position = $counter;
                    $quests = $row['quests'];
                }

                array_push($users, $user);

            }

            $response = new \stdClass();

            $response->users = array_slice($users, 0, $num);
            $response->position = $position;
            $response->quests = $quests;

            echo json_encode($response);

        }

    }

    $conn->close();
