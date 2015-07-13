<?php

//Alterar dados do user e password
$conn = pg_connect("host=localhost port=5432 dbname=snake user=root password=root");

$sql = "SELECT * FROM ranking ORDER BY SCORE DESC LIMIT 5";//Limita até as primeiras cinco posições

$result = pg_query($conn, $sql);

if (pg_num_rows($result) > 0) {
    $result = pg_fetch_all($result);
    //print_r($result);
    echo json_encode($result);// transforma o array em um formato de objetos JSON
    pg_close($conn);//Fecha a conexão
}
?>