
const firebase = require('firebase');
require('firebase/firestore');

// classe que faz a comunicação como firebase
export default class Firebase
{

    constructor()
    {

        // cria o objeto javascript
        // que mantém os parâmetros para conexão com o firebase
        this._config = 
        {
            apiKey: "AIzaSyCThDeH3A-Y60WeU_NSIyfHv_xIoQAp2ZE",
            authDomain: "whatsapp-clone-a4565.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-a4565.firebaseio.com",
            projectId: "whatsapp-clone-a4565",
            storageBucket: "whatsapp-clone-a4565.appspot.com",
            messagingSenderId: "1026913628385",
            appId: "1:1026913628385:web:6532ec181345f75ad407a0",
            measurementId: "G-5YT1V6GJSC"
        }
        
        this.init();

    }

    init()
    {

        // *** Initialize Firebase
        // a variável global 'windows._initializedFirebase' permite 
        // a inicialização do firebase apenas uma vez na aplicação

        // verifica se já foi inicializado
        if (!window._initializedFirebase)
        {

            // inicia o firebase
            firebase.initializeApp(this._config);
            firebase.analytics();

            // configura o firestore para retornar o timestamp em cada snapshot retornado            
            // firebase.firestore().settings({timestampsInSnapshots: true}) (anterior)
            firebase.firestore().settings({});
            
            // indica que já foi inicializado
            // cria a variável em 'window' para que seja global em toda a aplicação
            window._initializedFirebase = true;

        }

    }

    // cria um método para acesso direto ao banco de dados do firestore
    static db()
    {
        return firebase.firestore();
    }

    // cria um método para acesso direto ao hd da aplicação na nuvem (storage)
    static hd()
    {
        return firebase.storage();
    }

    // método para autenticação no firebase
    initAuth()
    {

        // cria uma nova promessa e tenta
        // fazer a autenticação no firebase
        return new Promise((s, f) =>        
        {

            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
            .then(result =>
            {

                // se tiver autenticado, armazena o usuário e token
                // para avaliação 
                let token = result.credential.accessToken;
                let user  = result.user;

                console.log('usuario logado: ', user, token);

                // retorna o sucesso da promessa, passando o usuário e token de autenticação
                s({user, token});


            }).catch(err =>
            {
                // retorna a falha da promessa
                f(err);
            });

        });
    }

}