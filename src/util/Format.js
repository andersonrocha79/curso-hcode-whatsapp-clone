
export default class Format
{

    static getCamelCase(text)
    {
        // retorna um array com todos os elementos
        // que tem 'id' no texto html
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];

    }

    static toTime(duration)
    {

        let seconds  = parseInt((duration / 1000) % 60);
        let minutes  = parseInt((duration / (1000 * 60)) % 60);
        let hours    = parseInt((duration / (1000 * 60 * 60)) % 24);
        
        // formata a hora
        if (hours > 0)
        {
            // 0:00:00
            return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        else
        {
            // 0:00
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

    }

}