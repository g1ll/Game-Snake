<?php
if ($_POST) { //Testa se houve requisição do tipo POST
    if ($_POST['pname'] && $_POST['pscore']) {//Testa se digitaram todos os campos
//Função strip_tag() filtra tags HTML
//Função pg_escape_string() adiciona cotas em campos do tipo string(filtra o uso das aspas)
        $name = strip_tags(pg_escape_string($_POST['pname'])); //filtra entrada
        $score = strip_tags(pg_escape_string($_POST['pscore'])); //filtra entrada
        //Alterar dados do user e password
        $conn = pg_connect("host=localhost port=5432 dbname=snake user=root password=root");

        //Cria o comando SQL e guarda na variável $sql
        $sql = "INSERT INTO ranking(name,score) VALUES('$name','$score')";

        //Chama a função pg_query() que executa o comando SQL da variável $sql na conexão
        // representada pela variável $conn. Retorna o resultado na variável $resultado
        $resultado = pg_query($conn, $sql);

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