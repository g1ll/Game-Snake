//EXEMPLO UTILIZANDO AS BIBLIOTECAS JQUERY E JQUERY MOBILE ASSIM COMO CHAMADAS AJAX
$(document).ready(canvasApp); //Esperando o carregamento completo da página equivalente ao windon.onload
$.mobile.loading().hide();
//window.addEventListener("load", eventWindowLoaded, false);
//function eventWindowLoaded() {
//    canvasApp(); //Chamada da função da nossa aplicação
//}

function canvasApp() {

    var canvas = $("#canvas")[0];//Igual ao documente.getElementById("#canvas");
//    var canvas = document.getElementById("canvas");//Nativo
    var ctx = canvas.getContext("2d"); //Varíavel ctx guarda o contexto 2D
    var size = getWindowSize(); //Função para retornar o tamanho da tela
    var w = size.w * 0.99;
    var h = size.h * 0.99;
    var cw; //Criando a váriavel qeu determina o tamanho de cada célula do jogo
    var text_size = size.h * 0.025;
    var d; //Definindo a direção padrão de movimento do snake
    var food; //Variável para guardar a comida;
    var score; //Variável para armazenar a pontuação;
    var speed; //Variávell para armazenar e controlar a velocidade do jogo
    var key; //Variável para armazenar a tecla pressionada pelo jogador
    var touchX;
    var touchY;
    var snake_array; //um vetor de células que formam o snake
    var game_loop; //Variável para guardar as configurações do LOOP principal do jogo
    var theme = []; //Vetor para guardar os objetos Audio utilizados para reproduzir os temas do jogo
    var atualTheme; //Variável para armazenar o índice da musica de fundo atual
    var pausedgame = true; //Variável para indicar o estado de jogo parado
    var soundeffect = []; //Veter para guardar sons de efeitos do jogo
    var lscore; //Variável para guardar a última pontuação no Ranking

    canvas.width = w; // A variável w guarda a largura do canvas
    canvas.height = h; // A variável h guarda a altura do canvas

    //Configurando os Eventos
    //Controlando o snake
    //Captura de teclas pela JQuery
    $(document).keydown(function (e) {
        key = e.which;//Armazenando o valor da tecla pressionada na variável global key
        if (key === 13 && pausedgame) //Testa se o usuário apertou enter e se o game esta parado
            init();
    });
    //Controlando o snake com o touch JQuery Mobile
    $("#canvas").bind('tap', function (event) {
        if (pausedgame)
            init();
        touchX = event.pageX;
        touchY = event.pageY;
    });

//    //Evento do teclado nativo
//    window.addEventListener("keydown", function (e) {
//        key = e.keyCode;
//        if (key === 13 && pausedgame) //Testa se o usuário apertou enter e se o game esta parado
//            init();
//
//    });
//    //Controlando o snake com o touch Native JS
//    document.getElementById("canvas").addEventListener("touchstart", function (event) {
//        if (pausedgame)
//            init();
//        event.preventDefault();
//        touchX = event.targetTouches[0].pageX;
//        touchY = event.targetTouches[0].pageY;
//    }, false);

    //Criando e configuando o Audio

    //Adicionando os temas no vetor theme
    theme.push(new Audio("sounds/sound1.mp3")); //Criando o objeto audio com o caminho do arquivo mp3
    theme.push(new Audio("sounds/sound2.mp3"));
    theme.push(new Audio("sounds/sound3.mp3"));

    //Adicionando o efeito para capturar comida
    soundeffect.push(new Audio("sounds/atefood.mp3"));
    soundeffect.push(new Audio("sounds/atefood2.mp3"));


    //Configurando os objetos de áudio do vetor theme através de um FOR
    for (var i = 0; i < theme.length; i++) {
        theme[i].load(); //Carregando o arquivo de áudio
        theme[i].volume = .25; //Configurando o volume da música em 25%
        if (typeof theme[i].loop === 'boolean')//Testa se existe suporte à propriedade loop
        {
            //Se o navegador possui suporte apenas configuramos a propriedade loop para true
            theme[i].loop = true;//Execução em loop ativada
        }
        else {//Caso não exista suporte utilizaremos o evento ended para saber quanco a música chegou ao fim
            //Com o evento ended chamamos um função que irá voltar ao início da reprodução do arquivo de 
            // áudio toda vez que a reprodução chegar ao final da música
            theme[i].addEventListener('ended', function () { //Adicionando o evento ended (fim da reprodução)
                this.currentTime = 0;//Voltando a reprodução ao início da música
            }, false);
        }//FIM IF
    }

    //Configurando os objetos de áudio do vetor theme através de um FOR
    for (var i = 0; i < soundeffect.length; i++) {
        soundeffect[i].load(); //Carregando o arquivo de áudio
        soundeffect[i].volume = .5; //Configurando o volume da música em 50%
    }

    //Chamando a função start para apresentar a tela incial
    start();

    function start() {

        //Limpando a tela ou redesenhando o fundo
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
//        ctx.strokeStyle = "black";
//        ctx.strokeRect(0, 0, w, h);
        //Imprimindo as instruções iniciais
        ctx.fillStyle = "black"; //Define a cor preta para o texto
        ctx.font = "bolder " + text_size + "px _sans"; //Define a fonte do texto
        var text1 = " Aperte <enter> para iniciar !!";
        var text2 = "Use as teclas ←↑→↓ para movimentar o snake !";
        var text3 = "Toque na tela touch ou clique na direção desejada!";
        var metrics = ctx.measureText(text1);//Recupera as medidas em pixel que o texto ocupa no canvas
        var textWidth = metrics.width; //Recupera a largura (width) em pixel do texto
        //posiciona o texto no centro do canvas
        // o valor xText será sempre igual à metade do canvas menos a metada da largura do texto
        var xText = (canvas.width / 2) - (textWidth / 2);
        var yText = 2*text_size; //Posiciona o texto na altura 14 pixel, esta configuração depende do tamanho da fonte        
        ctx.fillText(text1, xText, yText); //Desenha o texto na tela
        yText += text_size + 10;
        metrics = ctx.measureText(text2);//Recupera as medidas em pixel que o texto ocupa no canvas
        textWidth = metrics.width; //Recupera a largura (width) em pixel do texto
        xText = (canvas.width / 2) - (textWidth / 2);
        ctx.fillText(text2, xText, yText); //Desenha o texto na tela
        yText += text_size + 10;
        metrics = ctx.measureText(text3);//Recupera as medidas em pixel que o texto ocupa no canvas
        textWidth = metrics.width; //Recupera a largura (width) em pixel do texto
        xText = (canvas.width / 2) - (textWidth / 2);
        ctx.fillText(text3, xText, yText); //Desenha o texto na tela
    }

    function gameOver() {
        clearInterval(game_loop);
        pausedgame = true;
        start();
        //Imprimindo as instruções iniciais

        ctx.font = "bolder " + text_size + "px _sans"; //Define a fonte do texto
        if (score === 0) {
            ctx.fillStyle = "red"; //Define a cor preta para o texto
            score = 'ZERO';
        } else {
            ctx.fillStyle = "blue"; //Define a cor preta para o texto
        }

        var text1 = " Você fez " + score + " ponto(s) !!!";
        var metrics = ctx.measureText(text1);//Recupera as medidas em pixel que o texto ocupa no canvas
        var textWidth = metrics.width; //Recupera a largura (width) em pixel do texto
        //posiciona o texto no centro do canvas
        // o valor xText será sempre igual à metade do canvas menos a metada da largura do texto
        var xText = (canvas.width / 2) - (textWidth / 2);
        var yText = 7*text_size; //Posiciona o texto na altura 14 pixel, esta configuração depende do tamanho da fonte        
        ctx.fillText(text1, xText, yText); //Desenha o texto na tela
        //Testa se existe a pontuação do último Ranking
        if (lscore !== null) {
            if (score > lscore && score !== 'ZERO') {//Testa se a pontuação atual é maior que a do ultimo no ranking
                //Chamada a Função setRanking a qual atualiza o rankingo do jogo
                setRanking();//Se a pontuação for maior chama a função setRanking()
                //alert(score+">"+lscore); //Alerte para testar quando é atualizado o Ranking
            } else {
                getRanking();//Se a pontuação não é maior apenas imprimi o Ranking atual com a função getRanking
                //alert(score+"<"+lscore);
            }
        } else {//Caso acaonteça algum erro na hora de ler a pontuação da última posição do Ranking
            alert("Erro ao recuperar ultima pontuação !!!");
            getRanking();
        }
    }

    //Função init utilizada para iniciar e reiniciar o jogo
    function init()
    {
//        getLastRanking(); //Armazenando a pontuação do último Ranking
        pausedgame = false;
        key = 0;//Inicializando a variável de tecla em 0
        d = "right";  //Definindo a direção padrão de movimento do snake
        score = 0;//Reiniciando a pontuação          //Configurações de tamanho de tela
        size = getWindowSize();
        w = size.w * 0.99;
        h = size.h * 0.99;
        //Definindo o tamanho padrão das células (Tiles) do mapa do jogo
        //de acordo com o tamanho da tela do dispositivo
        cw = (size.w <= size.h ? cw = size.w * 0.05 : size.h * 0.05);
        speed = 120;//Reiniciando a velocidade padrão do jogo
        create_snake(); //Criando o personagem snake
        create_food(); //Criando a comida
        atualTheme = 0;
        if (theme[atualTheme].paused) //Testa se o áudio já está sendo reproduzido
            theme[atualTheme].play(); //Executando o tema do jogo
        else
            theme[atualTheme].currentTime = 0; //Voltando ao início da música  


        //Recriando o intervalo para o loop
        if (typeof game_loop !== "undefined") //Testa se o loop já foi criado
            clearInterval(game_loop); //Se o loop já existe então limpa o intervalo para depois ser recriado
        game_loop = setInterval(paint, speed); //Cria o intervalo de loop
    }

    //Função para criar o snake
    function create_snake()
    {
        var length = 1; //Tamanho inicial do snake
        snake_array = []; //Inicialização do array vazio
        for (var i = length - 1; i >= 0; i--)
        {
            //Agora criamos o snake horizontalmente no topo e a esquerda do canvas (y=0)
            snake_array.push({x: i, y: 0});// A função push adiciona ao vetor um objeto com as propriedades x e y
        }
    }

    //Função para criar a comida
    function create_food()
    {
        //Criando cores aleatórias para a comida
        do {
            var fr = Math.round(Math.random()) * 255;//Gerando valores aleatórios de 0 ou 255 para o vermelho R
            var fg = Math.round(Math.random()) * 255;//Gerando valores aleatórios de 0 ou 255 para o verde G
            var fb = Math.round(Math.random()) * 255;//Gerando valores aleatórios de 0 ou 255 para o vazul B
        } while ((fr === fg && fr === fb) || (fr === 0 && fg === fr) || (fb === 255 && fg === fb));
        //O while detecta se todos são zero ou 255, ainda também gera novos valores caso sejam gerados tons de azul para a comida
        //ou seja a comida nunca será azul ou possuirá algum tom semelhante;
        //na prática evida as combinações rgb(0,255,255) e rgb(0,0,255);

        food = {//Criando o objeto food com os atributos X, Y e Color
            // Posicionando aleatóriamente no eixo X entre os limites do mapa
            x: Math.round(Math.random() * (w - cw) / cw),
            // Posicionando aleatóriamente no eixo Y entre os limites do mapa
            y: Math.round(Math.random() * (h - cw) / cw),
            //color of the food
            //Configurando a cor da comida com as variáveis geradas de forma aleatória
            //rgb(255,0,0) Red
            color: "rgb(" + fr + "," + fg + "," + fb + ")"
        };
        //Este código cria uma célula com o x e y entre 0 e 44
        //Por que existem 45 posições (450/10) entre as colunas e linhas do mapa
    }//Fim da função create Food

    //Função genérica para desenhar céluas no mapa
    //Recebe com parâmetros as posições x e y
    function paint_cell(x, y, color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(x * cw, y * cw, cw, cw);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * cw, y * cw, cw, cw);
    }

    //Função para desernhar uma célula em forma de círulo
    function paint_circle_cell(x, y, color)
    {
        var raio = cw / 2; //o Raio da célula é a metada do tamanho padrão da célula do mapa (Tile)
        ctx.beginPath(); //Inicia a desenho do traço
        ctx.strokeStyle = "white"; //Configura o contorno branco para o círculo
        ctx.lineWidth = 1; //Configura a expessura do traço do círculo
        ctx.arc(//Função arc para desenhar um círculo
                x * cw + raio, //Posição X, referência ao centro do círculo;
                y * cw + raio, //Posição Y;
                raio, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.fillStyle = color; //Configura a cor a ser preenchido o círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.stroke(); //Desenha o contorno do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual
    }//Fim da função paint_circle_cell

    //Função paint_fruit_cell para desnhar a comida do snake como uma fruta
    //Recebe os parâmetros x e y para posicionar a fruta, além de color para a cor
    function paint_fruit_cell(x, y, color)
    {
        var raio = cw / 2.5; //Raio do círculo que formará a fruta
        ctx.beginPath();//Começa a desenhar o primeiro círculo
        ctx.arc(
                x * cw + raio, //Posição X, referência ao centro do círculo;
                y * cw + raio, //Posição Y;
                raio, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.fillStyle = color; //Configura a cor a ser preenchido o círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual

        ctx.beginPath();//Começa a desenhar o segundo cŕculo
        ctx.arc(
                x * cw + raio + 2, //Posição X, referência ao centro do círculo;
                y * cw + raio, //Posição Y;
                raio, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.fillStyle = color; //Configura a cor a ser preenchido o círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual

        ctx.beginPath();//Inicia o desenho da folha da fruta
        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
        ctx.lineWidth = 2;
        ctx.arc(
                x * cw + raio + 3.5, //Posição X, referência ao centro do círculo;
                y * cw + raio - 2, //Posição Y;
                raio, //Raio do círculo;
                (Math.PI / 180) * 180, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 270, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.stroke(); //Desenha o contorno do círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual
    }//FIM da função paint_fruit_cell()

    //Função para desenhar o smile a partir de uma posição x e y
    function paint_smile_cell(x, y) {
        var raio = cw / 2; //Raio do circulo do smile igual à metade da célula do jogo cw
        var sx = x * cw + raio; //posicionando o smile, centro da célula cw
        var sy = y * cw + raio; //posicionando o smile, centro da célula cw

        //Desenhando a cabeça do Smile
        ctx.beginPath();//Iniciando o desenho
        ctx.strokeStyle = "black"; //configurando o contorno com a cor preta
        ctx.lineWidth = 1; //configurando a expessura do traço
        ctx.arc(
                sx, //Posição X, referência ao centro do círculo;
                sy, //Posição Y;
                raio, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.fillStyle = "yellow"; //Configura a cor a ser preenchido o círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.stroke(); //Desenha o contorno do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual

        //Desenhando a Boca do Smile        
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.arc(
                sx, //Posição X, referência ao centro do círculo;
                sy, //Posição Y;
                cw / 4, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 180, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.stroke(); //Desenha o contorno do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual
//
//        //Olho Esquerdo
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = cw * 0.1;
        ctx.arc(
                sx - cw / 5, //Posição X, referência ao centro do círculo;
                sy - cw / 5, //Posição Y;
                cw / 20, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.fillStyle = "black"; //Configura a cor a ser preenchido o círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.stroke(); //Desenha o contorno do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual    
//
//        //Olho Direito
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = cw * 0.1;
        ctx.arc(
                sx + cw / 5, //Posição X, referência ao centro do círculo;
                sy - cw / 5, //Posição Y;
                cw / 20, //Raio do círculo;
                (Math.PI / 180) * 0, //Ângulo inicial, onde começará o traço;
                (Math.PI / 180) * 360, //Ângulo final, onde termina o traço;
                false //Sentido do traço, horário (FALSE), anti-horário (TRUE);
                );
        ctx.fillStyle = "black"; //Configura a cor a ser preenchido o círculo
        ctx.fill(); //Realiza o prenchimento do círculo
        ctx.stroke(); //Desenha o contorno do círculo
        ctx.closePath(); //Finaliza o caminho "Path" do desenho atual
    }//FIM da função que desenha o SMILE


    //Função responsável pelo desenho do jogo
    function paint() {
        //Configurações de tamanho de tela
        size = getWindowSize();
        w = size.w * 0.99;
        h = size.h * 0.99;
        text_size = size.h * 0.025;
        //Atualizando o tamanho padrão das células (Tiles) do mapa do jogo
        //de acordo com o tamanho da tela do dispositivo
        cw = (size.w <= size.h ? cw = size.w * 0.05 : size.h * 0.05);

        w = window.innerWidth * 0.99;
        canvas.width = w;  // A variável w guarda a largura do canvas
        h = window.innerHeight * 0.99;
        canvas.height = h; // A variável h guarda a altura do canvas
        //Limpando a tela ou redesenhando o fundo
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
//        ctx.strokeStyle = "black";
//        ctx.strokeRect(0, 0, w, h);

        //variáveis de moviemento o Snake
        var nx = snake_array[0].x; //Nova posição X a partir da posição X atual
        var ny = snake_array[0].y; //Nova posição Y a partir da posição Y atual

        //Controlando o snake com o teclado e telas touchscreen
        //Evitando o bug de apertar mais de uma tecla
        // Tecla seta para a esquerda ou tocar qualquer posição X a esquerda da posição atual do snake
        if ((key === 37 || (touchX < (nx * cw) && touchX !== 0)) && d !== "right")
            d = "left"; //Determina a direção para a esquerda
        // Tecla seta para cima ou tocar qualquer posição Y acima da posição Y atual do snake
        else if ((key === 38 || (touchY < (ny * cw) && touchY !== 0)) && d !== "down")
            d = "up"; //Determina a direção para cima
        // Tecla seta para a direita ou tocar qualquer posição X a direita da posição atual do snake
        else if ((key === 39 || (touchX > (nx * cw) && touchX !== 0)) && d !== "left")
            d = "right"; //Determina a direção para a direita
        // Tecla seta para baixo ou tocar qualquer posição Y abaixo da posição Y atual do snake
        else if ((key === 40 || (touchY > (ny * cw) && touchY !== 0)) && d !== "up")
            d = "down"; //Determina a direção para baixo

        //zera o registro das posições X e Y do toque na tela
        touchX = 0;
        touchY = 0;

        //Movimentando o snake        
        if (d === "right")
            nx++;
        else if (d === "left")
            nx--;
        else if (d === "up")
            ny--;
        else if (d === "down")
            ny++;

        //Testando as regras de Game-Over
        // O snake não pode tocar a borda do mapa do jogo
        // O snake não pode colidir com si mesmo
        if (nx === -1 //Testa a colisão com a margem esquerda
                || nx === Math.round(w / cw) //Testa a colisão com a margem direita
                || ny === -1 //Testa acolisão com a margem superior
                || ny === Math.round(h / cw) //Testa colisão com a margem inferior
                || check_collision(nx, ny, snake_array)) //testa a colisão do próximo passo do snake com ele mesmo
        {
            //Pausa a música antes de reiniciar o jogo
            theme[atualTheme].pause(); //Para a reprodução do tema atual
            theme[atualTheme].currentTime = 0; //Reinicia a reprodução para o segundo zero


            //Executa a função gameover para encerrar o jogo e apresentar a pontuação
            gameOver();
            return; //Finaliza a execução da função paint
        }



        //Testa se a posição do snake é compatível com a comida
        if (nx === food.x && ny === food.y)
        {

            //Sorteia um índice no vetor de sons de efeito
            var isound = Math.round((Math.random() * (soundeffect.length - 1)));
            //Tocando o som para efeito de captura da comida
            soundeffect[isound].play();

            //Criando uma nova célula para o snake
            var tail = {x: nx, y: ny};
            //Criando uma nova comida
            create_food();
            score++; //Incrementa a pontuação do jogo
            //Controle dos níveis
            // Testa se a pontuação é multiplo de 10 (score%10==0) (10 ; 20 ) 
            // speed > 30 : não altera o nível se a velocidade já é 30
            if (score % 10 === 0 && speed > 30) {

                speed /= 2; //Divide a velocidade por dois 

                //1º nível (score==0) speed =120
                //2º nível (score==10)speed =120/2 = 60
                //3º nível (score==20)speed =60/2 = 30 (último nível)

                theme[atualTheme].pause(); //Para a reprodução da música atual
                theme[atualTheme].currentTime = 0;//Volta para o início da música
                atualTheme++; //Incrementa a variável que indica a música a ser reproduzida
                theme[atualTheme].currentTime = 0; //Volta para o início da música
                theme[atualTheme].play(); //Reproduz a música de acordo com o nível do jogo


                //Recriando o intervalo para o loop
                if (typeof game_loop !== "undefined") //Testa se o loop já foi criado
                    clearInterval(game_loop); //Se o loop já existe então limpa o intervalo para depois ser recriado
                game_loop = setInterval(paint, speed); //Cria o intervalo de loop
            }
        } else {
            var tail = snake_array.pop(); //Retira o ultimo elemento do array
            tail.x = nx; // Defini a próxima posição X para o novo elemento
            tail.y = ny; // Defini a próxima posição Y para o novo elemento
        }
        snake_array.unshift(tail); //Recoloca o elemento na primeira posição do array

        //Vamos agora desenhar o snake
        //Será desenhado apenas o primeiro elemento do array
        for (var i = snake_array.length - 1; i >= 0; i--)
        {
            var c = snake_array[i];
            //Criando um snake a partir de células ou tiles de 10px
            if (i === 0) {//Se for o primeiro elemento desenha o smile
                paint_smile_cell(c.x, c.y);
            } else {//Desenha objetos retângulares e circulares para o corpo do smile
                if (i % 2 === 0)//se a posição do elemento é par desenha um retângulo
                    paint_cell(c.x, c.y, "blue"); //Utilizando a função paint_cell para desenhar o snake
                else //Se a posição do elemento é impar desenha um círculo
                    paint_circle_cell(c.x, c.y, "blue"); //Utilizando a função paint_circle_cell para desenhar o snake
            }
        }

        //Desenhando a comida com a função paint_fruit_cell
        //passando como parâmetros a posição da comida (food.x e  food.y ) e a cor (food.color)
        paint_fruit_cell(food.x, food.y, food.color);

        //Imprimindo a pontuação
        //Observe que a pontuação é impressa no final da função paint
        // assim estará sempre acima dos demais objetos gráficos
        ctx.fillStyle = "black"; //Define a cor preta para o texto
        ctx.font = "bolder " + text_size + "px _sans"; //Define a fonte do texto
        var score_text = "Pontos: " + score;//Concatena a pontuação (score) ao texto ("Pontos: ")
        var metrics = ctx.measureText(score_text);//Recupera as medidas em pixel que o texto ocupa no canvas
        var textWidth = metrics.width; //Recupera a largura (width) em pixel do texto
        //posiciona o texto no centro do canvas
        // o valor xText será sempre igual à metade do canvas menos a metada da largura do texto
        var xText = (canvas.width / 2) - (textWidth / 2);
        var yText = text_size + 5; //Posiciona o texto na altura 14 pixel, esta configuração depende do tamanho da fonte
        ctx.fillText(score_text, xText, yText); //Desenha o texto na tela
    }//FIM da função paint




    //Função para verificar colisões
    function check_collision(x, y, array)
    {
        //Esta função verifica se dadas posições X e Y existem em um array de objetos
        // Retorna TRUE se existe e FALSE caso não exista
        for (var i = 0; i < array.length; i++)
        {
            if (array[i].x === x && array[i].y === y)
                return true;
        }
        return false;
    }

//    Função para retornar o tamanho da tela
    function getWindowSize() {
        //Monstrando os tamanhos no console
        console.log("Wd " + document.documentElement.clientWidth + " | Ww " + window.innerWidth + "\n " +
                "Hd " + document.documentElement.clientHeight + " | Hw " + window.innerHeight);
        return {
            w: (window.innerWidth && document.documentElement.clientWidth ?
                    Math.min(window.innerWidth, document.documentElement.clientWidth) :
                    window.innerWidth ||
                    document.documentElement.clientWidth ||
                    document.getElementsByTagName('body')[0].clientWidth),
            h: (window.innerHeight && document.documentElement.clientHeight ?
                    Math.min(window.innerHeight, document.documentElement.clientHeight) :
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.getElementsByTagName('body')[0].clientHeight)
        };

    }

//Função para atualizar o Ranking do Jogo no Bando de Dados
    function setRanking() {
        //Método ajax da JQuery;
        var name = prompt("Informe um nome para cadastro da sua pontuação:", "Digite Seu Nome !!!");

        //Método ajax para trabalhar com uma chamada do tipo Ajax, ou seja, assíncrona.
        $.ajax(
                {
                    type: 'POST', //Tipo de requisição (GET ou POST)
                    data: {pname: name, pscore: score}, //Parâmetros a serem encaminhados
                    url: 'php/insereRanking.php', //URL da página a qual receberá a requisição
                    dataType: 'html', //Tipo de dados a serem manipulados
                    success: function (html, textStatus) { //Função a ser executada no sucesso da resposta
//                        $('#conteudo').html(html); //Para colocar dentro de um elemento HTML
                        imprimirMsg(html, 200); //Função genérica para imprimir no Canvas
                        getRanking();//Função para consultar e imprimir o Ranking do Jogo
                    },
                    error: function (xhr, textStatus, errorThrown) {//Função a ser executado se houver erro na comunicação
                        imprimirMsg('An error occurred! ' + (errorThrown ? errorThrown : xhr.status), 200);
                    }
                });
    }

//Função para consultar o Ranking no banco de dados através de uma chamada Ajax
    function getRanking() {
        //Método ajax da JQuery;
        $.ajax(
                {
                    type: 'POST', //Método de requisição POST
                    //Página PHP que consulta o Banco de Dados do Rankind e devolve os resultados 
                    //  no formato de um vetor de objetos do tipo JSON
                    url: 'php/consultaRanking.php',
                    dataType: 'json', //Objeto JSON (JavaScript Object Notation)
                    success: function (data, textStatus) {
                        var py = text_size + 280;//Posição Y inicial
                        imprimirMsg("POSIÇÃO |\t ID |\t NAME |\t SCORE ", py);//Título do Ranking
                        //FOR para iterar o array data com os objetos do tipo JSON
                        for (var i = 0; i < data.length; i++) {
                            var text = (i + 1) + "º |\t " + data[i].id + " |\t " + data[i].name + " |\t " + data[i].score;
                            py += text_size + 10;//Incrementa a posição Y
                            imprimirMsg(text, py); //Imprimindo cada linha do Ranking
                        }

                    },
                    error: function (xhr, textStatus, errorThrown) {
                        imprimirMsg('An error occurred! ' + (errorThrown ? errorThrown : xhr.status), 200);
                    }
                });
    }

    //Função para consultar a pontuação do último lugar no Ranking (quinta posição )  no banco de dados através de uma chamada Ajax
    function getLastRanking() {
        //Método ajax da JQuery;
        $.ajax(
                {
                    type: 'POST', //Método de requisição POST
                    //Página PHP que consulta o Banco de Dados do Rankind e devolve os resultados 
                    //  no formato de um vetor de objetos do tipo JSON
                    url: 'php/consultaRanking.php',
                    dataType: 'json', //Objeto JSON (JavaScript Object Notation)
                    success: function (data, textStatus) {
                        if (data.length < 5) {//testa se não existe a quinta posição 
                            lscore = 0; // a ultima pontuação é desconsiderada
                        } else {
                            lscore = data[4].score; //Recuperando a pontuação do último objeto JSON
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        return null;
                    }
                });
    }



    function imprimirMsg(text, yText) {
        var metrics = ctx.measureText(text);//Recupera as medidas em pixel que o texto ocupa no canvas
        var textWidth = metrics.width; //Recupera a largura (width) em pixel do texto
        //posiciona o texto no centro do canvas
        // o valor xText será sempre igual à metade do canvas menos a metada da largura do texto
        var xText = (canvas.width / 2) - (textWidth / 2);
        ctx.fillStyle = "black";
        ctx.font = "bolder " + text_size + "px _sans";
        ctx.fillText(text, xText, yText); //Desenha o texto na tela
    }

}//FIM da função canvasApp()