/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Orkestra, URI } from 'orkestraLib';
import { DataService } from 'src/app/shared/services/data.service';
import { Message } from 'src/app/shared/instruments/messages';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { DBService } from 'src/app/shared/services/db.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'mediac-component',
  templateUrl: './mediac.component.html',
  styleUrls: ['./mediac.component.scss']
})
export class MediaCComponent {

  orkestra: any;
  users: any;
  appData: any;
  app: any;
  server: any;
  rooms: any = [];
  activeShow: any;
  activeRoom: any;
  activeDevices: any;
  config: any = JSON.stringify({ muted: "false", autoplay: "false" });
  configCam: any = '{"janusServer":"stage.traction-project.eu","muted":"true","room":630}';
  myForm: FormGroup;
  forms:any = new Map<string, FormGroup>();
  name: string;
  constructor(private changeDetectorRef: ChangeDetectorRef, private dbService: DBService,private router: Router, private dataService: DataService, private sanitizer: DomSanitizer, public elem: ElementRef) {
   
    this.activeShow = this.dataService.getActiveShow();
    if (typeof this.activeShow=="undefined") this.router.navigate(["/template"]);
    /* Loaded from db */
    this.configCam = '{"janusServer":"'+environment.janusIp+'","muted":"true","room":'+parseInt(URI.getUrlVar('room'))+',"showAudioInput":"true", "profile": "low"}';
    if (typeof this.activeShow === "undefined") {
      this.standAloneDebug();
    }
    else {
      this.activeShow = this.dataService.getActiveShow();
      this.rooms = this.activeShow.rooms;
      this.createForms();

    }
    this.name = "Cameras Controller";
    //  this.server= this.sanitizer.bypassSecurityTrustResourceUrl("http://"+environment.server+"/?profile=preview&channel="+this.activeShow.name);
    console.log("MASTER", URI.getUrlVar('master') === 'true');
    this.app = new Orkestra({ url: 'https://' + environment.sharedStateServer + '/', channel: URI.getUrlVar('channel'), profile: 'viewer', master: false });
    this.dataService.setAppInstance(this.app);
    console.log(this.dataService.getActiveShow());
    this.app.userObservable.subscribe(z => {

      if (z.data && z.data.key == "message" && z.data.value !== "undefined")
        this.dataService.setNewMessage({ agentid: z.data.agentid, from: z.data.value.from, msg: z.data.value.msg });
      else if (z.data && ["userData"].indexOf(z.data.key) == -1)
        this.dataService.setUsers(this.app.getUsers());

    });



    this.app.readyObservable.subscribe(x => {

      //  this.app.data('userData',UserData,'');
      this.app.data('message', Message, '');

      //this.app.setAppAttribute('loadSound',{volumen:1,speed:0.21})

    });
    this.app.appObservable.subscribe(x => {
      console.log("application attribute change", x);
      this.appData = this.app.getAppData();
    });
    this.dataService.msgObservable.subscribe((e) => {

    })
  }
  ngOnInit() {
    setTimeout(() => {
      this.rooms = this.dataService.getActiveShow().rooms;
    }, 2000);
  }
  standAloneDebug() {
    this.dbService.getShows().subscribe((e) => {
      let data: any = e;
      let tnp: any[] = [];
      data.forEach(x => {
        let _x = JSON.parse(x.show);
        tnp.push(_x);
      })
      this.dataService.setShows(tnp);
      let showName: string = localStorage.getItem('show');
      this.dataService.setActiveShow(showName);
      this.activeShow = this.dataService.getActiveShow();
      this.rooms = this.activeShow.rooms;
      this.activeRoom = this.activeShow.rooms[0].name;
      this.createForms();
    });

  }
  muteVideo(event,a){
    event.stopPropagation();
    console.log(a);
    var aux= Array.from(document.querySelectorAll('x-media')).filter((element: any)=>{
      return element.input==a;
    }) as any[]
    if(aux[0].muted==false){
      aux[0].muteVideo();
      event.srcElement.className="fas fa-volume-mute";
    }
    else{
      aux[0].unmuteVideo();
      event.srcElement.className="fas fa-volume-up";
    }
  }
  deviceHasCam(d) {
    return ('cam' in d);
  }

  update(data1:any) {
    data1.bitrate = parseInt(data1.bitrate) *1024;
    this.app.useServiceHub(this.app.options.channel+"_mediaServs").then(() => {

      let data = { "io": "in", data: data1 };
      this.app.sendServiceData('adaptiveStream_'+data1.id, data);

    });
    let medias = this.elem.nativeElement.querySelectorAll('x-media');
    medias.forEach((m)=>{
      m.shadowRoot.querySelector('video').setAttribute('control',true);
    })
  }
  createForms(){

    this.rooms.forEach(r=>{
      r.devices.forEach(d=>{
          if(this.deviceHasCam(d)) {
            let myForm1 = new FormGroup({
              id:new FormControl(d.cam.name),
              bitrate: new FormControl(0),
              video: new FormControl(true),
              audio: new FormControl(true),
              echoC: new FormControl(false),
              gainC: new FormControl(false),
              simulcast: new FormControl(true),
              noiseS: new FormControl(false),
              volIncrease: new FormControl(1)
            });
            myForm1.valueChanges.subscribe(this.onFormChange.bind(this));
            this.forms.set(r.name+"_"+d.cam.name,myForm1);
          }
      })
      r.cams.forEach(c=>{
        let myForm2 = new FormGroup({
          id:new FormControl(r.name+"_"+c.name),
          bitrate: new FormControl(0),
          video: new FormControl(true),
          audio: new FormControl(true),
          echoC: new FormControl(false),
          gainC: new FormControl(false),
          simulcast: new FormControl(true),
          noiseS: new FormControl(false),
          volIncrease: new FormControl(1)
        });
        myForm2.valueChanges.subscribe(this.onFormChange.bind(this));
        this.forms.set(r.name+"_"+c.name,myForm2);
      })
      r.audios.forEach(a=>{
        let myForm = new FormGroup({
          id:new FormControl(r.name+"_"+a.name),
          bitrate: new FormControl(0),
          video: new FormControl(false),
          audio: new FormControl(true),
          echoC: new FormControl(false),
          gainC: new FormControl(false),
          simulcast: new FormControl(true),
          noiseS: new FormControl(false),
          volIncrease: new FormControl(1)
        });
        myForm.valueChanges.subscribe(this.onFormChange.bind(this));
        this.forms.set(r.name+"_"+a.name,myForm);
      })
    })
   
   
  }
  getFormControl(name:string){
     return this.forms.get(name);
  }
  onFormChange(val: any) {
    console.log("FORM CHANGE", val);
    this.update(val)
  }
  ifEmpty(r:any){
    return typeof r.devices =="undefined" || r.devices.length ===0;
  }
  showConfig(ms){
    var aux=document.querySelector('#'+ms) as HTMLElement;
    if(aux.style.display=="none"){
      aux.style.display='block';
    }
    
    
  }
  closeForm(ms){
    var aux=document.querySelector('#'+ms) as HTMLElement;
    aux.style.display='none';
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
