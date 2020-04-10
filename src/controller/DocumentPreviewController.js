//import { read } from 'fs';

const pdfjsLib = require('pdfjs-dist');
const path = require('path');

// configura o 'worker' que faz o processo de leitura e manipulação do pdf
// configura o caminho do arquivo
// pega a variável '__dirname' que aponta para a pasta atual do arquivo
// ../       sai da pasta controller, 
// ../       sai da pasta src, 
// /dist     entra na pasta dist, e coloca o arquivo a ser gerado pelo webpack após compilação
// após esta definição, altera parâmetros no webpack.config.js
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');

export default class DocumentPreviewController
{

    // o construtor recebe o arquivo passado como parâmetro
    constructor(file)
    {
        // armazena o arquivo como variável privada na classe
        this._file = file;
    }    

    // método que retorna o preview do arquivo passado
    // como parâmetro, retornando uma Promise
    getPreviewData()
    {

        return new Promise((s, f) =>
        {

            let reader = new FileReader();

            // verifica o tipo do arquivo passado como parâmetro
            switch (this._file.type)
            {

                // *** arquivo de imagem                
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/gif':
                
                    // faz a leitura do arquivo, tratando sucesso ou falha na leitura                    
                    reader.onload = e =>
                    {
                        // sucesso (executa o método 's' passado como parâmetro indicando sucesso)
                        s({
                            src: reader.result,
                            info: this._file.name
                        });
                    }

                    reader.onerror = e =>
                    {
                        // falha (executa o método 'f' passado como parâmetro indicando falha)
                        f(e);
                    }

                    // executa o método de leitura
                    reader.readAsDataURL(this._file);
                
                    // finaliza
                    break;

                // *** arquivo pdf                              
                case 'application/pdf':

                    console.log('*** incluiu arquivo pdf');

                    reader.onload = e =>
                    {

                        // faz a leitura do arquivo pdf
                        // utilizando o worker
                        // a função reader.readAsArrayBuffer(this._file) será retornada em reader.result
                        // a função Uint8Array converte o reader.result em um array de 8 bits, que o componente pdfjslib precisa
                        pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf =>
                        {

                            console.log('*** arquivo pdf lido: ', pdf);

                            // le a primeira pagina do arquivo retornado
                            pdf.getPage(1).then(page =>
                            {
                                console.log('*** leitura da primeira pagina do pdf: ', pdf);
                                // neste momento temos a informação da página 1 do documento pdf
                                // faz a leitura do espaço de visualização da página
                                let viewport      = page.getViewport(1);
                                // inicializa o canvas para imprimir o conteúdo da página
                                let canvas        = document.createElement('canvas');
                                let canvasContext = canvas.getContext('2d');
                                // define a largura e altura de impressão
                                canvas.width      = viewport.width;
                                canvas.height     = viewport.height;

                                // renderiza a página
                                // faz o processo e retorna o resultado da promessa (Promise)
                                page.render(
                                {
                                    canvasContext,
                                    viewport
                                }).then(() =>
                                {
                                    console.log('*** renderizando a página do pdf no canvas');
                                    // sucesso
                                    s({
                                        src: canvas.toDataURL('image/png'),
                                        info: 'teste' // `${pdf.numPages} página(s)`
                                    });

                                }).catch(err =>
                                {
                                    // falha
                                    // como já esta em uma promessa, chama o método de falha da promessa principal
                                    console.log('*** erro ao renderizar o pdf');
                                    f(err); 
                                });
                                
                            }).catch(err =>
                            {
                                // como já esta em uma promessa, chama o método de falha da promessa principal
                                console.log('*** erro ao abrir a pagina do pdf');
                                f(err); 
                            });
                            
                        }).catch(err =>
                        {
                           // como já esta em uma promessa, chama o método de falha da promessa principal
                           f(err); 
                        });
                    }

                    reader.readAsArrayBuffer(this._file);

                    break;

                // *** outros arquivos
                default:
                    f();

            }

        });

    }



}