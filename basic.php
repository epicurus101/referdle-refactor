<?php
    header("Access-Control-Allow-Origin: *");

    $day = $_POST['x'];
    $result = $_POST['y'];


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
    $sql = "INSERT INTO `results` (`id`, `day`, `result`) VALUES (NULL, $day, $result)";
    if ($dbh->exec($sql) === 1)
        echo $day;

?>