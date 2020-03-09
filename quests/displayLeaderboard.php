<?php

    ini_set('display_errors', 0);
    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $game = urlencode($nameInput->game);
    $num = urlencode($nameInput->num);

    ini_set("allow_url_fopen", 1);
    $url = file_get_contents("https://api.mojang.com/users/profiles/minecraft/$ign");
    $JSONobj = json_decode($url);
    $uuid = $JSONobj->id;

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
        $sql = "SELECT * FROM total_quests WHERE game='" . $game . "' ORDER BY quests DESC;";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $users = [];
            $counter = 0;

            while($row = $result->fetch_assoc()) {
                $user = null;
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

            $response = [];

            $short_users = array_slice($users, 0, $num);

            array_push($response, $short_users);
            array_push($response, $position);
            array_push($response, $quests);

            echo json_encode($response);

        }

    }

    $conn->close();
