import Format                    from './../util/Format'; 
import CameraController          from './CameraController'; 
import MicrophoneController      from './MicrophoneController'; 
import DocumentPreviewController from './DocumentPreviewController'; 

export default class WhatsAppController
{

    constructor()
    {

        console.log("*** executou constructor");

        // extende as classes existentes no javascript
        this.elementsPrototype();

        // carrega todos os elementos que tem 'id' no html atual
        this.loadElements();

        // método para iniciar todos os eventos
        this.initEvents();


    }

    elementsPrototype()
    {

        console.log("*** executou prototype");

        // alterando a classe nativa 'Element'

        // criando a função 'hide' em qualquer elemento html
        Element.prototype.hide = function()
        {
            // cria um método em qualquer elemento html
            // para ocultar o seu próprio conteúdo
            this.style.display = 'none';
            // retorna o próprio objeto para que possa encadear métodos            
            return this;
        }

        // criando a função 'show' em qualquer elemento html
        Element.prototype.show = function()
        {
            // cria um método em qualquer elemento html
            // para exibir o seu próprio conteúdo
            this.style.display = 'block';
            // retorna o próprio objeto para que possa encadear métodos            
            return this;
        }

        // criando a função 'toggle' em qualquer elemento html
        Element.prototype.toggle = function()
        {
            // cria um método em qualquer elemento html
            // para exibir ou ocultar o seu próprio conteúdo
            // se tiver oculto, mostra
            // se tiver visível, oculta
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            // retorna o próprio objeto para que possa encadear métodos            
            return this;
        }        

        // cria um método em todo elemento html chamado 'on'
        // este método permite definir uma função de evento
        // vinculada a vários eventos ocorridos no elemento
        // exemplo: quero que execute a mesma função sempre que
        // ocorrerem esta lista de eventos neste elemento html
        Element.prototype.on = function(events, fn)
        {
            // pega o nome dos eventos passado como parâmetro
            // e separa as palavras a cada espaço encontrado
            // e faz um foreach percorrendo cada elemento
            events.split(' ').forEach(event =>
            {
                this.addEventListener(event, fn);
            });
        }

        // cria um método em qualquer elemento html
        // que recebe um objeto com os parâmetros
        // css a serem definidos no elemento html        
        Element.prototype.css = function(styles)
        {
            // para cada nome encontrado em 'styles'
            // altera a propriedade css do elemento html
            // app.el.app.css({width: '50%', color: blue});
            for (let name in styles)
            {
                this.style[name] = styles[name];
            }
        }

        // cria um novo método em qualquer elemento
        // html para adicionar nomes de classes aos elementos
        Element.prototype.addClass = function(name)
        {
            this.classList.add(name);
            // retorna o próprio objeto para que possa encadear métodos            
            return this;
        }

        // cria um novo método em qualquer elemento
        // html para remover nomes de classes aos elementos
        Element.prototype.removeClass = function(name)
        {
            this.classList.remove(name);
            // retorna o próprio objeto para que possa encadear métodos            
            return this;
        }   
        
        // cria um novo método em qualquer elemento
        // html para adicionar ou remoever nomes de classes aos elementos
        Element.prototype.toggleClass = function(name)
        {
            this.classList.toggle(name);
            // retorna o próprio objeto para que possa encadear métodos            
            return this;
        }     
        
        // cria um novo método em qualquer elemento
        // html para retornar se determinada classe foi definida ao elemento
        Element.prototype.hasClass = function(name)
        {
            return this.classList.contains(name);
        }       
        
        // cria uma nova função em 'HTMLFormElement'
        // para retornar o 'FormData' da página atual
        HTMLFormElement.prototype.getForm = function()
        {
            return new FormData(this);
        }

        // cria uma nova função em 'HTMLFormElement'
        // para ler os campos do formulário
        // e criar um JSON com estes nomes
        HTMLFormElement.prototype.toJSON = function()
        {

            // cria um objeto vazio
            let json = {};

            // percorre os campos do formulário
            this.getForm().forEach((value, key) =>
            {
                // atribui a chave e o campo ao objeto json
                json[key] = value;

            });

            return json;

        }

    }

