<?php
    header("Access-Control-Allow-Origin: *");

    $day = $_POST['x'];
    $result = $_POST['y'];
    $user = $_POST['z'];


    $host_name = 'db5011222160.hosting-data.io';
    $database = 'dbs9477850';
    $user_name = 'dbu2207449';
    $password = 'ryqquq-ziTqe2-gejzex';
    $dbh = null;

    try {
        $dbh = new PDO("mysql:host=$host_name; dbname=$database;", $user_name, $password);
    } catch (PDOException $e) {
        echo "Error!:" . $e->getMessage() . "<br/>";
        die();
    }

    if ($day > -1) {
        $sql = "INSERT INTO `results_daily` (`id`, `user_id`, `day`, `result`, `submitted`) VALUES (NULL, $user, $day, $result, NULL)";
        if ($dbh->exec($sql) === 1) {
            echo 'daily logged' . $day;
        }
    } else {
        $sql = "INSERT INTO `results_practice` (`id`, `user_id`, `result`, `submitted`) VALUES (NULL, $user, $result, NULL)";
        if ($dbh->exec($sql) === 1) {
            echo 'practice logged';
        }
    }




?>