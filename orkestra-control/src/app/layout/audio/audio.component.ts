/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Component, ViewChild, ElementRef } from '@angular/core';
import {Orkestra,URI} from 'orkestraLib';
import {JanusClient} from 'orkestraLib';
import { DataService } from 'src/app/shared/services/data.service';
import { JanusPublishService } from 'src/app/shared/services/janus.publish.service';
import { Title } from '@angular/platform-browser';
import { Message } from 'src/app/shared/instruments/messages';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'audio-component',
  templateUrl: './audio.component.html',
  styleUrls: [ './audio.component.scss' ]
})
export class AudioComponent  {
    orkestra: any;
    users:any;
    appData:any;
    app: any;
    dataService:any;
    actMsgs:any[]=[];
    start:string ="START";
    stop:string ="STOP";
    disabled:boolean = true;
    chat:boolean=false;
    options:any ;
    config:any;
    peerId:string;
    @ViewChild('chatdiv') chatdiv: ElementRef;
    name: string ="";
    onairAt:string[]=[];
    started:boolean=false;
    oldFrom: any;
    oldMsg: any;
    statusStream: string="Paused";
    statusButtonPlay: string = "Start";
  
    constructor(private titleService:Title,private elRef:ElementRef,dataService:DataService,private janusPublish:JanusPublishService,public matDialog: MatDialog,private route:Router){
       console.log("MASTER",URI.getUrlVar('master') === 'true');
       this.app = new Orkestra({url:'https://'+environment.sharedStateServer+'/',channel:URI.getUrlVar('channel'),profile:'camera',master:true,agentid:URI.getUrlVar('audio')});
       this.dataService=dataService;
       this.titleService.setTitle("Audio Page");
       this.dataService.setAppInstance(this.app);
       this.peerId  = "aud_"+URI.getUrlVar('audio');
       this.config = JSON.stringify({"janusServer": environment.janusIp,"room": parseInt(URI.getUrlVar('room'))});
       this.options = JSON.stringify({"audio":true,"video":false,"simulcast":true,"bitrate":0,"noiseS":false,"echoC":false,"gainC":false});
       (window as any).FlexJanus= JanusClient(null,environment.janusIp,parseInt(URI.getUrlVar('room')));
       (window as any).FlexJanus.init(null);     
       this.app.readyObservable.subscribe(x => {
       
        this.app.data('message',Message,'');
        this.app.subscribe("onair_"+this.app.getMyAgentId());

       });
       this.app.appObservable.subscribe(x => {
         console.log("application attribute change",x);
          this.appData = this.app.getAppData();
          if (x.key.indexOf("micro")!=-1){
            console.log(x.key);
          }
          else if (x.key.indexOf("onair_"+this.app.getMyAgentId())!=-1)
          {
            if(x.data){
              this.onairAt=x.data.value;
            }
            else{
              this.onairAt=x.value;
            }

            console.log('ONAIR');
          }
       });
       setTimeout(()=>{
	        this.disabled= false;
       },2000)
    }
    ngOnInit() {
      this.elRef.nativeElement.querySelector('app-top-bar').setAttribute("display",false);
  
    }
    publishAudio(){
      let id = "cam_"+this.app.getMyAgentId();
      this.started=true;
    //  this.elRef.nativeElement.querySelector('webrtc-publisher').style.display="block";
      this.elRef.nativeElement.querySelector('webrtc-publisher').publish();
      this.elRef.nativeElement.querySelector('webrtc-publisher').setOrkestraInstance(this.app)	
    this.started=true;      
// setTimeout(()=>{
      //   this.elRef.nativeElement.querySelector('#audio-device').selectedIndex=0;
      //   this.elRef.nativeElement.querySelector('#myaudio').style.display='block';
      //   this.elRef.nativeElement.querySelector('#myaudio').play();
      //   this.elRef.nativeElement.querySelector('#myaudio').muted = true;
      // },2000);
      var wn = (document.querySelector('iframe') as any).contentWindow;
      let cmd  = {cmd:'mute',agentid:"actor_"+this.app.getMyAgentId()};
    //  wn.postMessage(cmd,'https://cloud.flexcontrol.net/traction/?profile=preview');
    }
    unpublishAudio(){
      let id = "actor_"+this.app.getMyAgentId();
      this.started=false;
      this.elRef.nativeElement.querySelector('webrtc-publisher').unpublish();
      this.elRef.nativeElement.querySelector('webrtc-publisher').style.display="none";
    	/*setTimeout(()=>{
    		this.elRef.nativeElement.querySelector('#myvideo').pause();
    		this.elRef.nativeElement.querySelector('#myvideo').style.display='none';
    	},1000);*/
    }
    changeDev(){
     this.janusPublish.changeDev();
     setTimeout(()=>{
       this.elRef.nativeElement.querySelector('#myaudio').play();
     },1000);

    }
    viewChat(){
      if(this.chat){
         this.chat = false;
      this.chatdiv.nativeElement.style.display = 'none';
      this.elRef.nativeElement.querySelector('#chat').style.background="white"
      this.elRef.nativeElement.querySelector('#chat').style.color="black"
      }
      else{
        this.chat=true;
        this.chatdiv.nativeElement.style.display='block';
        this.elRef.nativeElement.querySelector('#chat').style.background="blue"

      }
    }
    // @HostListener('window:keyup', ['$event'])
    // keyEvent(event: KeyboardEvent) {
    //   if(event.key == "Enter"){
    //     let txt = this.elRef.nativeElement.querySelector('#msg').value;
    //     if (txt=="") return;
    //     let admin = this.dataService.getUsers().find((usr)=>{
    //       return usr.capacities.userProfile ==="admin";
    //   })
    //   if (admin){
    //        this.app.setUserContextData(admin.id,'message',{msg:txt,from:this.app.getMyAgentId()});
    //        this.actMsgs.push("Me: "+txt);
    // }
    //   else alert("not admin connected");
    //   this.elRef.nativeElement.querySelector('#msg').value = "";
    //   this.elRef.nativeElement.querySelector('#chatbody').scrollTop+=100
    //   }
    // }

