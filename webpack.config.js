const path = require('path');

module.exports = 
{

    // arquivos de entrada
    entry: 
    {
        app : './src/app.js',
        'pdf.worker' : 'pdfjs-dist/build/pdf.worker.entry.js'
    },

    // arquivos de saída
    output: 
    {
        filename: '[name].bundle.js',                // este name inclui o chave definida em 'entry' para gerar mais arquivos bundle
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist'
    }

}