<?php

    $credentials = include('../credentials.php');

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $year = urlencode($nameInput->year);

    $JSONobj = json_decode(file_get_contents("https://api.mojang.com/users/profiles/minecraft/$ign"));
    $uuid = $JSONobj->id;

    // Create connection
    $conn = mysqli_connect($credentials['host'], $credentials['username'], $credentials['password'], $credentials['dbname']);

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        $sql = "SELECT ign, uuid, sum(quests) FROM temp_table WHERE month LIKE '%$year%' GROUP BY uuid ORDER BY sum(quests) DESC;";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $users = [];
            $counter = 0;
            $bestQuests = 0;
            $bestPos = 0;

            while($row = $result->fetch_assoc()) {

                $user = new \stdClass();
                $counter = $counter + 1;

                $user->ign = $row['ign'];
                $user->uuid = $row['uuid'];
                $user->quests = $row['sum(quests)'];

                if ($uuid == $row['uuid']) {
                    if ($row['sum(quests)'] > $bestQuests) {
                        $bestQuests = $row['sum(quests)'];
                        $bestPos = $counter;
                    }
                }

                array_push($users, $user);

            }

            $response = new \stdClass();

            $response->users = array_slice($users, 0, 250);
            $response->position = $bestPos;
            $response->quests = $bestQuests;

            echo json_encode($response);

        }

    }

    $conn->close();
