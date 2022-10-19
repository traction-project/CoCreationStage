/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable()
export class YTService {
    server:string;
    ytkey:string;
    pass:string;
    constructor() {
        this.server = environment.ytServer;
    }
    setConfig(ytkey:string,rtmp:string) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        this.pass = environment.ytPass;
        this.ytkey = ytkey;
        var raw = JSON.stringify({
            "pass": this.pass,
            "config": {
                "youtubeKey":this.ytkey,
                "bitrate": "2400kb",
                "rtmp":rtmp
            }
        });

        var requestOptions:RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

       return fetch(this.server+"/api/setConfig", requestOptions)
            
    }
    start() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "pass": this.pass
        });

        var requestOptions:RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch(this.server+"/api/start", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    stop() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "pass": this.pass,
           
        });

        var requestOptions:RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch(this.server+"/api/stop", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    status() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "pass": this.pass
        });

        var requestOptions:RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

       return fetch(this.server+"/api/status", requestOptions)
           
           
    }

}