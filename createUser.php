<?php
    header("Access-Control-Allow-Origin: *");

    $time_shift = $_POST['x'];


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
    $sql = "INSERT INTO `users` (`user_id`, `time_shift`, `joined`) VALUES (NULL, $time_shift, NULL)";
    
    if ($dbh->exec($sql) === 1)
        $last_id = $dbh->lastInsertId();
        echo $last_id;

?>