    loadElements()
    {

        console.log("*** executou loadElements");

        // no array 'el' teremos a referência
        // para todos os elementos da tela que tem 'id' definido no html
        this.el = {};

        // percorre todos os elementos que tenham 'id'
        // na página html e cria os atributos de forma automática
        // com camelCase, já apontando para o html, no padrão correto
        // isto evita a declaração dos elementos com id de forma manual
        document.querySelectorAll('[id]').forEach(element =>
        {
            this.el[Format.getCamelCase(element.id)] = element;
        });

        console.log(this.el);        

    }

    initEvents()
    {

        console.log("*** executou initEvents");

        // clique no botão 'myPhoto'
        // utilizando o método 'on' definido em prototype
        this.el.myPhoto.on('click', e=>
        {
            console.log("*** clique no botão myPhoto");
            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();            
            // aguarda 0,3 segundos para adicionar a classe 'open', para que o efeito deslizante aconteça
            setTimeout(() =>
            {
                this.el.panelEditProfile.addClass('open');
            }, 300);            
        });

        // clique no botão 'btnNewContact'
        // utilizando o método 'on' definido em prototype
        this.el.btnNewContact.on('click', e=>
        {
            console.log("*** clique no botão newContact");
            // adcionando esta a classe 'open' ao elemento, o mesmo é exibido
            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            // aguarda 0,3 segundos para adicionar a classe 'open', para que o efeito deslizante aconteça
            setTimeout(() =>
            {
                this.el.panelAddContact.addClass('open');
            }, 300);
            
        });

        // evento para fechar o 'panel' profile
        this.el.btnClosePanelEditProfile.on('click', e=>
        {
            console.log("*** fechou o painel profile");
            // removendo a classe 'open' do elemento, o mesmo é ocultado
            this.el.panelEditProfile.removeClass('open');
        });      
        
        // evento para fechar o 'panel' new contact
        this.el.btnClosePanelAddContact.on('click', e=>
        {
            console.log("*** fechou o painel newContact");
            // removendo a classe 'open' do elemento, o mesmo é ocultado
            this.el.panelAddContact.removeClass('open');
        });           

        // evento botão para definir a foto do perfil
        this.el.photoContainerEditProfile.on('click', e=>
        {

            console.log('*** clicou no botão para definir a foto do perfil');            

            // simula o clique no input para que
            // a tela para seleção de arquivos seja exibida
            // para o usuário escolher o arquivo da foto
            this.el.inputProfilePhoto.click();

            // verifica se pressionou o enter no campo
            // para digitar o nome na tela de perfil
            this.el.inputNamePanelEditProfile.on('keypress', e=>
            {

                // verifica se teclou 'enter'
                if (e.key === 'Enter')
                {
                    // não executa o processo padrão
                    e.preventDefault();
                    // executa o clique do botão que gravar o nome do perfil do usuário
                    this.el.btnSavePanelEditProfile.click();
                }

            })

            // clique no botão que realiza a gravação
            // do nome do usuário no perfil
            this.el.btnSavePanelEditProfile.on('click', e=>
            {
                console.log('*** gravar o texto digitado:' + this.el.inputNamePanelEditProfile.innerHTML);
            });

            // clique no botão para adicionar um novo contato
            // neste caso temos um formulário e podemos utilizar o 'formdata'
            this.el.formPanelAddContact.on('submit', e=>
            {
                console.log('*** clicou no botão adicionar um novo contato');            
                e.preventDefault();
                let formData = new FormData(this.el.formPanelAddContact);
            });

        });    
        
        // percorre a lista de 'contatos'
        // que fica no painel esquerdo da tela
        // pesquisa todos os elementos que tenham a classe 'contact-item'        
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach( item =>
        {
            // define o evento 'click' em cada um dos itens da lista
            item.on('click', e=>
            {
                this.el.home.hide();
                this.el.main.css({display: 'flex'});
            });
        }); 

        // define o evento para o botão de anexar
        // é o botão com o ícone do 'clips' que fica dentro da conversa
        this.el.btnAttach.on('click', e =>
        {

            console.log('*** clicou no botão anexar');            

            // informa que este evento não deve ser propagado
            // para as classes 'pai' do objeto que foi clicado
            // para que o evento seja executado apenas uma vez
            e.stopPropagation();

            // define a classe 'open' para abrir o menu com as opções
            this.el.menuAttach.addClass('open');

            // configura o evento de clique em qualquer item
            // da tela, para que o menu seja ocultado
            // este comando 'bind(this)' indica que deve chamar
            // a função 'closeMenuAttach', mas dentro desta função, deve continuar
            // com o escopo 'this', que é a classe Controller. Se não ficar isso,
            // o this, dentro da função passa a ser 'Document'
            document.addEventListener('click', this.closeMenuAttach.bind(this));

        });

        // botão que aparece no menu 'btnAttach'
        // evento para enviar foto
        this.el.btnAttachPhoto.on('click', e =>
        {
            console.log('*** clicou em attach photo');
            this.el.inputPhoto.click();
        });        

        this.el.inputPhoto.on('change', e=>
        {
            // mostra os arquivos do inputPhoto
            console.log('arquivos selecionados no inputPhoto', this.el.inputPhoto.files);

            // 'inputPhoto.files' não é um array, é uma coleção
            // sendo assim, não tem 'forEach'
            // então, temos que utilizar o spread para transformar esta coleção em array
            // para conseguir fazer o foreach
            [...this.el.inputPhoto.files].forEach(file =>
            {
               // percorrendo a lista de arquivos selecionados
               console.log('percorrendo os arquivos selecionados', file); 
            });

        });

        // botão que aparece no menu 'btnAttach'
        // evento para exibir a câmera
        this.el.btnAttachCamera.on('click', e =>
        {
            console.log('*** clicou em attach camera');
            // oculta todos os paineis que estejam abertos
            this.closeAllMainPanel();
            // exibe o painel da câmera
            this.el.panelCamera.addClass('open');
            // altera o tamanho do painel (altura)
            this.el.panelCamera.css({'height':'cal(100% - 120px)'});
            // cria o objeto que controla a camera, passando como parametro em qual local o video sera exibido
            this._camera = new CameraController(this.el.videoCamera);
        });    
        
        // botão que fecha o painel exibido para tirar foto (camera)
        this.el.btnClosePanelCamera.on('click', e=>
        {
            console.log('*** clicou em fechar attach camera');
            // oculta todos os painéis
            this.closeAllMainPanel();
            // exibe o painel de mensagens
            this.el.panelMessagesContainer.show();
            // executa o comando que para a camera
            this._camera.stop();
        });

        // botão para chamar a câmera e tirar a foto
        this.el.btnTakePicture.on('click', e =>
        {

            console.log('*** clicou no botão para tirar foto');
            
            // tira a foto e armazena em dataUrl
            let dataUrl = this._camera.takePicture();

            // exibe o conteúdo da imagem capturada na camera
            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            
            // oculta o video que esta sendo executado pela camera
            this.el.videoCamera.hide();

            // mostra o botão para tirar uma nova foto
            this.el.btnReshootPanelCamera.show();

            // após tirar a foto, oculta o botão que tira a foto
            this.el.containerTakePicture.hide();

            // mostra o botão que envia a foto
            this.el.containerSendPicture.show();

        });  

        // botãoq que envia a foto que foi tirada pelo usuario
        this.el.btnReshootPanelCamera.on('click', e =>
        {

            console.log('*** clicou no botão para reiniciar a camera e tirar outra foto');

            // oculta a imagem que tem a foto que foi tirada anteriormente
            this.el.pictureCamera.hide();
            
            // mostra o video novamente para tirar uma nova foto
            this.el.videoCamera.show();

            // oculta o botão para tirar uma nova foto
            this.el.btnReshootPanelCamera.hide();

            // mostra o botão novamente que tira a foto
            this.el.containerTakePicture.show();

            // oculta o botão que envia a foto tirada
            this.el.containerSendPicture.hide();            

        });

        // botão que envia a foto tirada para o servidor
        this.el.btnSendPicture.on('click', e =>
        {

            console.log('*** clicou no botão para enviar a foto tirada para o servidor');

        });

        // botão para enviar o documento selecionado
        this.el.btnSendDocument.on('click', e =>
        {
            console.log('*** clicou no botão para enviar documento');
        });
        
        // botão que aparece no menu 'btnAttach'
        // evento para enviar documento
        this.el.btnAttachDocument.on('click', e =>
        {
            console.log('*** clicou em attach document');
            // oculta o painel de mensagens
            this.closeAllMainPanel();
            // exibe o painel do documento
            this.el.panelDocumentPreview.addClass('open');
            // altera o tamanho do painel (altura)
            this.el.panelDocumentPreview.css({'height':'cal(100% - 120px)'});
            // simula o click no botão para selecionar arquivos
            this.el.inputDocument.click();
        });  
        
        this.el.inputDocument.on('change', e=>  
        {

            console.log('*** arquivo adicionado');

            // verifica se tem arquivo selecionado na lista
            if (this.el.inputDocument.files.length)
            {

                // diminui a altura do panel, e exibe só depois que o arquivo estiver carregado, para evitar bug
                //this.el.panelDocumentPreview.css({'height':'1%'});

                // armazena a referencia para o caminho selecionado
                let file = this.el.inputDocument.files[0];
                console.log('*** arquivo selecionado:', file);

                // cria o objeto que retorna o preview do arquivo selecionado
                this._documentPreviewController = new DocumentPreviewController(file);

                // executa a função que retorna o preview, e aguarda o retorno da função
                this._documentPreviewController.getPreviewData().then(result =>
                {
                    console.log('*** preview OK', result);
                    // mostra a imagem
                    this.el.imgPanelDocumentPreview.src        = result.src;
                    // mostra o nome do arquivo
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    // exibe o painel para que a imagem possa ser exibida                    
                    this.el.imagePanelDocumentPreview.show();
                    // oculta o panel de seleção do arquivo
                    this.el.filePanelDocumentPreview.hide();
                    // aumenta o panel novamente para exibir a imagem
                    //this.el.panelDocumentPreview.css({'height':'cal(100% - 120px)'});
                    
                }).catch(err =>
                {

                    console.log('*** falha no preview', err);

                    // aumenta o panel novamente para exibir a imagem
                    //this.el.panelDocumentPreview.css({'height':'cal(100% - 120px)'});

                    // arquivo não pode ter preview
                    switch (file.type)
                    {

                        // word
                        case 'application/vnd.msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;

                        // excel
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;

                        // power point
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;

                        // outros
                        default:
                            // muda a classe do elemento para que exiba o ícone
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
                            break;

                    }

                    // exibe o nome do arquivo
                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;

                    // esconde o preview da imagem
                    this.el.imagePanelDocumentPreview.hide();

                    // exibe o panel com o icone do arquivo selecionado
                    this.el.filePanelDocumentPreview.show();

                });

            }

        });
        
        // botão que fecha o painel exibido para anexar documentos
        this.el.btnClosePanelDocumentPreview.on('click', e=>
        {
            console.log('*** clicou em fechar attach document');
            // oculta todos os painéis
            this.closeAllMainPanel();
            // exibe o painel de mensagens
            this.el.panelMessagesContainer.show();
        });        

        // botão que aparece no menu 'btnAttach'
        // evento para enviar contato
        this.el.btnAttachContact.on('click', e =>
        {
            console.log('*** clicou em attach contact');
            // exibe a janela modal com a lista de contatos
            this.el.modalContacts.show();
        });           

        // botão para fechar o modal 'contacts'
        this.el.btnCloseModalContacts.on('click', e=>
        {
            // oculta a janela modal
            this.el.modalContacts.hide();
        });

        // botão de microphone, que inicia a gravação do audio
        this.el.btnSendMicrophone.on('click', e =>
        {

            // exibe o painel que demonstra a gravação
            this.el.recordMicrophone.show();

            // ocultar os botões
            this.el.btnSendMicrophone.hide();

            // inicia a classe que controla o microfone
            this._microphoneControler = new MicrophoneController()

            // configura a função a ser executada
            // quando o evento 'ready' for disparado na classe 'microfoneController'
            this._microphoneControler.on('ready', gravacao=>
            {

                console.log('*** executou o evento "ready" que identifica que podemos gravar o audio');

                // executa o método para iniciar a gravação
                this._microphoneControler.startRecorder();

            });

            this._microphoneControler.on('recordtimer', timer =>
            {
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });

        });

        this.el.btnCancelMicrophone.on('click', e=>
        {
            // para a execução do microfone
            this._microphoneControler.stopRecorder();
            this.closeRecordMicrophone();
        });

        this.el.btnFinishMicrophone.on('click', e=>
        {
            // para a execução do microfone
            this._microphoneControler.stopRecorder();            
            this.closeRecordMicrophone();
        });     
        
        // se teclar enter no campo, sem teclar 'control'
        // faz o envio da mensagem
        this.el.inputText.on('keypress', e =>
        {

            // o evento keypress ocorre logo que a tecla é pressionada
            // o evento keyup ocorre quando para de pressionar a tecla
            if (e.key === 'Enter' && !e.ctrlKey)
            {
                // cancela o comportamento padrão, parando os eventos seguintes
                e.preventDefault();
                // executa o evento de clique do botão de 'enviar mensagem'
                this.el.btnSend.click();
            }

        });

        // quando começar a digitar no campo de 'mensagem'
        // esconder o placeHoder, que é a dica do campo,
        // se tiver vazio, mostra o placeHolder
        this.el.inputText.on('keyup', e=>
        {
            if (this.el.inputText.innerHTML.length)
            {
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
            }
            else
            {
                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();
            }
        });

        // clique no botão de enviar mensagem 
        this.el.btnSend.on('click', e=>
        {
            console.log('*** clicou em btnSend - texto: ', this.el.inputText.innerHTML); 

        });

        // clique no botão para aparecer os emojis
        this.el.btnEmojis.on('click', e =>
        {
           
            // adiciona a classe 'open' ao containter que tem a lista de emojis
            // para que o panel com as opções seja exibido
            // o 'toggle' inclui ou remove a classe 'open'
            this.el.panelEmojis.toggleClass('open');    
            
        });

        // percorre todos os itens do 'panelEmojis'
        // que tenham a classe '.emojik', que são os ícones disponíveis
        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji =>
        {

            // inclui o evento 'clique' em cada um dos emojis disponíveis na lista
            emoji.on('click', e=>
            {

                console.log(emoji.dataset.unicode);

                // clona o emoji clicado, para que possa ser incluido na mensagem
                let img = this.el.imgEmojiDefault.cloneNode();

                // clona todas as propriedades do elemento que foi clicado
                img.style.cssText   = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt             = emoji.dataset.unicode;

                // lista todas as classes que temos em emoji
                emoji.classList.forEach(name => 
                {
                    // adiciona a classe na cópia do emoji
                    img.classList.add(name);                    
                });

                // após criar uma cópia do emoji clicado e definir
                // todas as propriedades conforme o emoji clicado
                // inclui no inputText
                this.el.inputText.appendChild(img);

                let cursor = window.getSelection();

                // ao clicar no emoji, verifica se o cursor está dentro do input
                // pode estar em outro ponto da página ou até mesmo fora da página
                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text')
                {
                    // se não tiver focado, seta o foco no input tex
                    this.el.inputText.focus();   
                    // após setar o foco, busca a posicao atual do cursor dentro do inputText
                    cursor = window.getSelection();
                }

                // cria o range para saber onde esta o cursor dentro do inputText
                let range = document.createRange();
                
                // pega a posicão inicial do cursor dentro do inputText
                range = cursor.getRangeAt(0);

                // exclui o texto da seleção para incluir o emoji no lugar
                range.deleteContents();

                // inclui a imagem dentro do inputText, na posição atual
                let frag = document.createDocumentFragment();
                frag.appendChild(img);
                range.insertNode(frag);
                // após a inclusão, posiciona o cursor após o emoji
                range.setStartAfter(img);

                // executa o evento do inputText
                // para que simule a digitacao de um texto e o placeholder seja ocultado
                this.el.inputText.dispatchEvent(new Event('keyup'));

            });

        });

    }

    closeMenuAttach(e)
    {
        console.log('*** ocultou o menu do botão anexar');
        // ao clicar em qualquer parte da tela, irá ocultar o menu
        console.log('ocultou o menu');
        // remove este evento do clique da tela, para que não seja mais executado
        document.removeEventListener('click', this.closeMenuAttach);
        // remove a classe 'open' do menu, para que seja ocultado
        this.el.menuAttach.removeClass('open');
    }

    closeRecordMicrophone()
    {
        // oculta o botão do microfone        
        this.el.btnSendMicrophone.hide();        
        // oculta o painel que grava
        this.el.recordMicrophone.hide();        
    }

    closeAllMainPanel()
    {
        this.el.panelMessagesContainer.hide();        
        this.el.panelDocumentPreview.removeClass('open');        
        this.el.panelCamera.removeClass('open');        
    }

    closeAllLeftPanel()
    {

        // oculta todos os painéis do lado esquerdo da tela
        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();

    }

}