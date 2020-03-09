<?php

    $request = file_get_contents("php://input");
    $input = json_decode($request);
    $version = urlencode($input->version);

    $time = time();

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
        $sql = "INSERT INTO downloads (version, unixTime) VALUES ('" . $version . "', '" . date('Y-m-d H:i:s', $time) . "');";
        if ($conn->query($sql) === FALSE) {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

    }

    $conn->close();
