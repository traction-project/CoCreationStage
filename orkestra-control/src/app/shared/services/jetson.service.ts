import { Injectable,EventEmitter,OnInit } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { DataService } from './data.service';
import {ObjectSync} from 'orkestraLib';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';


@Injectable()
export class JetsonService {

  private data:any=[];

  jetsonIP: string = "192.168.15.141";
  jetsonInitPort: number =60000;
  dataservice: DataService;
  timevalue:number;
  motionObservable: Observable<any>;
  motionObserver: any;
  http: HttpClient;
  register:any[]=[];
  constructor (dataservice:DataService,http:HttpClient,private notificationService: NotificationService){
    this.motionObservable =new Observable((observer) => { this.motionObserver = observer});
    this.dataservice =dataservice;
    this.http = http;
    this.jetsonIP = environment.jetsonIp;

  }

  private getStreamStatus(streamId:number){

    // let headers = new Headers({'Content-Type': 'application/json'});
    // headers.set('Content-Type', 'application/json');
    // let options = ({ headers: headers });
    let url:string = "http://"+this.jetsonIP+":"+streamId+"/stream";
    return this.http.get(url,{})
  }
  async deleteFromName(name:string){
    await this.findFreeChannel();
    let el = this.register.find((channel)=>{ return channel.name === name});
    this.delete(el.streamId).subscribe(e=>this.notificationService.openSnackBar("Webrtc deleted",3000));
  }
  private delete(streamId:number):any{
    let url:string = "http://"+this.jetsonIP+":"+streamId+"/stream";
    return this.http.delete(url)
    }
  private callRtspConf(name:string,uri:string,streamId:number):any{
    this.notificationService.openSnackBar("Converting rtsp "+name+"  to webrtc",3000);
    let url:string = "http://"+this.jetsonIP+":"+streamId+"/stream";
    let options = {
      "video-source":uri,
      "peer-id":name,
      "janusgw-host":"",
      "janusgw-port":8188,
      "width":800,"height":600,"bitrate":1000000}
      return this.http.post(url,options)
    }
    async setRtsp(name:string,uri:string){
      let streamId:any = await this.findFreeChannel();
      console.log(streamId);
      let promise = new Promise((resolve, reject) => {
      this.delete(streamId).subscribe(()=>{
      this.callRtspConf(name,uri,streamId).subscribe((e)=>{
        console.log(e);
        this.register.push({name:name,streamId:streamId});
        setTimeout(()=>{this.notificationService.openSnackBar("Starting webrtc will take 15 seconds",15000);},2000);
        setTimeout (()=>{this.start(streamId).subscribe((e)=>{
          console.log(e);
            this.notificationService.openSnackBar("Webrtc PeerId: "+name+" started",3000);
            resolve(name);
        },(err)=>{
            this.notificationService.openSnackBar("Error setting webrtc:"+err,3000);
            reject("error setting webrtc");
        })
      },15000)
      },(err)=>{
          this.notificationService.openSnackBar("Error setting webrtc:"+err,3000);
      })
    })
    });
    return promise;
  }
  private start(streamId:string){
    let url:string = "http://"+this.jetsonIP+":"+streamId+"/stream/start";
    return this.http.post(url,{})
  }
  private async findFreeChannel(){
    let freeChannel = "";
    let promise = new Promise((resolve, reject) => {
      for (let i:number=this.jetsonInitPort;i<60010;i++){
        this.getStreamStatus(i).subscribe((response: any)=>{
          if (response.status === "READY" && response.configuration=="none"){
            freeChannel = response.streamId.split(':')[1];
            resolve(freeChannel);
          }
          else {
            if(response.status === "PLAYING"){
                this.register.push({name:response.configuration["peer-id"],streamId:response.streamId.split(':')[1]});
            }
          }
        })
      }
    });
    await promise;
    return freeChannel;
  }

  reset(){

  }
  paused ():boolean{
    return true //timerController.playbackRate === 0;
  }
  seek(fr:any){


  }

}
