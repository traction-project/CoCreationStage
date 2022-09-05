import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import {  MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent as ModalComponent } from '../shared/components/popup/modal.component';
import { JetsonService } from '../shared/services/jetson.service';
@Component({
  selector: 'cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent implements OnInit{
  camerasList:any[]=[];
  dataService:any;
  dataToReturn: any;
  constructor(dataService:DataService,public matDialog: MatDialog,public jetsonService:JetsonService) {
    this.dataService=dataService;
    this.dataService.getCamerasObservable().subscribe((e)=>this.cameraChange(e));
  }
  ngOnInit(){

    this.camerasList= [];
    this.dataService.setCameras(this.camerasList);
  }
  addCamera(data:any,type?:string){
    if (type==="webrtc")
      this.camerasList.push({'number':this.camerasList.length,type:'video',color:'#'+Math.floor(Math.random()*16777215).toString(16),url:data.name,name:data.name});
    else {
      
      this.camerasList.push({'number':this.camerasList.length,type:'video',color:'#'+Math.floor(Math.random()*16777215).toString(16),url:data,name:this.getFileName(data)});
      let len = data.split('/').length;
      let session = data.split('/')[len-1];
      let id = this.camerasList.length-1;
      setTimeout(()=>{
        let wcmp = document.querySelectorAll('x-media')[id].querySelector('video');
        let ctrl = this.dataService.getAppInstance().syncObjects(wcmp,session);
        setTimeout(()=>{ctrl.play();},2000);
    },1000);
      
    }
    this.dataService.setCameras(this.camerasList);
  }
  removeCamera(c){
    this.camerasList.splice(this.camerasList.indexOf(c),1);

  }
  cameraChange(e: any) {
    /*this.camerasList = e.filter((c)=>{
      if (!c.name) return false;
      if (c.url) return true;
      return false;
    })*/

  }
  getFileName(filename:string){
    filename = filename.substring( filename.lastIndexOf('/')+1, filename.length );
    return filename;
  }
  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
    
      optin_mode:"add_file",
      sub_mode:"url"
    
  }
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(
         data => {
           if (data.type=="url" || data.type=="webrtc") this.addCamera(data.data);
           else {
             console.log("adding rtsp camera",data.data);
             this.jetsonService.setRtsp(data.data.name,data.data.uri).then((e)=>{
                setTimeout(()=>{this.addCamera(e);},4000);

             });
           }
         }
     );

}


}
