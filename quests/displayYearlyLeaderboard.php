<?php

    ini_set('display_errors', 0);
    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $year = urlencode($nameInput->year);

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
        $sql = "SELECT ign, uuid, sum(quests) FROM temp_table WHERE month LIKE '%$year%' GROUP BY uuid ORDER BY sum(quests) DESC;";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $users = [];
            $counter = 0;
            $bestQuests = 0;
            $bestPos = 0;

            while($row = $result->fetch_assoc()) {

                $user = null;
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

            $response = [];

            $short_users = array_slice($users, 0, 250);

            array_push($response, $short_users);
            array_push($response, $bestPos);
            array_push($response, $bestQuests);

            echo json_encode($response);

        }

    }

    $conn->close();
