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
