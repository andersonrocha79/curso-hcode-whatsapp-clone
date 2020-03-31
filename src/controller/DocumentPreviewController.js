export class DocumentPreviewController
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

            // verifica o tipo do arquivo passado como parâmetro
            switch (this._file.type)
            {

                // *** arquivo de imagem                
                case 'image/png':
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/gif':

                    // faz a leitura do arquivo, tratando sucesso ou falha na leitura
                    let reader = new FileReader();
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
                    break;

                // *** outros arquivos
                default:
                    f();

            }

        });

    }



}