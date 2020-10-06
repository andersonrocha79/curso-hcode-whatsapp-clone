import Firebase     from './../util/Firebase';
import Model from './Model';

export default class User extends Model
{

    constructor(id)
    {

        super();

        // se passar o id, que seria o email do usuário
        // no contrutor, já faz a pesquisa do usuário atual
        if (id)         
        {
            this.getById(id);
        }

    }

    // métodos getters e setters 
    // para cada campo do objeto User

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }

    // método que retorna uma promessa
    // com os dados do usuário solicitado
    getById(id)
    {
        // cria uma promessa
        return new Promise((s,f) =>
        {

            // o método 'get' busca o registro uma única vez
            // User.findByEmail(id).get()

            // faz a pesquisa no firebase pelo id, que seria o email
            //User.findByEmail(id).onSnapshot(snapshot =>
            User.findByEmail(id).get().then(snapshot =>
            {

                // recebe em 'doc' o usuário pesquisado
                // e já atualiza o objeto que mantém os dados do usuário
                this.fromJSON(snapshot.data());

                // a promessa retorna o objeto
                s(snapshot);

            });


        });
    }

    save()
    {

        // este método retorna a referência
        // para o usuário atual e executa o método 'set'
        // para salvar o usuário
        // este método retorna uma promessa que poderá ser
        // tratada pelo usuário que chamou este método
        return User.findByEmail(this.email).set(this.toJSON());

    }

    // este método retorna uma referência para a coleção ou nó de usuários
    // que está no firebase
    static getRef()
    {
        return Firebase.db().collection('/users');
    }
    
    // método que retorna o objeto (documento) 
    // do nó usuário pesquisando pelo email passado como parâmetro
    static findByEmail(email)
    {
        return User.getRef().doc(email);
    }

    static getContactsRef(id)
    {

        // retorna a referência para o nó 'contacts'
        // do usuário logado
        return User.getRef()
                   .doc(id)
                   .collection('contacts');

    }

    // adiciona o contato ao usuário atual
    addContact(contact)
    {

        // acessa o caminho
        // users                                nó 'users'
        //    anderson@rochasoft.com.br 
        //       contacts                       nó 'users/contacts'
        //          contato1@teste.com.br 
        //          contato2@teste.com.br 
        //          contato3@teste.com.br 

        // retorna a promessa identificando se conseguiu ou não salvar o contato
        return  User.getRef()
                    .doc(this.email)
                    .collection('contacts')
                    .doc(btoa(contact.email))
                    .set(contact.toJSON());

    }

    // retorna os contatos do usuário logado
    getContacts(filter = '')
    {
        
        return new Promise((s, f) =>
        {

            User.getContactsRef(this.email).where('name', '>=', filter) .onSnapshot( docs =>
            {


                // recebeu os contatos do usuário logado
                // preenche o array 'contacts'

                let contacts = [];

                docs.forEach(doc =>
                {

                    let data = doc.data();

                    data.id = doc.id;

                    contacts.push(data);

                });

                // dispara o evento que está send ouvido no whatsappcontroller
                this.trigger('contactschange', docs);

                // retorna a lista de contatos no 'sucesso da promessa'
                s(contacts);

            });


        });
    }

}