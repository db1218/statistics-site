<?php

    ini_set('display_errors', 0);

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $uuid = urlencode($nameInput->uuid);
    $month = urlencode($nameInput->thisMonth);

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
        $sql = "SELECT * FROM temp_table WHERE month='" . $month . "' ORDER BY quests desc;";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $users = [];
            $counter = 0;

            while($row = $result->fetch_assoc()) {
                $user = null;
                $counter = $counter + 1;

                $user->ign = $row['ign'];
                $user->uuid = $row['uuid'];
                $user->quests = $row['quests'];

                if ($uuid == $row['uuid']) {
                    $position = $counter;
                }

                array_push($users, $user);

            }

            $response = [];

            $short_users = array_slice($users, 0, 25);

            array_push($response, $short_users);
            array_push($response, $position);

            echo json_encode($response);

        }

    }

    $conn->close();
