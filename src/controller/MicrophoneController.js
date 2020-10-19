import ClassEvent from "../util/ClassEvent";

export default class MicrophoneController extends ClassEvent
{

    constructor()
    {

        console.log('*** iniciou o microfone')

        // executa o construtor da classe pai, que seria a classe 'ClassEvent'
        // esta classe é genérica e pode ser utilizada para
        // controlar os eventos a serem disparados por quem utiliza a classe atual
        super();

        // cria uma variável na classe
        // para demonstrar se a gravação de áudio já foi aprovada pelo usuário
        this._available = false;

        // define o tipo de arquivo suportado pelo navegador para gravação do áudio
        this._mimeType = 'audio/webm';

        // faz a chamada para o userMedia para receber a promise com o stream do video
        navigator.mediaDevices.getUserMedia(
        {
            audio : true
        }).then(stream =>
        {

            // avisa que o áudio foi liberado
            this._available = true;

            // armazena a referencia par ao stream na classe, para que possa ser parado no metodo stop
            this._stream = stream;

            // dispara o evento 'ready',
            // informando que estamos prontos para gravar
            // e passando o stream
            this.trigger('ready', this._stream);            

            /**
             * teste 
             * // cria a variável que representa o 'audio'
             * let audio = new Audio();
             * // converte o stream e retornando para o audio
             * audio.src = URL.createObjectURL(stream);
             * // executa o play para tocar o áudio
             * audio.play();
            */
            
        }).catch( err =>
        {
           console.error("falha ao iniciar o microfone", err); 
        });

    }

    stop()
    {

        // retorna todas as tracks que existam no stream (audio, video, etc)
        // e para cada uma delas
        this._stream.getTracks().forEach( track =>
        {
            track.stop();
        });

    }

    isAvailable()
    {
        return this._available;
    }

    startRecorder()
    {

        // verifica se a escuta do áudio já foi liberada pelo navegador
        if (this.isAvailable())
        {

            // para saber se o navegador suporta a gravação em um formato de arquivo
            // MediaRecorder.isTypeSupported('audio/mp3')  (false)
            // MediaRecorder.isTypeSupported('audio/webm') (true)

            // inicia a gravação do áudio, passando o '_stream' que aponta para a stream do áudio que está sendo executado
            // e passando também o '_mimeType' que é o tipo de arquivo suportado
            this._mediaRecorder = new MediaRecorder(this._stream, {mimeType: this._mimeType});

            // cria um array que vai receber 'partes das gravações'
            // porque o objeto que faz a gravação dispara eventos enviando os dados da gravação de tempos em tempos
            // estes dados precisam ser armazenados, para que no final da gravação, sejam compilados em uma gravação completa
            this._recordedChunks = [];

            // configura o evento que é disparado de tempos em tempos pelo objeto de gravação
            // que retorna um trecho da gravação até o momento
            this._mediaRecorder.addEventListener('dataavailable', e =>
            {
                // verifica se o evento retornou algum áudio em 'data'
                if (e.data.size > 0)
                {
                    // inclui o 'data' no array que armazena os trechos da gravação atual
                    this._recordedChunks.push(e.data);
                }
            });

            // configura o evento a ser executado quando a gravação terminar
            this._mediaRecorder.addEventListener('stop', e =>
            {
                // agora que a gravação terminou,
                // precisamos juntar todos os pedaços de gravação que estão no array 'recordedChunks'
                // e gerar um arquivo de áudio com estes pedaços para envio no app

                // precisamos criar um 'blob' para armazenar o conteúdo do áudio em bytes
                // ao criar o blob passamos os dados existentes no array 'recordedchunks' e qual o tipo de dados existente
                let blob = new Blob(this._recordedChunks, {type: this._mimetype});

                // define o nome do arquivo
                let filename = `rec${Date.now()}.webm`;
               
                let audioContext = new AudioContext();

                let reader = new FileReader();
                reader.onload = e =>
                {

                    audioContext.decodeAudioData(reader.result).then(decode =>
                    {

                        // cria o arquivo
                        let file = new File([blob], filename, 
                        {
                            type: this._mimeType, 
                            lastModified: Date.now()
                        });

                        this.trigger('recorded', file, decode);
        
                    });

                };

                reader.readAsArrayBuffer(blob);
                
                console.log('*** arquivo de áudio pronto para envio > ', file);


                // executa o áudio para testar
                /*
                // este trecho de código abre e executa o arquivo de áudio
                let reader = new FileReader();
                reader.onload = e =>
                {
                    console.log('*** lê o arquivo gerado e escuta o arquivo');
                    let audio = new Audio(reader.result);
                    audio.play();
                }
                reader.readAsDataURL(file);
                */
                
            });

            // após configurar os eventos do objeto
            // inicia a gravação do áudio
            this._mediaRecorder.start();

            // mostra o tempo de gravação
            this.startTimer();

        }

    }

    stopRecorder()
    {

        // verifica se a escuta do áudio já foi liberada pelo navegador
        if (this.isAvailable())
        {

            // para de executar a gravação
            this._mediaRecorder.stop();

            // para de ouvir o microfone
            this.stop();

            // para o tempo de gravação
            this.stopTimer();
            
        }

    }

    startTimer()
    {

        // pega a hora do início da gravação do áudio
        let start = Date.now();

        // cria o processo que é executado a cada 100 milisegundos
        // para atualizar o timer, exibindo o tempo decorrido
        this._recordMicrophoneInterval = setInterval(() => 
        {            
            // dispara o evento
            // para que a função em 'whatasappcontroler' exiba o tempo na tela
            // quando clicou em gravar o microfone, configurou a função a ser executada no evento 'recordTimer', dentro do WhatsAppController.js
            // this._microphoneControler.on('recordtimer', timer =>
            this.trigger('recordtimer', (Date.now() - start));

        }, 100);

    }

    stopTimer()
    {
        // fechou a gravação, então para a contagem de tempo
        clearInterval(this._recordMicrophoneInterval);
    }

}