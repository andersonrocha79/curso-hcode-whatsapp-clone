import ClassEvent from "../util/ClassEvent";

export default class Model extends ClassEvent
{

    // esta classe é a base de todas as classes da pasta 'model'
    // aqui teremos tudo que for comum a todas estas classes

    constructor()
    {

        // chama o construtor da classe pai
        super();

        // define uma variável privada para armazenar os dados da classe
        this._data = {};

    }

    fromJSON(json)
    {

        // mescla o objeto atual com o objeto que está sendo
        // enviado no método
        // atualiza os campos que já existem no destino
        // e inclui os campos novos        
        this._data = Object.assign(this._data, json);

        // dispara o evento indicando que os dados foram alterados
        this.trigger('datachange', this.toJSON());
        
    }

    toJSON()
    {
        return this._data;
    }

}