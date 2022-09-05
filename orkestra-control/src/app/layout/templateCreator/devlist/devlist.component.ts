import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import {Orkestra,URI,UserTable,AppTable,KeyPress} from 'orkestraLib';
import { JanusService } from 'src/app/shared/services/janus.service';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Show } from 'src/app/shared/models/show.class';

@Component({
  selector: 'devlist-component',
  templateUrl: './devlist.component.html',
  styleUrls: [ './devlist.component.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class DevlistComponent  {
    orkestra: any;
    users:any;
    appData:any;
    app: any;
    server: any;
    rooms:any = [];
    activeRoom:number = 0;
    janusRoom:number = -1;
    showName:string;
    activeShow: Show;
    constructor(private dataService:DataService,janusService:JanusService,private sanitizer: DomSanitizer,private router: Router,private elRef:ElementRef){

      // this.rooms = [{name:"room1",devices:[],cams:[]},{name:"room2",devices:[],cams:[]},{name:"room3",devices:[],cams:[]}];
       this.activeRoom = 0;
       this.activeShow = this.dataService.getActiveShow();
       if (typeof this.activeShow=="undefined") this.router.navigate(["/template"]);
       this.showName = this.activeShow.name;
       this.janusRoom = this.activeShow.name.split('').map(x=>{ return x.charCodeAt(0)}).reduce((acu,y)=> {return acu+y});
       this.rooms = this.activeShow.rooms;

    }
    getDeviceCamPlayer(roomname:string,dc:any,suffix:string){      
       if (suffix=="dc") return environment.protocol+"://"+environment.staticServer+"/player?id="+suffix+"_"+dc.name+"&room="+this.janusRoom+"&channel="+this.activeShow.name;
       return environment.protocol+"://"+environment.staticServer +"/player?id="+suffix+"_"+roomname+"_"+dc.name+"&room="+this.janusRoom+"&channel="+this.activeShow.name;
    }
    deviceHasCam(d:any){
      if (typeof d.cam !='undefined') return true;
      else return false;
    }
    showDevices(room:any){
        let id = "#devlist_"+room.name;
        let el = this.elRef.nativeElement.querySelector(id);
        el.style.display = el.style.display === "none" ? "table-cell":"none";
    }
    getRoomDevices(room:any){
        let devices = room.devices.filter((d)=>{
            if (!this.deviceHasCam(d)) return true;
            return false;

        })
        return devices;
    }
    getRoomCamDevices(room:any){
      let devices = room.devices.filter((d)=>{
          if (this.deviceHasCam(d)) return true;
          return false;

      })
      return devices;
  }
  }
