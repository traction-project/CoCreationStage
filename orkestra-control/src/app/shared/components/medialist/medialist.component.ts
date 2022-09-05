import { ChangeDetectionStrategy, Component, ElementRef, Input, NgModule, OnInit, Sanitizer, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { ModalComponent } from '../popup/modal.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'medialist',
    templateUrl: './medialist.component.html',
    styleUrls: ['./medialist.component.scss'],
    encapsulation: ViewEncapsulation.None,

  })
  export class MedialistComponent implements OnInit{
    mmedia:any[]=[];
    rooms:any[]=[];
    app:any;
    config:any = JSON.stringify({muted:"true",autoplay:"false"});
    configCam:any = `{"janusServer": "${environment.janusIp}","muted":"true","profile":"low"}`;
    constructor(private dataService:DataService,private sanitizer: DomSanitizer,public matDialog: MatDialog,){
        this.dataService = dataService;
    }
    ngOnInit(){
      setTimeout(()=>{
        this.mmedia=this.dataService.getActiveShow().multimedia;
        this.mmedia = this.mmedia.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.place === value.place && t.name === value.name
          ))
        )
        this.rooms=this.dataService.getActiveShow().rooms;
      },2000);
    }
    getImageFromDashVideo = (url) => {
      return url.replace(/transcoded\/(.+).mpd/, 'transcoded/thumbnails/$1_00001.png')
    }
    toggleMute(mute:boolean,agent:string){
        console.log("should send shareState to mute/unmute micro");
        if (this.app){
          this.app.setAppAttribute("micro_"+agent,mute);
        }
        else {
          this.app = this.dataService.getAppInstance();
        }
    }
    deviceHasCam(d){
      return ('cam' in d);
    }
    notCameras(r:any){
        if (typeof r.cams=="undefined" || r.cams.length==0)
         if (typeof r.devices=="undefined" || r.devices.length==0 )
         if (typeof r.audios == "undefined" || r.audios.length==0) return true
         return false;
    }
    openNoSignalDialog(deviceName:any) {
      this.dataService.setNoSignalConfDev(deviceName);
      
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = {
          optin_mode: "nosignal",
          sub_mode: "",
      };
      
      // https://material.angular.io/components/dialog/overview
      const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
      
      modalDialog.afterClosed().subscribe((data) => {
          if (data && data.type == "nosignal") {
              this.dataService.setNoSignal(data.data, deviceName);
          }
      });
  }

  }
