class WhatsAppController
{

    constructor()
    {

        console.log("WhatsAppController > OK");

        // extende as classes existentes no javascript
        this.elementsPrototype();

        // carrega todos os elementos que tem 'id' no html atual
        this.loadElements();

        // método para iniciar todos os eventos
        this.initEvents();


    }

    elementsPrototype()
    {

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

    }

    initEvents()
    {

        // clique no botão 'myPhoto'
        // utilizando o método 'on' definido em prototype
        this.el.myPhoto.on('click', e=>
        {
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
            // removendo a classe 'open' do elemento, o mesmo é ocultado
            this.el.panelEditProfile.removeClass('open');
        });      
        
        // evento para fechar o 'panel' new contact
        this.el.btnClosePanelAddContact.on('click', e=>
        {
            // removendo a classe 'open' do elemento, o mesmo é ocultado
            this.el.panelAddContact.removeClass('open');
        });           

        // evento botão para definir a foto
        this.el.photoContainerEditProfile.on('click', e=>
        {

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
                console.log('gravar o texto digitado:' + this.el.inputNamePanelEditProfile.innerHTML);
            });

            // clique no botão para adicionar um novo contato
            // neste caso temos um formulário e podemos utilizar o 'formdata'
            this.el.formPanelAddContact.on('submit', e=>
            {
                e.preventDefault();
                let formData = new FormData(this.el.formPanelAddContact);

            });

        });            

    }

    closeAllLeftPanel()
    {

        // oculta todos os painéis do lado esquerdo da tela
        this.el.panelEditProfile.hide();
        this.el.panelAddContact.hide();

    }

}