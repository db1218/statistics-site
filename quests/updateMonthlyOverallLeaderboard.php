<?php

    $credentials = include('../credentials.php');

    $request = file_get_contents("php://input");
    $nameInput = json_decode($request);
    $uuid = $nameInput->uuid;
    $quests = $nameInput->quests;
    $ign = $nameInput->ign;

    // Create connection
    $conn = mysqli_connect($credentials['host'], $credentials['username'], $credentials['password'], $credentials['dbname']);

    // if connection error
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        $sql = "SELECT * FROM temp_table WHERE uuid='" . $uuid . "';";
        $result = $conn->query($sql);

        //if there is a result
        if ($result->num_rows > 0) {

            $fetched = [];

            // for each fetched month
            while ($row = $result->fetch_assoc()) {
                if ($row["ign"] != $ign) {
                    $sql = "UPDATE temp_table SET ign='" . $ign . "' WHERE uuid='" . $uuid . "';";
                    if ($conn->query($sql) === FALSE) {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                }
                array_push($fetched, $row);
            }

            // go through each input month, stop when complete or
            for ($i=0; $i<count($quests);$i++) {

                $found = FALSE;
                $i2=0;

                // while not found
                while ($i2<count($fetched) && $found == FALSE) {

                    // if matching month
                    if ($fetched[$i2]["month"] == $quests[$i][0]) {
                        $found = TRUE;
                        // if quests have changed (for current month)
                        if ($fetched[$i2]["quests"] != $quests[$i][1]) {
                            $sql = "UPDATE temp_table SET quests='" . $quests[$i][1] . "' WHERE uuid='" . $uuid . "' AND month='" . $quests[$i][0] . "';";
                            if ($conn->query($sql) === FALSE) {
                                echo "Error: " . $sql . "<br>" . $conn->error;
                            }
                        }
                    }

                    $i2++;
                }

                if ($found == FALSE) {
                    $sql = "INSERT INTO temp_table (uuid, quests, ign, month) VALUES('" . $uuid . "', '" . $quests[$i][1] . "', '" . $ign . "', '" . $quests[$i][0] . "');";
                    if ($conn->query($sql) === FALSE) {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                }

            }

        } else {
            for ($i=0; $i<count($quests); $i++) {
                $sql = "INSERT INTO temp_table (uuid, ign, quests, month) VALUES('" . $uuid . "', '" . $ign . "', '" . $quests[$i][1] . "', '" . $quests[$i][0] . "');";
                if ($conn->query($sql) === FALSE) {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }

        }

    }

    $conn->close();
