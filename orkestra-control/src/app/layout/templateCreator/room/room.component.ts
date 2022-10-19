/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Orkestra, URI, UserTable, AppTable, KeyPress } from 'orkestraLib';
import { JanusService } from 'src/app/shared/services/janus.service';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Show } from 'src/app/shared/models/show.class';
import { Room } from 'src/app/shared/models/room.class';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'room-component',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {
  orkestra: any;
  users: any;
  appData: any;
  app: any;
  server: any;
  rooms: any = [];
  activeRoom: number = 0;
  @ViewChild('tabGroup') tabGroup;
  activeShow: Show;
  moved: boolean = false;
  changing: boolean = false;

  constructor(private dataService: DataService, public janusService: JanusService, private sanitizer: DomSanitizer, private router: Router, private elem: ElementRef, private translateService: TranslateService) {

    // this.rooms = [{name:"room1",devices:[],cams:[]},{name:"room2",devices:[],cams:[]},{name:"room3",devices:[],cams:[]}];
    this.activeRoom = 0;
    this.activeShow = this.dataService.getActiveShow();
    if (typeof this.activeShow == "undefined") this.router.navigate(["/template"]);
    this.rooms = this.activeShow.rooms;

  }
  ngOnInit() {
    setTimeout(() => {
      this.rooms[this.activeRoom].devices.forEach(d => {
        this.elem.nativeElement.querySelector('#' + d.id).style.transform = this.getPosition(d);
        d.initialPos = d.position;
      })
      this.rooms[this.activeRoom].cams.forEach(d => {
        this.elem.nativeElement.querySelector('#' + d.id).style.transform = this.getPosition(d);
        d.initialPos = d.position;
      })
      this.rooms[this.activeRoom].audios.forEach(d => {
        this.elem.nativeElement.querySelector('#' + d.id).style.transform = this.getPosition(d);
        d.initialPos = d.position;
      })
    }, 400)

  }
  addRoom() {
    this.activeShow.rooms.push(new Room("Room" + this.activeShow.rooms.length));
    this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
    this.rooms = this.activeShow.rooms;

  }
  deleteRoom(name) {
    this.translateService.get('Are you sure').subscribe(msg => {
      let ans = confirm(msg + " ?");
      if (ans == true) {
        var ind = -1;
        this.activeShow.rooms.filter((r, i) => {
          if (r.name == name) {
            ind = i;
          }
        })
        if (ind != -1) {
          if (this.activeShow.rooms.length == 1) {
            this.translateService.get('Show must have at least one room').subscribe(ev => {
              alert(ev);
            })

            return;
          }
          this.activeShow.rooms.splice(ind, 1);
          this.activeRoom = this.activeShow.rooms.length-1;
          this.rooms = this.activeShow.rooms;
          this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);


        }
      }
    });
  }
  addDevice() {
    let len = this.rooms[this.activeRoom].devices.length
    let name = "Device-" + len;
    let roomName: string = this.rooms[this.activeRoom].name;
    this.rooms[this.activeRoom].devices.push({ initialPos: { x: 0, y: 0 }, position: { x: 0, y: 0 }, id: roomName + "_" + name, name: name,type:"device",  url: environment.protocol + "://" + environment.staticServer + "/traction/?agent=" + roomName + "_" + name + "&channel=" + this.activeShow.name + "&locale=" + this.dataService.getLanguage().locale + "&room=" + this.janusService.getUsingRoom() });
    this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
  }
  addCamera() {
    let len = this.rooms[this.activeRoom].cams.length
    let name = "Camera-" + len;
    let roomName: string = this.rooms[this.activeRoom].name;
    this.rooms[this.activeRoom].cams.push({ initialPos: { x: 0, y: 0 }, position: { x: 0, y: 0 }, id: roomName + "_" + name, name: name,type:"camera",  url: environment.protocol + "://" + environment.staticServer + "/camera?camera=" + roomName + "_" + name + "&room=" + this.janusService.getUsingRoom() + "&channel=" + this.activeShow.name });
    this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);

  }
  addAudio() {

    let len = this.rooms[this.activeRoom].audios.length
    let name = "Audio-" + len;
    let roomName: string = this.rooms[this.activeRoom].name;
    this.rooms[this.activeRoom].audios.push({ initialPos: { x: 0, y: 0 }, position: { x: 0, y: 0 }, id: roomName + "_" + name, name: name, type:"audio",  url: environment.protocol + "://" + environment.staticServer + "/audio?audio=" + roomName + "_" + name + "&room=" + this.janusService.getUsingRoom() + "&channel=" + this.activeShow.name });
    this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);

  }
  addDeviceWithCam() {
    let len1 = this.rooms[this.activeRoom].devices.filter((dc => {
      if (typeof dc.cam != "undefined") return true;
      return false;
    })).length;
    let name1 = "DeviceAndCam-" + len1;
    let roomName: string = this.rooms[this.activeRoom].name;
    this.rooms[this.activeRoom].devices.push({ initialPos: { x: 0, y: 0 }, position: { x: 0, y: 0 }, cam: { name: roomName + "_" + name1 }, id: roomName + "_" + name1, name: name1, type:"dev&cam", url: environment.protocol + "://" + environment.staticServer + "/traction/?agent=" + roomName + "_" + name1 + "&channel=" + this.activeShow.name + "&locale=" + this.dataService.getLanguage().locale + "&room=" + this.janusService.getUsingRoom() + "&publish=true" });
    this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
  }
  isCamExists(obj: any) {
    return typeof obj.cam != "undefined";
  }
  changeDeviceName(name: string) {
    this.translateService.get("Change name:").subscribe(e => {
      let _name = prompt(e);
      if (_name != "" && _name.indexOf(' ') == -1 && _name.indexOf('_') == -1) {
        let device = this.findDeviceByName(name);
        device.name = _name;
        device.id = this.rooms[this.activeRoom].name + "_" + _name;
        device.url = environment.protocol + "://" + environment.staticServer + "/traction/?agent=" + device.id + "&channel=" + this.activeShow.name + "&locale=" + this.dataService.getLanguage().locale + "&room=" + this.janusService.getUsingRoom();
        this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
      }
      else
        this.translateService.get("Need name value without space and without special chars").subscribe(ev => { alert(ev); });

    })



  }
  changeDeviceCamName(name: string) {
    this.translateService.get("Change name:").subscribe(e => {
      let _name = prompt(e);
      if (_name != "" && _name.indexOf(' ') == -1 && _name.indexOf('_') == -1) {
        let device = this.findDeviceByName(name);
        device.name = _name;
        device.id = this.rooms[this.activeRoom].name + "_" + _name;
        device.cam.name = device.id;
        device.url = environment.protocol + "://" + environment.staticServer + "/traction/?agent=" + device.id + "&channel=" + this.activeShow.name + "&locale=" + this.dataService.getLanguage().locale + "&room=" + this.janusService.getUsingRoom() + "&publish=true";
        this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
      }
      else
        this.translateService.get("Need name value without space and without special chars").subscribe(ev => { alert(ev); });

    })
  }
  changeCameraName(name: string) {
    this.translateService.get("Change name:").subscribe(e => {
      let _name = prompt(e);
      if (_name != "" && _name.indexOf(' ') == -1 && _name.indexOf('_') == -1) {
        let cam = this.findCameraByName(name);
        cam.name = _name;
        let roomName: string = this.rooms[this.activeRoom].name;
        cam.id = this.rooms[this.activeRoom].name + "_" + _name;
        cam.url = environment.protocol + "://" + environment.staticServer + "/camera?camera=" + roomName + "_" + _name + "&room=" + this.janusService.getUsingRoom() + "&channel=" + this.activeShow.name;
        this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
      }
      else
        this.translateService.get("Need name value without space and without special chars").subscribe(ev => { alert(ev); });

    })
  }
  changeAudioName(name: string) {
    this.translateService.get("Change name:").subscribe(e => {
      let _name = prompt(e);
      if (_name != "" && _name.indexOf(' ') == -1 && _name.indexOf('_') == -1) {
        let aud = this.findAudioByName(name);
        aud.name = _name;
        let roomName: string = this.rooms[this.activeRoom].name;
        aud.id = this.rooms[this.activeRoom].name + "_" + _name;
        aud.url = environment.protocol + "://" + environment.staticServer + "/audio?audio=" + roomName + "_" + _name + "&room=" + this.janusService.getUsingRoom() + "&channel=" + this.activeShow.name;
        this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
      }
      else
        this.translateService.get("Need name value without space and without special chars").subscribe(ev => { alert(ev); });
    })
  }
  findObjectById(id: string) {
    let device = this.rooms[this.activeRoom].devices.find((x) => {
      return x.id == id;
    });
    if (device) return device;
    let cam = this.rooms[this.activeRoom].cams.find((x) => {
      return x.id == id;
    });
    if (cam) return cam;
    let aud = this.rooms[this.activeRoom].audios.find((x) => {
      return x.id == id;
    });
    if (aud) return aud;

  }
  findDeviceByName(name: string) {
    let device = this.rooms[this.activeRoom].devices.find((x) => {
      return x.name == name;
    });
    return device;
  }
  findCameraByName(name: string) {
    let cam = this.rooms[this.activeRoom].cams.find((x) => {
      return x.name == name;
    });
    return cam;
  }
  findAudioByName(name: string) {

    let aud = this.rooms[this.activeRoom].audios.find((x) => {
      return x.name == name;
    });
    return aud;
  }
  findRoomByName(name: string) {

    let room = this.rooms.find((x) => {
      return x.name == name;
    });
    return room;
  }
  deleteObject(type: string, name: string) {
    this.translateService.get("Deleted ").subscribe(e => {
      let result = confirm(e + " " + name + " " + type + "?");
      if (result) {
        if (type === "device") {
          this.rooms[this.activeRoom].devices = this.rooms[this.activeRoom].devices.filter((x) => {
            return x.name !== name;
          })

        }
        else if (type === "cams") {
          this.rooms[this.activeRoom].cams = this.rooms[this.activeRoom].cams.filter((x) => {
            return x.name !== name;
          })
        }
        else if (type === "audios") {
          this.rooms[this.activeRoom].audios = this.rooms[this.activeRoom].audios.filter((x) => {
            return x.name !== name;
          })
        }
        this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);

      }
    })
  }
  tabChanged(event: any) {
    this.activeRoom = this.tabGroup.selectedIndex;
    setTimeout(() => {
      this.rooms[this.activeRoom].devices.forEach(d => {
        this.elem.nativeElement.querySelector('#' + d.id).style.transform = this.getPosition(d);
        d.initialPos = d.position;
      })
      this.rooms[this.activeRoom].cams.forEach(d => {
        this.elem.nativeElement.querySelector('#' + d.id).style.transform = this.getPosition(d);
        d.initialPos = d.position;
      })
      this.rooms[this.activeRoom].audios.forEach(d => {
        this.elem.nativeElement.querySelector('#' + d.id).style.transform = this.getPosition(d);
        d.initialPos = d.position;
      })
    }, 400)

  }
  changeTabName(name: string) {
    this.translateService.get("Change name:").subscribe(e => {

      let _name = prompt(e);
      if (_name != "" && _name.indexOf(' ') == -1 && _name.indexOf('_') == -1) {
        let room = this.findRoomByName(name);
        console.log(room);
        room.name = _name;
        room.devices.forEach((d) => {
          d.id = room.name + "_" + d.name;
          if ("cam" in d) {
            d.cam.name = d.id;
            d.url = environment.protocol + "://" + environment.staticServer + "/traction/?agent=" + d.id + "&channel=" + this.activeShow.name + "&locale=" + this.dataService.getLanguage().locale + "&room=" + this.janusService.getUsingRoom() + "&publish=true";
          }
          else d.url = environment.protocol + "://" + environment.staticServer + "/traction/?agent=" + d.id + "&channel=" + this.activeShow.name + "&locale=" + this.dataService.getLanguage().locale + "&room=" + this.janusService.getUsingRoom();
        })
        room.cams.forEach((c) => {
          c.id = room.name + "_" + c.name;
          c.url = environment.protocol + "://" + environment.staticServer + "/camera?camera=" + room.name + "_" + c.name + "&room=" + this.janusService.getUsingRoom() + "&channel=" + this.activeShow.name;
        })
        room.audios.forEach((a) => {
          a.id = room.name + "_" + a.name;
          a.url = environment.protocol + "://" + environment.staticServer + "/audio?audio=" + room.name + "_" + a.name + "&room=" + this.janusService.getUsingRoom() + "&channel=" + this.activeShow.name;
        })
        this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
      }
      else
        this.translateService.get(" Need name value without space and without special chars").subscribe(ev => { alert(ev); });
    })
  }
  next() {
    // TODO:check whether is no empty
    this.router.navigate(["/", "media"]);
  }
  back() {
    // TODO:check whether is no empty
    this.router.navigate(["/", "template"]);
  }
  consoleData(): any {
    console.log(this.dataService.getShows());
    console.log(this.dataService.getActiveShow());
  }
  dragMoved(evt) {
    // let comp = evt.source.element.nativeElement.id;
    //  let obj = this.findObjectById(comp);
    //  let translate3d = this.getMatrix(evt.source.element.nativeElement);
    //  obj.position.x = translate3d.x;
    //  obj.position.y = translate3d.y;
    //  this.dataService.setShowRooms(this.dataService.getActiveShow().name,this.rooms);
    this.changing = false;
    const transform = evt.source.element.nativeElement.style.transform;
    let offset = evt.source.getFreeDragPosition();
    let comp = evt.source.element.nativeElement.id;
    let obj = this.findObjectById(comp);
    obj.position.x = obj.initialPos.x + offset.x;
    obj.position.y = obj.initialPos.y + offset.y;
    console.log(obj.position.x, offset.x);
    this.dataService.setShowRooms(this.dataService.getActiveShow().name, this.rooms);
    obj.moved = true;
  }
  getPosition(obj: any) {
    return "translate3d(" + obj.position.x + "px," + obj.position.y + "px,0px)";
  }
  dragging(obj: any) {
    this.changing = true;
  }


}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
