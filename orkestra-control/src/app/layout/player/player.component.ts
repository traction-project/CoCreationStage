/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Component, ViewChild, ElementRef } from '@angular/core';
import {URI} from 'orkestraLib';
import { Title } from '@angular/platform-browser';
import {JanusClient} from 'orkestraLib';
import { JanusService } from 'src/app/shared/services/janus.service';
import {environment} from 'src/environments/environment';
@Component({
  selector: 'player-component',
  templateUrl: './player.component.html',
  styleUrls: [ './player.component.scss' ]
})
export class PlayerComponent  {
    orkestra: any;
    users:any;
    appData:any;
    app: any;
    dataService:any;
    actMsgs:any[]=[];
    disabled:boolean = true;
    chat:boolean=false;
    options:any ;
    config:any;
    peerId:string;
    @ViewChild('chatdiv') chatdiv: ElementRef;
    name: string ="";
    input: any;
  janusClient: any;
  janusReady: boolean  = false;
    constructor(private titleService:Title,public elem:ElementRef,public janusAPI:JanusService){
     
      (window as any).FlexJanus= JanusClient(this.elem.nativeElement,environment.janusIp,parseInt(URI.getUrlVar('room')));
      (window as any).FlexJanus.init(this.elem.nativeElement);     
     /* Listen for existing streams */

    document.addEventListener('JanusReady',this.janusReadyListener.bind(this));

    /* Listen for changes on streams (added, removed etc..) */
    document.addEventListener('newStream',this.newStreamListener.bind(this));
      
     
    }
    janusReadyListener(e) {
      (window as any).FlexJanus.janusReady = true;
      
    }
    newStreamListener(e):any {
       console.log("new stream",e);
        setTimeout(() => {
          (window as any).FlexJanus.start(URI.getUrlVar('id'), this.elem.nativeElement);
        }, 2000);
  
    }
    ngOnInit(){
        this.janusAPI.setRoomById(URI.getUrlVar('room'));
        setTimeout(()=>{
          
          this.janusAPI.getParticipants().then((ev:any)=>{
            console.log(ev);
            let partc = ev.plugindata.data.participants.filter((f)=>{return f.display!="flex"});
            if (partc.length>0)(window as any).FlexJanus.registerUsernameAsSubscriber(partc[0].id);
          })

        },4000)
    }
 
    changeBuffer(event,v){
      let buffer = parseFloat(event.srcElement.value);
      (window as any).FlexJanus.changeBuffer(buffer);
    }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
