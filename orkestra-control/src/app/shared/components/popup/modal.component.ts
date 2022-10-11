import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { RtspCam } from 'src/app/shared/models/rtspCam.class';
import {MatSelectionList, MatSelectionListChange, MAT_DIALOG_DATA} from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
//import { YTService } from '../../services/yt.service';
import { Room } from '../../models/room.class';
import { Show } from '../../models/show.class';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {
  _url:string="";
  optin_mode:string="url";
  camList:string[]=["cam1","cam2"];
  layouts:string[]=["Divided","Mosaic"]
  cam:string;
  rcam:RtspCam;
  activeLayout:string;
  name:string="";
  users:any;
  userSelected:any;
  sub_mode: any;
  ytPlayerUrl:string = "https://player.twitch.tv/?channel=tamaxx__&parent=localhost";
  ykey:string="live_769503280_OvrzeoJuVlcLkX3TngH8xf8VGw3s9b";
  ytlog:string = "";
  ytserver:string= "18.200.88.210";
  ytUrl:string="rtmp://mad01.contribute.live-video.net/app";
  statusLoop:any;
  devices:any = [];
  devName:string="unknown";
  devTo:string;
  transitionConfig:any = {
    color:"black",
    time:1500

  }
  services:any=[{
    name:"Twitch",
    url:"rtmp://mad01.contribute.live-video.net/app",
    embeded:"https://player.twitch.tv/?channel=tamaxx__&parent=localhost",
    key:"live_769503280_OvrzeoJuVlcLkX3TngH8xf8VGw3s9b"
  },
  {
    name:"Youtube",
    url:"rtmp://a.rtmp.youtube.com/live2",
    embeded:"https://www.youtube.com/embed/ryV-5dW6LZ8",
    key:"jqwc-hexq-0xhj-zg8c-a0vy"

  }
  
]
  service:any;
  images:any = [];
  nosignalImage:any;
  constructor(public elem:ElementRef,public dialogRef: MatDialogRef<ModalComponent>,public dataService:DataService,/*public ytService:YTService,*/@Inject(MAT_DIALOG_DATA) public data: any) {
      
      console.log(this.camList);
      this.rcam = new RtspCam("","");
 
      this.optin_mode = this.data.optin_mode;
      this.sub_mode = this.data.sub_mode;
      this.users = this.dataService.getUsers();
      this.users.push({id:"all"});
      if(this.dataService.getActiveShow()!=undefined && this.dataService.getActiveShow().transitionConfig!= undefined){
        this.transitionConfig = this.dataService.getActiveShow().transitionConfig || {color:"black",time:1500};
      }
      else{
        this.transitionConfig = {color:"black",time:1500}
      }
   }

  ngOnInit() {

     let media:any = undefined;
     if (this.dataService.getActiveShow()) media=this.dataService.getActiveShow().multimedia;
     if(media) this.getImages(media);    
      media=this.dataService.getActiveShow().multimedia;
      let activeShow:Show =this.dataService.getActiveShow();
      let rooms:Room[] = activeShow.rooms;
      let activeRoom:Room = this.dataService.getActiveRoomObj();
      this.devName = this.dataService.getActiveRoom() + "_" + this.dataService.getSelectedDevice();
      this.devices.push("all");
      rooms.forEach((r)=>{
        r.devices.forEach(element => {
           this.devices.push(element.id);
        });
      })
      this.getImages(media); 
  }
  changeOptionMode(e:any){
    console.log(e);
  }
  updateList(){
    this.camList = this.dataService.getWebrtcStreams().map((ac)=>{
       return ac.name;
    });
  }
  getImages(multimedia:any){
     this.images = multimedia.filter((m)=>{
        if (m.url.toLowerCase().indexOf('png')!=-1 || m.url.toLowerCase().indexOf('jpg')!=-1
        || m.url.toLowerCase().indexOf('jpeg')!=-1 || m.url.toLowerCase().indexOf('gif')!=-1
        || m.url.toLowerCase().indexOf('webp')!=-1) return true;
        return false;
     });
     /* for test */
     this.images.push({name:"xxx",url:"https://ametic.es/sites/default/files//vicomtech-brta_rgb1_0.png"});
     this.images.push({name:"xabier",url:"https://www.pinclipart.com/picdir/big/165-1653686_female-user-icon-png-download-user-colorful-icon.png  "});
      /* for test */
    }
  onListSelectionChange(ob: MatSelectionListChange){    
    ob.option.selectionList.deselectAll();
    ob.option.selected = true;
    if (this.optin_mode === "stageyt"){
       console.log(ob);
       this.ytPlayerUrl = ob.option.value.embeded;
       this.ykey = ob.option.value.key;
       this.ytUrl = ob.option.value.url;
    }
  }
  /* default selected service */
  default (service:any){
    if (service.name === "Twitch") return true;
  }
  // When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {

    if (this.optin_mode==="stageyt"){
      this.dialogRef.close({type:"ystage",data:this.transitionConfig});
    }
    else
    if (this.optin_mode==="copyComponents"){
      this.dialogRef.close({type:"copyComponents",data:{to:this.devTo}});
    }
    else if (this.optin_mode==="transition"){
      this.dialogRef.close({type:"transition",data:this.transitionConfig});
    }
    else if (this.nosignalImage){
      this.dialogRef.close({type:"nosignal",data:this.nosignalImage});
    }
    else if (this.userSelected && this.userSelected!=""){
      this.dialogRef.close({type:"timeline",data:this.userSelected});
    }
    else 
    if (this.name != ""){
      this.dialogRef.close({type:"name",data:this.name});
    }
    else 
    if (this._url != "")
      this.dialogRef.close({type:"url",data:this._url});
    else
      if (this.rcam.name!="")
         this.dialogRef.close({type:"rtsp",data:this.rcam})
      else
        if (this.activeLayout!=""){
           console.log("LAYOUT CHOSED!",this.activeLayout[0]);
           this.dialogRef.close({type:"layout",data:this.activeLayout[0]});
        }
        else
          this.dialogRef.close({type:"webrtc",data:this.cam[0]});

  }

  startYT (){
      // clearInterval(this.statusLoop);
      // this.ytService.setConfig(this.ykey,this.ytUrl).then(response => response.text())
      // .then(result => {
      //   this.ytService.start();
      //   setTimeout(()=>{this.ytPlayerUrl += "&update=1";},10000);
      //   console.log(result)
      // })
      // .catch(error => console.log('error', error));;
      
      // this.statusLoop = setInterval(()=>{
      //     this.ytService.status().then(response => response.text()).then((txt)=>{
      //         this.elem.nativeElement.querySelector('#status').value=txt;
      //     }).catch((er)=>{
      //       console.error(er);
      //     })
      // },2000);
  }
  stopYT (){
    // this.ytService.stop();
    // setTimeout(()=>{
     
    //   clearInterval(this.statusLoop);
    // },4000)
  }
  saveYT (){
    /* cookies */
  }
  closeModal() {
    this.dialogRef.close(null);
  }
  remove(name:string){
   
  }

}
