export function translate (lng){

    fetch('./locale/'+lng+".json").then(resp=>{
        resp.json().then(data=>{
            for(let entry in data){
                let attribs =  entry.split("_");
                let id = attribs[0];
                let atr = attribs[1];
                if (document.querySelector(id) && document.querySelector(id).shadowRoot){
                    document.querySelector(id).shadowRoot.querySelector("#"+atr).innerHTML = data[entry];   
                }
                else {
                if (atr)
                    try {
                        document.querySelector("#"+id).setAttribute(atr,data[entry]);
                    } 
                    catch (ex){
                        console.error("missing translate object, fill up locale file")
                    }
                else
                try {
                    document.querySelector("#"+id).innerHTML = data[entry];
                } 
                catch (ex){
                    console.error("missing translate object, fill up locale file")
                }
            }
        }
        })
    })
}