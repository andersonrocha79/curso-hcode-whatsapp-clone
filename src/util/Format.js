class Format
{

    static getCamelCase(text)
    {
        // retorna um array com todos os elementos
        // que tem 'id' no texto html
        let div = document.createElement('div');
        div.innerHTML = `<div data-${text}="id"></div>`;
        return Object.keys(div.firstChild.dataset)[0];

    }

}