
import Firebase from "./Firebase";

export default class Upload
{

    static send(file, from)
    {

        return new Promise( (s, f) => 
        {

            // monta a referencia para armazenar o arquivo no firestore
            // hd / email / data+nomearquivo 
            let uploadTask = Firebase.hd().ref(from).child(Data.now() + "_" + file.name).put(file);

            uploadTask.on('state_changed', 
            e =>
            {
                // exibir progresso
                console.info('upload', e);
            },
            err =>
            {
                // erro
                f(err);
            },
            () =>
            {
                s(uploadTask.snapshot);
            });               
        });    

    }

}