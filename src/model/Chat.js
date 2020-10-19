import Model    from "./Model";
import Firebase from "../util/Firebase";

export default class Chat extends Model
{

    constructor()
    {

    }

    get users() {this._data.users;};
    set users(value) {this._data.users = value;};

    get timeStamp() {this._data.timeStamp;};
    set timeStamp(value) {this._data.timeStamp = value;};


    static getRef()
    {
        return Firebase.db().collection('/chats');
    }

    static create(meEmail, contactEmail)
    {
        return new Promise( (s, f) =>
        {

            // cria um novo objeto com os emails do chat
            let users = {};

            // define os 2 emails no objeto
            users[btoa(meEmail)]      = true;
            users[btoa(contactEmail)] = true;


            // gera um novo 'id' na coleção '/chats'
            Chat.getRef().add(
            {
                users,                      // objeto com os 2 emails envolvidos na conversa
                timeStamp : new Date()      // data e hora do chat
            }).then( doc =>
            {

                // após inclusão, faz a pesquisa pelo id
                // verificando se o chat foi realmente criado
                Chat.getRef().doc(doc.id).get().then(chat =>
                {
                    s(chat)
                }
                ).catch( err =>
                {
                    // falha ao retornar o chat criado
                    f(err);
                });

            }).catch( err =>
            {
                // falha ao tentar criar um novo chat
                f(err);
            });

        }); 
    }    

    static find(meEmail, contactEmail)
    {
        // acessa a coleção '/chats'
        // faz uma pesquisa onde exista um registro
        // que tenha 2 emails == true, identificando a conversa
        // entre estes 2 emails
        // e retorna a promessa com o método 'get'
        return Chat.getRef()
                   .where(btoa(meEmail)     , '==', true)
                   .where(btoa(contactEmail), '==', true)
                   .get();
    }

    static createIfNotExists(meEmail, contactEmail)
    {

        return new Promise((s, f) =>
        {

            // procura uma conversa que tenha estes 2 emails 
            Chat.find(meEmail, contactEmail).then( chats =>
            {

                // verifica se a lista de chats para os emails
                // for vazia, indica que o chat não existe, então cria um novo chat
                // para os emails informados
                if (chats.empty)
                {

                    // create
                    Chat.create(meEmail, contactEmail).then(chat =>
                    {
                        // se conseguir criar um novo chat
                        // retorna o chat encontrado
                        s(chat);
                    }
                    ).catch(err =>
                    {
                        // caso ocorra algum erro ao criar o chat
                        // executa o método de falha da promise, passando o erro
                        f(err);
                    }); 

                }
                else
                {
                    // retorna o id do chat selecionado
                    chats.forEach(chat =>
                    {
                        // retorna o chat 
                        s(chat);
                    });
                    
                }

            }
            ).catch(err =>
            {
                // caso ocorra algum erro na chamada
                // executa o método de falha da promise, passando o erro
                f(err);
            }); 
            

        });

    }

}
