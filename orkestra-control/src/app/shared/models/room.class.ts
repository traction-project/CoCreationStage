export class Room {
    name:string;
    devices:any[];
    cams:any[];
    audios:any[];
    constructor(name:string){
        this.name = name;
        this.devices = [];
        this.cams = [];
        this.audios = [];
    }

}
