/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import {  ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import {Orkestra,URI,UserTable,AppTable,KeyPress} from 'orkestraLib';
import {TextData} from 'orkestraLib';
import {XMedia} from 'orkestraLib';
import { JanusService } from 'src/app/shared/services/janus.service';
import { DataService } from 'src/app/shared/services/data.service';
import { UserData } from 'orkestraLib';
import { Message } from 'src/app/shared/instruments/messages';
import { environment } from 'src/environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { DBService } from 'src/app/shared/services/db.service';
import { ChatAdapter, Theme } from 'ng-chat';
import { MyAdapter } from './MyAdapter.class';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ui-component',
  templateUrl: './ui.component.html',
  styleUrls: [ './ui.component.scss' ]
})
export class UIComponent  {
    orkestra: any;
    users:any;
    appData:any;
    app: any;
    server: any;
    rooms:any=[];
    activeShow: any;
    activeRoom: any;
    activeDevices: any;
    janusConfig:any;
    actMsgs:any = [{"type":"x"}];
    userId = 999;
    title="Users";
    themeAct:Theme = Theme.Dark;
    previewOn:boolean = true;
    public adapter: ChatAdapter;
    constructor(private changeDetectorRef: ChangeDetectorRef,private dbService:DBService,private dataService:DataService,private router: Router,
      janusService:JanusService,private sanitizer: DomSanitizer,public elem:ElementRef,private translateService:TranslateService,private route: ActivatedRoute){
      this.activeShow = this.dataService.getActiveShow();
      if (typeof this.activeShow=="undefined") this.router.navigate(["/template"]);
      this.janusConfig = '{"janusServer":"'+environment.janusIp+'","room":1234}';
      janusService.init();
      this.translateService.get("Users").subscribe(e=>{
          this.title = e;
      });
      /* Loaded from db */
      if (typeof this.activeShow ==="undefined"){
        this.standAloneDebug();
      }
      else {
        this.activeShow = this.dataService.getActiveShow();
        this.rooms = this.activeShow.rooms;

      }
      this.route.paramMap
      .subscribe(params => {
             this.previewOn = params.get("previewOn") == "true";
      }
    );
    //  this.server= this.sanitizer.bypassSecurityTrustResourceUrl("http://"+environment.server+"/?profile=preview&channel="+this.activeShow.name);
       console.log("MASTER",URI.getUrlVar('master') === 'true');
       this.app = new Orkestra({url:'https://'+environment.sharedStateServer+'/',channel:this.activeShow.name,profile:'admin',master:true});
       this.dataService.setAppInstance(this.app);
       this.adapter = new MyAdapter(this.app,this.dataService);
       console.log(this.dataService.getActiveShow());
       this.app.userObservable.subscribe(z=>{

         if ( z.data && z.data.key=="message" && z.data.value!=="undefined")
            this.dataService.setNewMessage({agentid:z.data.agentid,from:z.data.value.from,msg:z.data.value.msg});
         else if (z.data && ["userData"].indexOf(z.data.key)==-1)
             this.dataService.setUsers(this.app.getUsers());

       });



       this.app.readyObservable.subscribe(x => {
        //this.app.data('message',Message,'');
        this.userId = this.app.getMyAgentId();
       //  this.app.data('userData',UserData,'');
         
         this.app.setAppAttribute('muteAll',true);
         //this.app.setAppAttribute('loadSound',{volumen:1,speed:0.21})

       });
       this.app.appObservable.subscribe(x => {
         console.log("application attribute change",x);
           this.appData = this.app.getAppData();
       });
       this.dataService.msgObservable.subscribe((e)=>{

       })
    }
    standAloneDebug(){
      this.dbService.getShows().subscribe((e)=>{
        let data:any = e;
        let tnp:any [] = [];
         data.forEach(x=>{
            let _x = JSON.parse(x.show);
            tnp.push(_x);
         })
         this.dataService.setShows(tnp);
        let showName:string = localStorage.getItem('show');
        this.dataService.setActiveShow(showName);
        this.activeShow = this.dataService.getActiveShow();
        this.rooms = this.activeShow.rooms;
        this.activeRoom = this.activeShow.rooms[0].name;

});

    }
    onRecordEvent(ev:any){
      console.log("Record event",ev);
      if (ev === true) {
        this.elem.nativeElement.querySelector('screen-share').publish();
      }
      else {
        this.elem.nativeElement.querySelector('screen-share').unpublish();
      }
    }
    muteChanges(ev:any){
      console.log("mute changes",ev);
      this.app.setAppAttribute('muteAll',ev);
    }
    playAll(ev:any){
      if (ev === true) {
        this.app.setAppAttribute('play',true);
      }
      else if (ev === false) {
        this.app.setAppAttribute('play',false);
      }
    }

  }

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
