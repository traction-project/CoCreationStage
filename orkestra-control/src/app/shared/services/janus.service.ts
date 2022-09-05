import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { JanusClient } from 'orkestraLib';
import { DataService } from './data.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class JanusService {
  camerasList: any;
  dataService: DataService;
  trasnaction: string;
  session: string;
  pluginId: string;
  room: number;
  oldvideoId: any;
  oldaudioId: any;
  constructor(dataService: DataService, public http: HttpClient) {

    this.dataService = dataService;
  }
  init() {
    if (!window.FlexJanus) {
      window.FlexJanus = JanusClient(this, environment.janusIp, this.room);
      window.FlexJanus.init(this)
    }
    document.addEventListener('JanusReady', this.janusReadyListener.bind(this));
    document.addEventListener('newStream', this.newStreamListener.bind(this));
    document.addEventListener('updateStream', this.newStreamListener.bind(this));
  }
  janusReadyListener(e) {
    setTimeout(() => {
      this.camerasList = (window as any).FlexJanus.feeds.map((ev) => {
        return { name: ev.rfdisplay, id: ev.id };
      })
      this.dataService.setWebRtcStreams(this.camerasList);
      let cams = this.camerasList.filter((cam) => { if (cam.name.includes('cam')) return true; });
      let actorsCams = this.camerasList.filter((cam) => { if (cam.name.includes('actor')) return true; });
      actorsCams.forEach((ac) => {
        this.dataService.addActorMedia(ac.name, ac);
      })
      this.dataService.setCameras(cams);
    }, 2000);

  }
  newStreamListener(e) {
    console.log(e);
    setTimeout(() => {
      this.camerasList = (window as any).FlexJanus.feeds.map((ev) => {
        return { name: ev.rfdisplay, id: ev.id };
      })
      this.dataService.setWebRtcStreams(this.camerasList);
      let cams = this.camerasList.filter((cam) => { if (cam.name.includes('cam')) return true; });
      let actorsCams = this.camerasList.filter((cam) => { if (cam.name.includes('actor')) return true; });
      actorsCams.forEach((ac) => {
        this.dataService.addActorMedia(ac.name, ac);
      })
      this.dataService.setCameras(cams);
    }, 500);
  }
  createSession() {
    this.trasnaction = "dkididiediewewq1";
    let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus";
    let options = {
      "janus": "create",
      "transaction": this.trasnaction
    }
    return this.http.post(url, options)
  }
  attachToPlugin() {
    let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session;
    let options = { "janus": "attach", "plugin": "janus.plugin.videoroom", "transaction": this.trasnaction };
    return this.http.post(url, options)
  }
  getRooms() {
    return new Promise((resolve, reject) => {
      this.connectToEndPoint().then(() => {
        let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
        let options = { "janus": "message", "body": { "request": "list" }, "transaction": this.trasnaction }
        this.http.post(url, options).subscribe(ev => {
          resolve(ev);
        }, (error) => reject("error"))

      })
    })
  }
  getParticipants() {
    return new Promise((resolve, reject) => {
      this.connectToEndPoint().then(() => {
        let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
        let options = { "janus": "message", "body": { "request": "create", "room": this.room }, "transaction": this.trasnaction }
        this.http.post(url, options).subscribe(ev => {
          resolve(ev);
        }, (error) => reject("error"))

      })
    })
  }
  getPublishers() {
    return new Promise((resolve, reject) => {
      this.connectToEndPoint().then(() => {
        let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
        let options = { "janus": "message", "body": { "request": "listparticipants", "room": this.room }, "transaction": this.trasnaction }
        this.http.post(url, options).subscribe(ev => {
          resolve(ev);
        }, (error) => reject("error"))

      })
    })
  }
  async isRoomExists(room: number) {
    return new Promise((resolve, reject) => {
      this.getRooms().then((ev: any) => {
        if (ev.plugindata.data.list.map(x => { return x.room }).indexOf(room) !== -1) {
          this.room = room;
          resolve(true);
        }
        else resolve(false);
      }, (error) => { reject("getting janus rooms") })
    })
  }
  createRoom(room: number) {
    this.room = room;
    return new Promise((resolve, reject)=>{
      this.connectToEndPoint().then(()=>{
        let url:string = "https://"+environment.janusIp+":"+8089+"/janus/"+this.session+"/"+this.pluginId;
        let options = {"janus": "message", "body": {"request": "create","room":room,"publishers":16,"videocodec":"h264","bitrate":0,"fir_freq": 2}, "transaction": this.trasnaction}
        this.http.post(url,options).subscribe(ev=>{
          resolve(ev);
        }, (error) => reject("error"))
      });
    })
  }
  cleanRooms() {
    this.getRooms().then((ev: any) => {
      let list = ev.plugindata.data.list;
      list.forEach(el => {
        this.removeRoom(el.room);
      })
    });
  }
  removeRoom(room: number) {
    this.room = room;

    let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
    let options = { "janus": "message", "body": { "request": "destroy", "room": room }, "transaction": this.trasnaction }
    this.http.post(url, options).subscribe(ev => {
      console.log(ev);
    }, (error) => console.log("error"))

  }
  getUsingRoom(): number {
    return this.room;
  }
  setRoomByName(name: string) {
    this.room = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
  }
  setRoomById(name: string) {
    this.room = parseInt(name);
  }
  connectToEndPoint() {
    return new Promise((resolve, reject) => {
      this.createSession().subscribe((ev) => {
        this.session = (ev as any).data.id;
        this.attachToPlugin().subscribe((ev1) => {
          this.pluginId = (ev1 as any).data.id;
          resolve("ok");
        }, (error) => reject("error attaching"))
      }, (error) => reject("error creating session"))
    })
  }
  setRoom(roomId: number) {
    this.room = roomId;
  }
  publisherExists(camName: string, cb: any) {
    this.getPublishers().then(ev => {
      let participants: any = (ev as any).plugindata.data.participants;
      let publisher = participants.find((p) => {
        if (p.display === camName) return true;
      })
      if (!publisher) {
        cb(false);
        return false;
      }
      else {
        cb(true);
        return true;
      }
    })
  }
  enableRtpForward(camName: string) {
    this.disableRtpForward(camName, (err) => {
      ;
      this.getPublishers().then(ev => {
        let participants: any = (ev as any).plugindata.data.participants;
        let publisher = participants.find((p) => {
          if (p.display === camName) return true;
        })
        if (!publisher) {
          alert("Not publisher found, try reloading the page");
        }
        let publisher_id = publisher.id;
        let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
        let options = {
          "janus": "message", "body": {
            "request": "rtp_forward", "room": this.room, "publisher_id": publisher_id, "host": "18.200.88.210", audio_port: 6000, video_port: 6002
            , "video_pt": 102, "audio_pt": 111, "host_family": "ipv4", "simulcast": true
          },
          "transaction": this.trasnaction
        }
        this.http.post(url, options).subscribe(ev => {
          console.log(ev);
          this.oldvideoId = (ev as any).plugindata.data.rtp_stream.video_stream_id;
          this.oldaudioId = (ev as any).plugindata.data.rtp_stream.audio_stream_id;
          setTimeout(() => {
            this.debugForwarders();
          }, 2000)
        }, (error) => console.log("error"))

      }).catch((e) => {
        console.log("Error get participants", e);
      })
    })
  }
  disableRtpForward(streamId: string, cb: any) {
    this.getPublishers().then(ev => {
      let participants: any = (ev as any).plugindata.data.participants;
      let publisher = participants.find((p) => {
        if (p.display == streamId) return true;
      })
      if (!publisher) return;
      let publisher_id = publisher.id;
      let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
      let options = {
        "janus": "message", "body": {
          "request": "stop_rtp_forward", "room": this.room, "publisher_id": publisher_id, "stream_id":this.oldvideoId
        },
        "transaction": this.trasnaction
      }
      this.http.post(url, options).subscribe(ev => {
        console.log("disable forward", ev);
        let options = {
          "janus": "message", "body": {
            "request": "stop_rtp_forward", "room": this.room, "publisher_id": publisher_id, "stream_id":this.oldaudioId
          },
          "transaction": this.trasnaction
        }
        this.http.post(url, options).subscribe(ev => {
          console.log("disable forward", ev);
          cb();
          setTimeout(() => {
            this.debugForwarders();
          }, 2000)
      }, (error) => { console.log("error"); cb("error"); })

    }, (error) => { console.log("error"); cb("error"); })
  })
  }
  debugForwarders() {
    let url: string = "https://" + environment.janusIp + ":" + 8089 + "/janus/" + this.session + "/" + this.pluginId;
    let options = { "janus": "message", "body": { "request": "listforwarders", "room": this.room }, "transaction": this.trasnaction }
    this.http.post(url, options).subscribe(ev => {
      console.log(ev);
    }, (error) => console.log("error"))

  }

}
