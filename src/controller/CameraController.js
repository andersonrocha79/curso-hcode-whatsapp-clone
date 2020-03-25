class CameraController
{

    constructor(videoEl)
    {

        console.log('*** iniciou a camera')

        // recebe o parametro que indica onde o video sera exibido na pagina
        this._videoEl = videoEl;

        // faz a chamada para o userMedia para receber a promise com o stream do video
        navigator.mediaDevices.getUserMedia({
            video : true
        }).then(stream=>
        {
            // converte o stream e retornando para o video
            this._videoEl.src = URL.createObjectURL(stream);
            // executa o play para mostrar a imagem
            this._videoEl.play();
            
        }).catch( err =>
        {
           console.error("falha ao iniciar a camera", err); 
        });

    }
}