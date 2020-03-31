
export default class CameraController
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
            // armazena a referencia par ao stream na classe, para que possa ser parado no metodo stop
            this._stream = stream;
            // converte o stream e retornando para o video
            this._videoEl.src = URL.createObjectURL(stream);
            // executa o play para mostrar a imagem
            this._videoEl.play();
            
        }).catch( err =>
        {
           console.error("falha ao iniciar a camera", err); 
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

    takePicture(mimeType = 'image/png')
    {

        // canvas consegue trabalhar com 2D e 3D

        // cria a área de trabalho para desenho do 'canvas' do html5
        let canvas = document.createElement('canvas');

        // seta o tamanho da area de trabalho de desenho, que teria 
        // o mesmo tamanho do video que está sendo executado pela camera
        canvas.setAttribute('height', this._videoEl.videoHeight);
        canvas.setAttribute('width' , this._videoEl.videoWidth);

        // define o contexto para trabalhar com 2D
        let context = canvas.getContext('2d');

        // desenha na area de trabalho
        // iniciando com x e y 0 e passando como limite, o tamanho da area de trabalho
        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

        // retorna a imagem desenhada no canvas no formato base64
        return canvas.toDataURL(mimeType);

    }

}