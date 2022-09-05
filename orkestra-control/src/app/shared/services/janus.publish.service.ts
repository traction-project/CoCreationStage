import { Injectable,EventEmitter,OnInit, ElementRef } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import {JanusPublish} from 'orkestraLib';
import { DataService } from './data.service';
import { environment } from 'src/environments/environment';
import { JanusService } from './janus.service';



@Injectable()
export class JanusPublishService {
  camerasList: any;
  dataService: DataService;
  PublishJanus: any;

  constructor(dataService:DataService,public janusService:JanusService){

       this.dataService = dataService;
  }
  init (dom:any,room:number){

       this.PublishJanus  = JanusPublish(dom,environment.janusIp,room);
  }
  publish(id:string){

  this.PublishJanus.init(id);
  this.PublishJanus.initDevices();


 }
 unpublish(id){

 	this.PublishJanus.stop(id);

 }
 changeDev(){
 	this.PublishJanus.changeDev();

}
mute(status:boolean){

     this.PublishJanus.toggleMute(status)

}

}
