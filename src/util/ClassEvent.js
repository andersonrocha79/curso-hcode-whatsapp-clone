export class ClassEvent
{

    constructor()
    {
        this._events = {};
    }

    // passa o evento que será 'ouvido'
    // e qual função será executada
    on(eventName, fn)
    {
        // verifica se o evento já existe na lista
        if (!this._events[eventName]) 
        {
            this._events[eventName] = new Array();            
        }

        // inclui a função no array criado para o evento 'eventName'
        this._events[eventName].push(fn);
    }

    // o primeiro parâmetro tem que ser o nome da função
    // os outros parâmetros podem variar
    trigger()
    {

        // faz a leitura dos argumentos passados na função
        // utiliza o 'spread' para transformar a variável arguments em um 'array'
        let args = [...arguments];

        // utiliza o 'shift' para remover o primeiro elemento do array, 
        // retornando o item removido e removendo o primeiro item do array passado como parâmetro
        // o primeiro item deste array é sempre o 'nome do evento'
        let eventName = args.shift();

        // inclui mais um argumento com o evento no padrão JS (último parâmetro)
        args.push(new Event(eventName));

        // verifica se o nome do evento passado na função
        // existe no array de eventos, e se também é um array
        if (this._events[eventName] instanceof Array)
        {
            // o evento existem no array '_events' e também é um 'array'
            this._events[eventName].forEach(fn=>
            {
                // percorre as funções vinculadas ao evento passado como parâmetro
                // executa a função passada como parâmetro, e envia o restante dos args
                fn.apply(null, args);
            });
        }


    }

    /**
     * _events (array)
     *    play (array)
     *       função1
     *       função2
     *    click
     *       função3
     *       função4
    */       
          

}