import Format                    from './../util/Format'; 
import CameraController          from './CameraController'; 
import MicrophoneController      from './MicrophoneController'; 
import DocumentPreviewController from './DocumentPreviewController'; 
import Firebase                  from './../util/Firebase';                 // inclusão do firebase no projeto (classe Firebase.js)
import User                      from '../model/User';
import Chat                      from '../model/Chat';
import Message                   from '../model/Message';

export default class WhatsAppController
{

    constructor()
    {

        console.log("*** executou constructor");

        // cria um objeto da classe Firebase
        this._firebase = new Firebase();

        // realiza a autenticação do firebase
        this.initAuth();

        // extende as classes existentes no javascript
        this.elementsPrototype();

        // carrega todos os elementos que tem 'id' no html atual
        this.loadElements();

        // método para iniciar todos os eventos
        this.initEvents();

    }

    initAuth()
    {
        this._firebase.initAuth().then(response =>
        {

            console.log('*** response do firebase.initAuth > user > ' , response.user);
            console.log('*** response do firebase.initAuth > token > ', response.token);

            // cria uma instância da classe User
            this._user = new User(response.user.email);

            // cria um evento nesta classe que fica escutando qualquer alteração
            // deste documento que possa vir a ocorrer no firebase
            this._user.on('datachange', data => 
            {

                // sempre que os dados no firebase forem alterados, este evento será disparado
                
                // mostra o nome do usuário
                document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone';

                // mostra o nome do usuário
                this.el.inputNamePanelEditProfile.innerHTML = data.name;

                // mostra a foto do usuário
                if (data.photo)
                {

                    // exibe a foto
                    let photo = this.el.imgPanelEditProfile;
                    photo.src = data.photo;
                    photo.show();

                    // oculta a imagem padrão
                    this.el.imgDefaultPanelEditProfile.hide();

                    // faz referencia a tag 'img' que está na div 'myPhoto'
                    let photo2 = this.el.myPhoto.querySelector('img');
                    photo2.src = data.photo;
                    photo2.show();

                }

                // após logar o usuário, mostra os contatos do usuário
                this.initContacts();

            });

            this._user.name  = response.user.displayName;
            this._user.email = response.user.email;
            this._user.photo = response.user.photoURL;

            // grava o usuário atual no firebase
            this._user.save().then( () =>
            {
                // exibe o panel principal da aplicação
                this.el.appContent.css({display: 'flex'});                
            });

        })
        .catch(err =>
        {
            console.error(err);
        });
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

        // ao teclar na pesquisa de contatos
        this.el.inputSearchContacts.on('keyup', e=>
        {

            // se o campo estiver vazio, mostra o placeholder
            if (this.el.inputSearchContacts.value.length > 0)
            {
                this.el.inputSearchContactsPlaceHolder.hide();
            }
            else
            {
                this.el.inputSearchContactsPlaceHolder.show();
            }

            // pesquisa os contatos
            this._user.getContacts(this.el.inputSearchContacts.value);

        });

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
            e.preventDefault();
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
                // desabilita o botão enquanto salva
                this.el.btnSavePanelEditProfile.disable = true;
                // altera o nome do usuário no objeto "_user" que representa o usuário atual
                this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
                // executa o método "save" da classe DAO, que atualiza o nome no firebase
                this._user.save().then(() =>
                {
                    // habilita o botão após gravação
                    this.el.btnSavePanelEditProfile.disable = false;
                });
            });

            // clique no botão para adicionar um novo contato
            // neste caso temos um formulário e podemos utilizar o 'formdata'
            this.el.formPanelAddContact.on('submit', event =>
            {

                event.preventDefault();

                console.log('*** clicou no botão adicionar um novo contato');                            

                // armazena os dados do formulário de inclusão de contato
                let formData = new FormData(this.el.formPanelAddContact);

                // cria um novo contato (usuário) com o email informado
                let contact = new User(formData.get('email'));

                console.log("*** email informado: ", contact);

                // verifica se existe usuario com este email no firebase
                contact.on('datachange', data =>
                {

                    // se retornar o nome, indica que existe
                    if (data.name)
                    {

                        // cria o chat para identificação da conversa
                        Chat.createIfNotExists(this._user.email, contact.email).then(chat =>
                        {

                            // após criação da conversa
                            // armazena o id do chat criado no contato ao qual estou conversando
                            contact.chatId = chat.id;

                            // armazena o id do chat no meu usuário atual
                            this._user.chatId = chatId;

                            // inclui o meu usuário como contato do usuário que estou conversando
                            contact.addContact(this._user);
                            
                            // se existe o usuário, adiciona como contato do usuário logado
                            this._user.addContact(contact).then( () =>
                            {
                                // após salvar, fecha o painel
                                this.el.btnClosePanelAddContact.click();
                                console.info("*** contato adicionado com sucesso");
                            });                            

                        });


                    }
                    else
                    {
                        console.error('usuário não foi encontrado');
                    }                

                });
                

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
                // executa o método para enviar a imagem como parametro
                // informando o id do chat, o email e arquivo
                Message.sendImage(this._contactActive.chatId, this._user.email, file);
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

            this.el.btnSendPicture.disable = true;

            // procura pelo padrão utilizando o regex
            let regex  = /^data:(.+);base64,(.*)$/;
            let result = this.el.pictureCamera.src.match(regex);
            // a segunda parte do array é o mimetype do arquivo
            let mimeType = result[1];
            // pega a extensão do arquivo
            let ext      = mimeType.split('/')[1];
            let filename = `camera${Date.now()}.${ext}`;

            // inverter a foto utilizando o canvas
            let picture = new Image();
            picture.src = this.el.pictureCamera.src;
            picture.onload = e=>
            {

                let canvas  = document.createElement('canvas');
                let context = canvas.getContext('2d');

                canvas.width  = picture.width;
                canvas.height = picture.height;

                context.translate(picture.width, 0);
                context.scale(-1, 1);
                context.drawImage(picture, 0, 0, canvas.width, canvas.height);

                fetch(canvas.toDataURL(mimeType))
                .then( res    =>  { return res.arrayBuffer(); })
                .then( buffer =>  { return new File([buffer]. filename, { type: mimeType}); })
                .then( file   =>  
                       {
                           Message.sendImage(this._contactActive.chatId, this._user.email, file);
                           this.el.btnSendPicture.disable = false;
                           this.closeAllMainPanel();
                           this._camera.stop();
                           this.el.btnReshootPanelCamera.hide();
                           this.el.videoCamera.show();
                           this.el.containerSendPicture.hide();
                           this.el.containerTakePicture.show();
                           this.el.panelMessagesContainer.show();                           
                       });

            }

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

            // envia a mensagem para o contato atual selecionado
            Message.send(this._contactActive.chatId, 
                         this._user.email,
                         "text",
                         this.el.inputText.innerHTML);

            // limpa o conteudo do texto
            this.el.inputText.innerHTML = "";

            // fecha o painel
            this.el.panelEmojis.removeClass("open");


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

    initContacts()
    {

        console.log('*** buscando a lista de contatos');
        // cria a lista de usuários vinculados ao usuário 'logado'        

        // escuta o evento disparado pelo User.js
        // que retorna os contatos atuais do usuário logado
        this._user.on("contactschange", docs =>
        {

            console.log('*** recebendo os contatos do usuário: ' + docs);                            

            this.el.contactsMessagesList.innerHTML = '';            

            docs.forEach( doc =>
            {
                
                console.log('*** encontrou contatos do usuário atual');                            

                let contact = doc.data();

                let div = document.createElement('div');

                div.className = "contact-item";
        
                div.innerHTML = 
        
                       `<div class="dIyEr">
                            <div class="_1WliW" style="height: 49px; width: 49px;">
                                <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                                <div class="_3ZW2E">
                                    <span data-icon="default-user" class="">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                            <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                            <g fill="#FFF">
                                                <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="_3j7s9">
                            <div class="_2FBdJ">
                                <div class="_25Ooe">
                                    <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                                </div>
                                <div class="_3Bxar">
                                    <span class="_3T2VG">${contact.lastMessageTime}</span>
                                </div>
                            </div>
                            <div class="_1AwDx">
                                <div class="_itDl">
                                    <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
        
                                    <span class="_2_LEW last-message">
                                        <div class="_1VfKB">
                                            <span data-icon="status-dblcheck" class="">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                                    <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                        <div class="_3Bxar">
                                            <span>
                                                <div class="_15G96">
                                                    <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                                </div>
                                        </span></div>
                                        </span>
                                </div>
                            </div>
                        </div>`;

                // exibe a foto do usuário se existir
                if (contact.photo)
                {
                    // procura na div a class 'photo'
                    let img =  div.querySelector('.photo');
                    img.src = contact.photo;
                    img.show();
                }

                // evento de clique no contato exibido na lista                
                div.on('click', e =>
                {

                    console.log("*** chat id da conversa > ", contact.chatId );
                    this.setActiveChat(contact);

                });
        
                // inclui o contato na lista de contatos o usuário
                this.el.contactsMessagesList.appendChild(div);

            });

        });

        this._user.getContacts();

    }

    setActiveChat(contact)
    {

        // desliga o 'ouvinte' anterior
        // para que não receba mais alterações do chat do usuário anterior
        if (this._contactActive)
        {
            // com este comando a conversa anterior não será mais 'ouvida' no 'firebase'
            Message.getRef(this._contactActive.chatId).onSnapshot(() => {});
        }

        // armazena o contato ativo, selecionado na tela
        this._contactActive            = contact;

        // exibe o nome e status
        this.el.activeName.innerHTML   = contact.name;
        this.el.activeStatus.innerHTML = contact.status;

        // verifica se existe o campo 'foto', e exibe a foto
        if (contact.photo)
        {
            let img = this.el.activePhoto;
            img.src = contact.photo;
            img.show();
        }

        // oculta o painel home
        this.el.home.hide();

        // exibe o painel da conversa
        this.el.main.css(
        {
            display: 'flex' 
        });

        // limpa o hsitórico de mensagens
        this.el.panelMessagesContainer.innerHTML = "";

        // fica ouvindo o nó do chat selecionado
        // e recebendo as alterações da conversa
        Message.getRef(this._contactActive.chatId)
               .orderBy('timeStamp')
               .onSnapshot(docs => 
                {

                    // armazena o scrollTop, que seria posição atual do scroll
                    let scrollTop    = this.el.panelMessagesContainer.scrollTop;

                    let scrollTopMax = this.el.panelMessagesContainer.scrollHeight - 
                                        this.el.panelMessagesContainer.offsetHeight;

                    // verifica se o usuário está no final do scrolll
                    // se estiver, indica que o sistema vai fazer o scroll automatico nas próximas mensagens                                               
                    let autoScroll = (scrollTop > scrollTopMax);

                    // percorre as mensagens e exibe ao usuário
                    docs.forEach(doc => 
                    {

                        // armazena a mensagem 
                        let data        = doc.data();
                        data.id         = doc.id;       // armazena o id da mensagem

                        // recebeu todas as mensagens novamente
                        // inclui só as que já não estão na tela

                        let message = new Message();

                        // se a mensagem não estiver no panel, faz a inclusão                            
                        message.fromJSON(data);                            

                        // define se a mensagem é minha ou de outro usuário
                        let me = (data.from === this._user.email);


                        if (!this.el.panelMessagesContainer.querySelector('#_' + data.id))
                        {

                            if (!me)
                            {
                                // leu a mensagem do usuário, então altera o status da mensagem
                                // para 'read'
                                doc.ref.set({status: 'read'}, {merge:true});
                            }

                            // retorna o view da mensagem
                            let view = message.getViewElement(me);

                            // inclui a mensagem na tela
                            this.el.panelMessagesContainer.appendChild(view);

                        }
                        else if (me)
                        {
                            // se a mensagem já existir, e for minha, atualiza, para mostrar se já foi enviada
                            let msgEl = this.el.panelMessagesContainer.querySelector('#_' + data.id);
                            msgEl.querySelector('.message-status').innerHTML = message.getStatusViewElement().outerHTML;
                        }

                    });

                    // se tiver no final da barra de rolagem, faz o scroll automático
                    if (autoScroll)
                    {
                        // move para o final do scroll
                        this.el.panelMessagesContainer.scrollTop = this.el.panelMessagesContainer.scrollHeight - 
                                                                    this.el.panelMessagesContainer.offsetHeight;
                    }
                    else
                    {
                        // permanece onde estava o scroll
                        this.el.panelMessagesContainer.scrollTop = scrollTop;
                    }


                });


    }


}