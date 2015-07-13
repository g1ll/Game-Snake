<?php
if ($_POST) { //Testa se houve requisição do tipo POST
    if ($_POST['pname'] && $_POST['pscore']) {//Testa se digitaram todos os campos
        $conn = mysqli_connect('localhost', 'root', 'root', 'snake');
        $name = strip_tags(mysqli_real_escape_string($conn,$_POST['pname'])); //filtra entrada
        $score = strip_tags(mysqli_real_escape_string($conn,$_POST['pscore'])); //filtra entrada
        //Alterar dados do user e password
        //$conn = mysqli_connect("host=localhost port=3306 dbname=snake user=root password=root");
        

        //Cria o comando SQL e guarda na variável $sql
        $sql = "INSERT INTO ranking(name,score) VALUES('$name','$score')";

        //Chama a função pg_query() que executa o comando SQL da variável $sql na conexão
        // representada pela variável $conn. Retorna o resultado na variável $resultado
        $resultado = mysqli_query($conn, $sql);

        //Testa a variável $variável, um valor NULL representa erro na execução do SQL
        if ($resultado != null)
            $mensagem = "Ranking Atualizado!!";
        else
            $mensagem = "Erro ao inserir dados!!";
    }else {
        $mensagem = "Informe todos os campos!!";
    }
}
echo $mensagem;
?>