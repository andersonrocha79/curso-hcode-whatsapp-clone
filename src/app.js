
// cria a classe WhatsAppController e 
// vincula a propriedade window.app
// no debug, se digitara app, vai aparecer a classe WhatsAppController

console.log("app > iniciou");

// realiza a importação dos módulos que serão utilizados pela aplicação
import WhatsAppController from './controller/WhatsAppController';

// inicia a aplicação
window.app = new WhatsAppController();


