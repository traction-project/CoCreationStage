/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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