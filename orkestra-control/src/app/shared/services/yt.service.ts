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