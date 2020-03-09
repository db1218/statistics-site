<?php

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $ign = urlencode($nameInput->ign);
    $quests = urlencode($nameInput->quests);

    ini_set("allow_url_fopen", 1);
    $url = file_get_contents("https://api.mojang.com/users/profiles/minecraft/$ign");
    $JSONobj = json_decode($url);
    $id = $JSONobj->id;

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
        $sql = "SELECT * FROM monthly_quests WHERE id='" . $id . "';";
        $result = $conn->query($sql);

        // if there is a result
        if ($result->num_rows > 0) {

            $sql = "UPDATE monthly_quests SET quests='" . $quests . "', ign='" . $ign . "' WHERE id='" . $id . "';";
            if ($conn->query($sql) === FALSE) {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }


        } else {
            $sql = "INSERT INTO monthly_quests (id, quests, ign) VALUES('" . $id . "', '" . $quests . "', '" . $ign . "');";
            if ($conn->query($sql) === FALSE) {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

        }

    }

    echo json_encode($id);

    $conn->close();
