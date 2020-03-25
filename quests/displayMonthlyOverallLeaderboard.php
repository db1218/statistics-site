<?php

    $credentials = include('../credentials.php');

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $uuid = urlencode($nameInput->uuid);

    $conn = mysqli_connect($credentials['host'], $credentials['username'], $credentials['password'], $credentials['dbname']);

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        $sql = "SELECT * FROM temp_table ORDER BY quests DESC;";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $users = [];
            $counter = 0;
            $bestQuests = 0;
            $bestPos = 0;
            $bestMonth = 0;

            while($row = $result->fetch_assoc()) {

                $user = new \stdClass();
                $counter = $counter + 1;

                $user->ign = $row['ign'];
                $user->uuid = $row['uuid'];
                $user->quests = $row['quests'];
                $user->month = $row['month'];

                if ($uuid == $row['uuid']) {
                    if ($row['quests'] > $bestQuests) {
                        $bestQuests = $row['quests'];
                        $bestPos = $counter;
                        $bestMonth = $row['month'];
                    }
                }

                array_push($users, $user);

            }

            $response = [];

            $short_users = array_slice($users, 0, 250);

            array_push($response, $short_users);
            array_push($response, $bestPos);
            array_push($response, $bestQuests);
            array_push($response, $bestMonth);

            echo json_encode($response);

        }

    }

    $conn->close();
