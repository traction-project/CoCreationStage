import { Room } from './room.class';

export class Show {
    numberOfShows:number=0;
    name:string;
    rooms:Room[];
    multimedia:any[];
    numberOfRooms:number;
    remoteAudience:boolean;
    scenes:number;
    nosignalimg:string;
    transitionConfig:any = {}
    nosignalimgs:any = [];

    constructor(name:string,rooms:Room[],multimedia:any,number:number,rAudience:boolean,scenes:number,nosignalimg:string){
        this.name = name;
        this.rooms = rooms;
        this.multimedia = multimedia;
        this.numberOfRooms = number;
        this.remoteAudience = rAudience;
        this.scenes=scenes;
        this.nosignalimg=nosignalimg;

    }


}