    toggleSettings(){
      this.elRef.nativeElement.querySelector('webrtc-publisher').showConfig();
    }
    toggleStylePlay(e): void{
      if (e.type ==="play"){
        let pauseBtn = this.elRef.nativeElement.querySelector("#pauseBtn");
        pauseBtn.classList.remove("pause");
        pauseBtn.classList.add("pause");
        pauseBtn.classList.remove("play");
        
        this.statusButtonPlay="Pause"
        let led = this.elRef.nativeElement.querySelector("#led");
        led.classList.remove("ledOff");
        led.classList.remove("ledOn");
        led.classList.add("ledOn");  
        this.statusStream = "Active"
      
      }
      else {
        let pauseBtn = this.elRef.nativeElement.querySelector("#pauseBtn");
        pauseBtn.classList.remove("play");
        pauseBtn.classList.add("play");
        pauseBtn.classList.remove("pause");
        
  
         this.statusButtonPlay="Start"
      
      let led = this.elRef.nativeElement.querySelector("#led");
      led.classList.remove("ledOn");
      led.classList.remove("ledOff");
      led.classList.add("ledOff");  
      this.statusStream = "Paused"
      
    }
     
  }
  togglePlay(): void{
  
   
      if(this.statusButtonPlay ==="Start"){
        this.publishAudio();
        
      }else{
        this.unpublishAudio();
  
      }
  
     
  }
  isOn (){
    if (this.started===true && (window.FlexJanus as any).feeds.length!==0){
       return true;
    }
    else return false;
  }
  closeChat(){
    this.elRef.nativeElement.querySelector('.content').classList.add('fullContent')
    this.elRef.nativeElement.querySelector('.pathChat').classList.add('pathNoChat')
  }
  openChat(){
    this.elRef.nativeElement.querySelector('.content').classList.remove('fullContent')
    this.elRef.nativeElement.querySelector('.pathChat').classList.remove('pathNoChat')
  }
  
  goBack(){
     document.location.href ="/"
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
