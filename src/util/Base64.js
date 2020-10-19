export default class Base64
{

    static getMimetype(urlBase64)
    {

        // procura pelo padrão utilizando o regex
        let regex  = /^data:(.+);base64,(.*)$/;
        let result = urlBase64.match(regex);
        return result[1];

    }

    static toFile(urlBase64)
    {

        let mimeType  = this.getMimetype(urlBase64);     
        let ext       = mimeType.split('/')[1];
        let filename  = `file${Date.now()}.${ext}`;

        return  fetch(urlBase64)
                .then( res    =>  { return res.arrayBuffer(); })
                .then( buffer =>  { return new File([buffer]. filename, { type: mimeType}); });
                
    }

}