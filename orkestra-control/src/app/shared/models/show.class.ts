/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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
