/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,

} from "@angular/core";
import { DataService } from "../shared/services/data.service";
import { MotionService } from "../shared/services/motion.service";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "../shared/components/popup/modal.component";
import { Show } from "../shared/models/show.class";
import { DBService } from "../shared/services/db.service";
import { ActivatedRoute, Router } from "@angular/router";

const MAX_TIMELINE_CONTENTS = 60;

@Component({
  selector: "timeline",
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.css"],
})
export class TimelineComponent implements OnInit {
  viewFrames: any[] = [];
  objInTimeline: any[] = [];
  objNum: any[] = [];
  //@ViewChild("marker") marker: ElementRef;
  @ViewChild("frameCounter") frameCounter: ElementRef;
  @ViewChild('timelineList') timelineList: ElementRef;
  @ViewChild('layerList') layerList: ElementRef;
  @ViewChild('viewport') viewport: ElementRef;

  public componentContextMenu: boolean = false;
  menuMargins: any = {
      position: "absolute",
      "margin-left": "50px",
      "margin-top": "50px",
  };
  slot: any;
  slotStatus: any;
  componentsStatus: any[] = [];
  dataService: any;
  cameras: any;
  actors: any;
  viewers: any;
  activeDevices: any;
  scrollTop:number=0;
  scrollLeft:number=0;
  rightUp: any;
  rightDown: any;
  leftUp: any;
  leftDown: any;
  changedColor: any[] = [];
  fr: number = 0;
  actualFrame: any = 0;
  activeTimeline: any = "";
  rooms: any[] = [];
  show: string = "";
  multimedia: any[];
  activeShow: Show;
  showCams: any = [];
  possibleLayouts: any = [];
  audios: any = [];
  deviceCam: any = [];
  images: any[];
  transitionColor:string ="black";
  orderList: number[] = new Array(MAX_TIMELINE_CONTENTS)
      .fill(null)
      .map((_, index) => index);
  @HostListener("document:keydown", ["$event"])
  handleKeyboardDown(event: any) {
      if (event.target.id.indexOf("tab") != -1) return;
      if (event.keyCode === 37 && this.actualFrame != 0) {
          this.goto(this.actualFrame - 1);
      }
      if (event.keyCode === 39) {
          this.goto(this.actualFrame + 1);
      }
  }
  @HostListener('mousewheel', ['$event'],) onMouseWheelChrome(event: any) {
    this.mouseScroll(event);
  }

  @HostListener('DOMMouseScroll', ['$event']) onMouseWheelFirefox(event: any) {
    this.mouseScroll(event);
  }

  @HostListener('onmousewheel', ['$event']) onMouseWheelIE(event: any) {
    this.mouseScroll(event);
  }
  mouseScroll(event: any) {
      // old IE support
    var deltaAux = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
    var delta = deltaAux*26;

    if(this.timelineList.nativeElement.style.top==""){
      this.timelineList.nativeElement.style.top = "30px"
    }
    var newscrollval= parseInt(this.timelineList.nativeElement.style.top.split("px")[0])+delta;
    if(newscrollval<=30 && newscrollval >= (30-((this.objInTimeline.length-13+2)*26))){
      this.scrollTop = parseInt(this.timelineList.nativeElement.style.top.split("px")[0])+delta;
      this.timelineList.nativeElement.style.top = this.scrollTop+'px';
      this.layerList.nativeElement.style.top = this.scrollTop+'px';
    }

    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if(event.preventDefault) {
      event.preventDefault();
    }


  }
  constructor(
      dataService: DataService,
      public motionService: MotionService,
      public matDialog: MatDialog,
      private dbService: DBService,
      private route: ActivatedRoute,
      private router: Router,
      public dom: ElementRef,
      private ref: ChangeDetectorRef,
      public dialog: MatDialog
  ) {
      this.ref.detach();
      setInterval(() => {
          this.ref.detectChanges();
      }, 400);
      this.dataService = dataService;
      this.activeShow = this.dataService.getActiveShow();
      this.motionService.init(this.activeShow.name);
      this.viewFrames = Array(this.activeShow.scenes)
          .fill(0)
          .map((x, i) => i + x);
      this.objInTimeline = Array.from(Array(MAX_TIMELINE_CONTENTS).keys());
      this.objNum = Array.from(Array(MAX_TIMELINE_CONTENTS).keys());
      this.possibleLayouts = ["Divided", "Mosaic"];
      var allRooms = [];

      this.rooms.forEach((r) => {
          var allDev = [];
          r.devices.forEach((d) => {
              var device: any = {};
              if ("cam" in d)
                  device = {
                      cam: { name: d.cam.name },
                      id: d.name,
                      components: [],
                      layouts: Array(this.activeShow.scenes).fill("Divided"),
                      transitions: Array(this.activeShow.scenes).fill("false"),
                  };
              else
                  device = {
                      id: d.name,
                      components: [],
                      layouts: Array(this.activeShow.scenes).fill("Divided"),
                      transitions: Array(this.activeShow.scenes).fill("false"),
                  };
              var allComps = [];
              this.objInTimeline.forEach((o) => {
                  //color'#'+Math.floor(Math.random()*16777215).toString(16)
                  var component = {
                      id: o,
                      intervals: [],
                      slots: Array(this.viewFrames.length).fill(0),
                      source: "",
                      color: "rgb(164, 224, 41)",
                      muted: "false",
                      mutedScenes: Array(this.activeShow.scenes).fill("true"),
                      loopVideo: Array(this.activeShow.scenes).fill("false"),
                      order: Array(this.activeShow.scenes).fill(0),
                  };
                  allComps.push(component);
              });
              device.components = allComps;
              allDev[d.name] = device;
          });
          this.componentsStatus[r.name] = allDev;
      });
      this.componentsStatus["nosignalimg"] = "";
      this.dataService.showObservable.subscribe((e) => {
          if (e.type == "device") {
              this.activeTimeline = decodeURI(e.data.name);
              setTimeout(() => {
                  this.sendTimeline();
              }, 2500);
          } else if (e.type == "room") {
              this.getDevicesInRoom();
              if (this.activeDevices) {
                  this.activeTimeline = decodeURI(this.activeDevices[0].name);
                  const timeline =
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ] || null;
                  if (timeline && timeline.components) {
                      this.updateTimelineList(timeline.components.length);
                  }
                  setTimeout(() => {
                      this.sendTimeline();
                  }, 2500);
              }
          }
      });
      /* Loaded from path /ui without template just for testing */
      if (typeof this.activeShow === "undefined") {
          this.loadFromDataBase();
      } else {
          /* Loaded from template */
          this.multimedia = this.activeShow.multimedia;
          this.dataService.activeRoom = this.activeShow.rooms[0].name;
          this.getDevicesInRoom();
          this.activeTimeline = decodeURI(this.activeDevices[0].name);
          this.activeShow.rooms.map((x, i) => {
              this.componentsStatus[x.name] = x;
              x.devices.forEach((d) => {
                  if (typeof d.layouts === "undefined")
                      d.layouts = Array(this.activeShow.scenes).fill(
                          "Divided"
                      );
                  if (typeof d.transitions === "undefined")
                  d.transitions = Array(this.activeShow.scenes).fill(
                      "false"
                  );
                  if (typeof d.components === "undefined") {
                      let allComps = [];
                      this.objInTimeline.forEach((o) => {
                          var component = {
                              id: o,
                              intervals: [],
                              slots: Array(this.viewFrames.length).fill(0),
                              source: "",
                              color: "rgb(164, 224, 41)",
                              muted: "false",
                              mutedScenes: Array(this.activeShow.scenes).fill(
                                  "true"
                              ),
                              loopVideo: Array(this.activeShow.scenes).fill("false"),
                              order: Array(this.activeShow.scenes).fill(0),
                          };
                          allComps.push(component);
                      });
                      d.components = allComps;
                  }
                  this.componentsStatus[x.name][d.name] = d;
              });
          });
          this.componentsStatus["nosignalimg"] = this.activeShow.nosignalimg;
          this.multimedia = this.activeShow.multimedia;
          this.images = this.multimedia.filter((img) => {
              if (
                  img.url.toLowerCase().indexOf(".png") != -1 ||
                  img.url.toLowerCase().indexOf(".jpg") != -1 ||
                  img.url.toLowerCase().indexOf(".gif") != -1
              )
                  return true;
              return false;
          });
          setTimeout(() => {
              this.sendTimeline();
              this.dataService.setLayout(
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].layouts,
                  this.dataService.getSelectedDeviceId()
              );
          }, 6000);
          this.activeShow.rooms.forEach((r) => {
              r.cams.forEach((dv) => {
                  this.showCams.push(dv);
              });
              r.devices.forEach((d) => {
                  if ("cam" in d) this.deviceCam.push(d.cam);
              });
              r.audios.forEach((dv) => {
                  this.audios.push(dv);
              });
          });
      }
      this.dataService.camObservable.subscribe((q) => {
          this.cameras = q;
      });
      this.dataService.actObservable.subscribe((q) => {
          this.actors = q;
      });

      this.motionService.motionObservable.subscribe((t) => {
          this.frameCounter.nativeElement.innerHTML =
              "Scene " + Math.round(t);
          //this.marker.nativeElement.style.left = t * 100 + "px";
          this.actualFrame = t;
          this.fr = this.actualFrame;
      });
      let app = this.dataService.getAppInstance();

      app.data("mute", mute, []);

      // update num layers
      const activeRoom = this.componentsStatus[this.dataService.activeRoom];
      const device = activeRoom[this.activeTimeline];
      const numLayers = device.components.length;

      this.updateTimelineList(numLayers);
  }

  addLayer() {
      this.addComponent();
  }

  updateTimelineList(numLayers: number): void {
      this.objNum = Array.from(Array(numLayers).keys());
      this.objInTimeline = Array.from(Array(numLayers).keys());
      this.orderList = Array.from(Array(numLayers).keys());
  }

  ngOnInit() {
      let onlyView = this.route.snapshot.paramMap.get("onlyView") || false;
      onlyView = onlyView === "true";
      if (onlyView === true)
          this.dom.nativeElement.querySelector(".app-ve-frame-editor").style[
              "pointer-events"
          ] = "none";
      //this.componentsStatus[this.activeTimeline]=allComps;
      //this.activeTimeline='all';
  }
  nextFrame() {
      this.goto(this.actualFrame + 1);
  }
  prevFrame() {
      this.goto(this.actualFrame - 1);
  }
  IsTimelineDataLoaded(componentsStatus: any) {
      let exists = false;
      componentsStatus.forEach((r) => {
          r.devices.forEach((d) => {
              if ("components" in d && d["components"].length > 0)
                  exists = true;
          });
      });
      return exists;
  }
  loadFromDataBase() {
      this.dbService.getShows().subscribe((e) => {
          let data: any = e;
          let tnp: any[] = [];
          data.forEach((x) => {
              let _x = JSON.parse(x.show);
              tnp.push(_x);
          });
          this.dataService.setShows(tnp);
          let showName: string = localStorage.getItem("show");

          this.dataService.setActiveShow(showName);
          this.activeShow = this.dataService.getActiveShow();
          /* is componentsStatus exist on saved DB */
          if (this.IsTimelineDataLoaded(this.componentsStatus)) {
              this.activeShow.rooms[0].devices.forEach((v) => {
                  var allComps = [];
                  this.objInTimeline.forEach((o) => {
                      var component = {
                          id: o,
                          intervals: [],
                          slots: Array(this.viewFrames.length).fill(0),
                          source: "",
                          color:
                              "#" +
                              Math.floor(Math.random() * 16777215).toString(
                                  16
                              ),
                          muted: "false",
                          mutedScenes: Array(this.activeShow.scenes).fill(
                              "true"
                          ),
                          loopVideo: Array(this.activeShow.scenes).fill("false"),
                          order: Array(this.activeShow.scenes).fill(0),
                      };
                      allComps.push(component);
                  });
                  if (
                      typeof this.componentsStatus[
                          this.dataService.activeRoom
                      ] === "undefined"
                  )
                      this.componentsStatus[this.dataService.activeRoom] =
                          this.activeShow.rooms[0];
                  this.componentsStatus[this.dataService.activeRoom][v.name] =
                      allComps;
                  this.activeTimeline = decodeURI(v.name);
                  var deselect: any = document.querySelectorAll(
                      ".app-ve-frame-editor-header-item"
                  );
                  for (var i = 0; i < deselect.length; i++) {
                      deselect[i].style.backgroundColor = "#555";
                  }

                  return v;
              });
              this.activeDevices = this.activeShow.rooms[0].devices;
              this.rooms = this.activeShow.rooms;
              this.rooms.forEach((r) => {
                  var allDev = [];
                  r.devices.forEach((d) => {
                      var device = {
                          id: d.name,
                          components: [],
                          layouts: Array(this.activeShow.scenes).fill(
                              "Divided"
                          ),
                          transitions:Array(this.activeShow.scenes).fill(
                              "false"
                          ),
                      };
                      var allComps = [];
                      this.objInTimeline.forEach((o) => {
                          var component = {
                              id: o,
                              intervals: [],
                              slots: Array(this.viewFrames.length).fill(0),
                              source: "",
                              color:
                                  "#" +
                                  Math.floor(
                                      Math.random() * 16777215
                                  ).toString(16),
                              muted: "false",
                              mutedScenes: Array(this.activeShow.scenes).fill(
                                  "true"
                              ),
                              loopVideo: Array(this.activeShow.scenes).fill("false"),
                              order: Array(this.activeShow.scenes).fill(0),
                          };
                          allComps.push(component);
                      });
                      device.components = allComps;
                      allDev[d.name] = device;
                  });
                  this.componentsStatus[r.name] = allDev;
              });
              this.componentsStatus["nosignalimg"] =
                  this.activeShow.nosignalimg;
          } else {
              this.dataService.activeRoom = this.activeShow.rooms[0].name;
              this.getDevicesInRoom();
              this.activeTimeline = decodeURI(this.activeDevices[0].name);
              this.activeShow.rooms.map((x, i) => {
                  this.componentsStatus[x.name] = x;
                  x.devices.forEach((d) => {
                      if (typeof d.layouts === "undefined")
                          d.layouts = Array(this.activeShow.scenes).fill(
                              "Divided"
                          );
                      if (typeof d.transitions === "undefined")
                          d.transitions = Array(this.activeShow.scenes).fill(
                              "false"
                          );
                      if (typeof d.components === "undefined") {
                          let allComps = [];
                          this.objInTimeline.forEach((o) => {
                              var component = {
                                  id: o,
                                  intervals: [],
                                  slots: Array(this.viewFrames.length).fill(
                                      0
                                  ),
                                  source: "",
                                  color:
                                      "#" +
                                      Math.floor(
                                          Math.random() * 16777215
                                      ).toString(16),
                                  muted: "false",
                                  mutedScenes: Array(
                                      this.activeShow.scenes
                                  ).fill("true"),
                                  loopVideo: Array(this.activeShow.scenes).fill("false"),
                                  order: Array(this.activeShow.scenes).fill(
                                      0
                                  ),
                              };
                              allComps.push(component);
                          });
                          d.components = allComps;
                      }

                      this.componentsStatus[x.name][d.name] = d;
                  });
              });
              this.componentsStatus["nosignalimg"] = "";
              this.multimedia = this.activeShow.multimedia;
              this.images = this.multimedia.filter((img) => {
                  if (
                      img.url.toLowerCase().indexOf(".png") != -1 ||
                      img.url.toLowerCase().indexOf(".jpg") != -1 ||
                      img.url.toLowerCase().indexOf(".gif") != -1
                  )
                      return true;
                  return false;
              });
              setTimeout(() => {
                  this.dataService.setActiveRoom(
                      this.activeShow.rooms[0].name
                  );
              }, 2400);
          }
          this.multimedia = this.activeShow.multimedia;
          this.images = this.multimedia.filter((img) => {
              if (
                  img.url.toLowerCase().indexOf(".png") != -1 ||
                  img.url.toLowerCase().indexOf(".jpg") != -1 ||
                  img.url.toLowerCase().indexOf(".gif") != -1
              )
                  return true;
              return false;
          });
          this.getDevicesInRoom();
          this.activeTimeline = decodeURI(this.activeDevices[0].name);

          this.dataService.showObservable.subscribe((e) => {
              if (e.type == "device") {
                  this.activeTimeline = decodeURI(e.data.name);
              } else if (e.type == "room") {
                  this.getDevicesInRoom();
                  this.activeTimeline = decodeURI(this.activeDevices[0].name);
              }
          });
          this.activeShow.rooms.forEach((r) => {
              r.cams.forEach((dv) => {
                  this.showCams.push(dv);
              });
              r.devices.forEach((d) => {
                  if ("cam" in d) this.deviceCam.push(d.cam);
              });
              r.audios.forEach((dv) => {
                  this.audios.push(dv);
              });
          });
          setTimeout(() => {
              this.sendTimeline();
              this.dataService.setLayout(
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].layouts,
                  this.dataService.getSelectedDevice()
              );
          }, 2000);
      });
  }
  getDevicesInRoom() {
      if (this.activeShow != undefined) {
          this.activeDevices = this.activeShow.rooms.filter((r) => {
              return r.name == this.dataService.activeRoom;
          })[0].devices;
      }
  }
  deleteScene(n: any) {
      event.stopPropagation();
      let app = this.dataService.getAppInstance();
      let ans = confirm("Are you sure you want to remove this scene ?");
      if (ans === true) {
          this.activeShow.rooms.forEach((r) => {
              r.devices.forEach((d) => {
                  this.componentsStatus[r.name][d.name].layouts.splice(n, 1);
                  this.componentsStatus[r.name][d.name].transitions.splice(n, 1);
                  app.setAppAttribute("transitions_"+r.name+"_"+d.name,this.componentsStatus[r.name][d.name].transitions);
                  this.componentsStatus[r.name][d.name].components.forEach(
                      (c) => {
                          c.mutedScenes.splice(n, 1);
                          c.order.splice(n, 1);
                          c.slots.splice(n, 1);
                          c.loopVideo.splice(n, 1);
                      }
                  );
                  //this.dataService.setLayout(this.componentsStatus[r.name][d.name].layouts,r.name + '_' + d.name);
              });
          });
          this.activeShow.scenes = this.activeShow.scenes - 1;
          this.viewFrames = Array(this.activeShow.scenes)
              .fill(0)
              .map((x, i) => i + x);

          this.dataService.saveTimeline(this.componentsStatus);
          this.sendAllTimelines();
      }
  }
  addSceneRight(n: any) {
      event.stopPropagation();
      let app = this.dataService.getAppInstance();
      this.activeShow.rooms.forEach((r) => {
          r.devices.forEach((d) => {
              this.componentsStatus[r.name][d.name].layouts.splice(
                  n + 1,
                  0,
                  "Divided"
              );
              this.componentsStatus[r.name][d.name].transitions.splice(
                  n + 1,
                  0,
                  "false"
              );
              app.setAppAttribute("transitions_"+r.name+"_"+d.name,this.componentsStatus[r.name][d.name].transitions);
              this.componentsStatus[r.name][d.name].components.forEach(
                  (c) => {
                      c.mutedScenes.splice(n + 1, 0, "true");
                      c.slots.splice(n + 1, 0, 0);
                      c.order.splice(n + 1, 0, 0);
                      c.loopVideo.splice(n + 1, 0, "false");
                  }
              );
              //this.dataService.setLayout(this.componentsStatus[r.name][d.name].layouts,r.name + '_' + d.name);
          });
      });
      this.activeShow.scenes = this.activeShow.scenes + 1;
      this.viewFrames = Array(this.activeShow.scenes)
          .fill(0)
          .map((x, i) => i + x);

      this.dataService.saveTimeline(this.componentsStatus);
      this.sendAllTimelines();
  }
  sendAllTimelines() {
      let app = this.dataService.getAppInstance();
      this.activeShow.rooms.forEach((r) => {
          r.devices.forEach((d) => {
              let activeDeviceName: string = r.name + "_" + d.name;
              app.setAppAttribute("timeline_" + activeDeviceName, {
                  applyTo: activeDeviceName,
                  componentStatus:
                      this.componentsStatus[r.name][d.name].components,
              });
          });
      });
      console.log("componentsStatus", this.componentsStatus);
  }
  openTransitionModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
        optin_mode: "transition",
        sub_mode: "",
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
    modalDialog.afterClosed().subscribe((data) => {
        console.log(data);
        if (!data) return;
        if (data.type == "transition") {
            this.dataService.setTransitionConfig(data.data, "all");
        }
    });
}
openCopyComponents() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "550px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
        optin_mode: "copyComponents",
        sub_mode: "",
    };
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
    modalDialog.afterClosed().subscribe((data) => {
        console.log(data);
        if (!data) return;
        if (data.type == "copyComponents") {
            let activeDevice:string = this.dataService.getActiveRoom()+ "_" +this.activeTimeline
            this.dataService.copyComponents(activeDevice,data.data.to,this.componentsStatus);
            this.sendAllTimelines();
        }
    });
}
  mute(n: any, ag: any) {
      let app = this.dataService.getAppInstance();
      app.updateUserData(ag, "mute", { type: "mute", compid: n });
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components.filter((o) => {
          return o.id == n;
      })[0].muted = "true";
  }
  unmute(n: any, ag: any) {
      let app = this.dataService.getAppInstance();
      app.updateUserData(ag, "mute", { type: "unmute", compid: n });
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components.filter((o) => {
          return o.id == n;
      })[0].muted = "false";
  }
  muteScene(c: number, n: number, ag: any) {
      event.stopPropagation();
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components[c].mutedScenes[n] = "true";
      this.dataService.saveTimeline(this.componentsStatus);
      this.sendTimeline();
  }
  unmuteScene(c: number, n: number, ag: any) {
      event.stopPropagation();
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components[c].mutedScenes[n] = "false";
      this.dataService.saveTimeline(this.componentsStatus);
      this.sendTimeline();
  }
  activateLoop(c: number, n: number, ag: any){
    event.stopPropagation();
    this.componentsStatus[this.dataService.activeRoom][
        this.activeTimeline
    ].components[c].loopVideo[n] = "true";
    this.dataService.saveTimeline(this.componentsStatus);
    this.sendTimeline();
  }
  deactivateLoop(c: number, n: number, ag: any){
    event.stopPropagation();
    this.componentsStatus[this.dataService.activeRoom][
        this.activeTimeline
    ].components[c].loopVideo[n] = "false";
    this.dataService.saveTimeline(this.componentsStatus);
    this.sendTimeline();
  }
  play() {
      if (this.paused()) this.motionService.play();
      else this.motionService.pause();
  }
  paused(): boolean {
      return this.motionService.paused();
  }
  reset() {
      this.motionService.pause();
      this.motionService.reset();
  }

  seek(fr: any) {
      this.motionService.seek(fr);
  }
  addTransition(fr:any){
    let app = this.dataService.getAppInstance();
    event.stopPropagation();
    if(this.componentsStatus[this.dataService.activeRoom][
        this.activeTimeline
    ].transitions[fr]=="false"){
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].transitions[fr]="true";
    }
    else{
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].transitions[fr]="false";
    }
    app.setAppAttribute("transitions_"+this.dataService.activeRoom+"_"+this.activeTimeline,this.componentsStatus[this.dataService.activeRoom][
        this.activeTimeline
    ].transitions);
    this.dataService.saveTimeline(this.componentsStatus);

  }
  changeLayout(sc: any) {
      event.stopPropagation();
      var l = this.possibleLayouts.indexOf(
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].layouts[sc]
      );
      if (l == this.possibleLayouts.length - 1) {
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].layouts[sc] = this.possibleLayouts[0];
      } else {
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].layouts[sc] = this.possibleLayouts[l + 1];
      }
      this.dataService.setLayout(
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].layouts,
          this.dataService.getSelectedDeviceId()
      );
      this.dataService.saveTimeline(this.componentsStatus);
  }
  openComponentContextMenu(e) {
      event.preventDefault();
      console.log("ctx menu");
      this.slot = e.srcElement.id;
      var comp = this.componentsStatus
          .map((obj) => {
              return obj.id;
          })
          .indexOf(parseInt(this.slot.split("_")[1]));

      if (this.componentsStatus[comp].slots[this.slot.split("_")[2]] == 1) {
          this.slotStatus = true;
      } else {
          this.slotStatus = false;
      }

      var menuLeft = 300;
      this.menuMargins = {
          position: "absolute",
          "margin-left": menuLeft + "px",
          "margin-top": 100 + "px",
      };

      this.componentContextMenu = true;
      var scope = this;

      /*var clickListener = function(ev:any){
  scope.componentContextMenu = false;
};
document.removeEventListener('click',clickListener);
document.addEventListener('click',clickListener);*/
  }
  changeActiveTimeline(event, val: any) {
      this.activeTimeline = decodeURI(val);
      /*var deselect:any=document.querySelectorAll('.app-ve-frame-editor-header-item');
  for(var i=0;i<deselect.length;i++){
    deselect[i].style.backgroundColor='#555';
  }
  event.srcElement.style.backgroundColor='#353535';*/
  }
  addComponent() {
      const index = this.objInTimeline[this.objInTimeline.length - 1] + 1;

      this.objNum.push(index);
      this.objInTimeline.push(index);

      for(var i=0;i<this.activeShow.rooms.length;i++){
        this.componentsStatus[this.activeShow.rooms[i].name]

        for(var j=0;j<this.componentsStatus[this.activeShow.rooms[i].name].devices.length;j++){
          this.componentsStatus[this.activeShow.rooms[i].name][this.componentsStatus[this.activeShow.rooms[i].name].devices[j].name].components.push({
              id: index,
              intervals: [],
              slots: Array(this.viewFrames.length).fill(0),
              source: "",
              color: "rgb(164, 224, 41)",
              muted: "false",
              mutedScenes: Array(this.activeShow.scenes).fill("true"),
              loopVideo: Array(this.activeShow.scenes).fill("false"),
              order: Array(this.activeShow.scenes).fill(0),
          });
        }


      }

      // order list
      this.orderList = new Array(index + 1)
          .fill(null)
          .map((_, index) => index);



      this.dataService.saveTimeline(this.componentsStatus);
      this.sendTimeline();
  }
  removeComponent(n) {
      this.objNum.splice(this.objNum.indexOf(n), 1);
      var comp = this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components
          .map((obj) => {
              return obj.id;
          })
          .indexOf(parseInt(n));

      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].splice(comp, 1);
      this.objInTimeline.splice(this.objInTimeline.indexOf(n), 1);
      console.log(this.componentsStatus);

      this.orderList = new Array(this.objNum.length)
          .fill(null)
          .map((_, index) => index);
  }
  statusChanged(e, n) {
      console.log(e);
      if (e.target.nodeName != "SELECT"){
          //if (this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components)
          //this.componentsStatus[this.dataService.activeRoom][this.activeTimeline] = this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components;
          if (this.rightDown == undefined ||this.rightDown == "" || this.leftDown == "" || this.leftDown != undefined){
              var comp = this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
                  .map((obj) => {
                      return obj.id;
                  })
                  .indexOf(parseInt(e.currentTarget.id.split("_")[1]));

              if (
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[comp].slots[
                      e.currentTarget.id.split("_")[2]
                  ] == 0
              ){
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[comp].slots[
                      parseInt(e.currentTarget.id.split("_")[2])
                  ] = 1;
                  if (
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].order[n] === 0
                  ) {
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].order[n] = n;
                  }
                  if (
                      (this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].source.split("_")[0] == "cam" ||
                          this.componentsStatus[this.dataService.activeRoom][
                              this.activeTimeline
                          ].components[comp].source.split("_")[0] == "aud" ||
                          this.componentsStatus[this.dataService.activeRoom][
                              this.activeTimeline
                          ].components[comp].source.split("_")[0] == "dac") &&
                      this.fr == parseInt(e.currentTarget.id.split("_")[2])
                  ) {
                      let app = this.dataService.getAppInstance();
                      var srcCam =
                          this.componentsStatus[this.dataService.activeRoom][
                              this.activeTimeline
                          ].components[comp].source.substr(4);
                      var auxAttr = app.getAppAttribute("onair_" + srcCam);
                      if (auxAttr != undefined) {
                          auxAttr.push(
                              this.dataService.activeRoom +
                                  "_" +
                                  this.activeTimeline
                          );
                      } else {
                          auxAttr = [
                              this.dataService.activeRoom +
                                  "_" +
                                  this.activeTimeline,
                          ];
                      }
                      app.setAppAttribute("onair_" + srcCam, auxAttr);
                  }
              } else if (
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[comp].slots[
                      e.currentTarget.id.split("_")[2]
                  ] == 1
              ) {
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[comp].slots[
                      parseInt(e.currentTarget.id.split("_")[2])
                  ] = 0;
                  if (
                      (this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].source.split("_")[0] == "cam" ||
                          this.componentsStatus[this.dataService.activeRoom][
                              this.activeTimeline
                          ].components[comp].source.split("_")[0] == "aud" ||
                          this.componentsStatus[this.dataService.activeRoom][
                              this.activeTimeline
                          ].components[comp].source.split("_")[0] == "dac") &&
                      this.fr == parseInt(e.currentTarget.id.split("_")[2])
                  ) {
                      let app = this.dataService.getAppInstance();
                      var srcCam =
                          this.componentsStatus[this.dataService.activeRoom][
                              this.activeTimeline
                          ].components[comp].source.substr(4);
                      var auxAttr = app.getAppAttribute("onair_" + srcCam);
                      auxAttr.splice(
                          auxAttr.indexOf(
                              this.dataService.activeRoom +
                                  "_" +
                                  this.activeTimeline
                          ),
                          1
                      );
                      app.setAppAttribute("onair_" + srcCam, auxAttr);
                  }
              }
              /*if(this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.length==0){
        var interval={init:parseInt(e.currentTarget.id.split('_')[2]), end:parseInt(e.currentTarget.id.split('_')[2])}
        this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.push(interval);
      }
      else{
        var change1=false;
        var change2=false;
        var int1=0;
        var int2=0;
        this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.forEach((i,j)=>{
          if(parseInt(e.currentTarget.id.split('_')[2])==i.init-1){
            i.init=parseInt(e.currentTarget.id.split('_')[2]);
            change1=true;
            int1=j;
          }
          else if(parseInt(e.currentTarget.id.split('_')[2])==i.end+1){
            i.end=parseInt(e.currentTarget.id.split('_')[2]);
            change2=true;
            int2=j;
          }

        });
        if(change1 && change2){
          this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals[int2].end=this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals[int1].end;
          this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.splice(int1,1);
        }
        if(!change1 && !change2){

          var interval={init:parseInt(e.currentTarget.id.split('_')[2]), end:parseInt(e.currentTarget.id.split('_')[2])}
          this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.push(interval);
        }

      }*/

              /*else{
        this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].slots[parseInt(e.currentTarget.id.split('_')[2])]=0;
        this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.forEach((i,j)=>{
          if(i.init==parseInt(e.currentTarget.id.split('_')[2]) && i.init==i.end){
            this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].intervals.splice(j,1);
          }
          if(i.init==parseInt(e.currentTarget.id.split('_')[2])){
            i.init=i.init+1;
          }

          else if(i.end==parseInt(e.currentTarget.id.split('_')[2])){
            i.end=i.end-1;
          }
          else if(parseInt(e.currentTarget.id.split('_')[2])>i.init && parseInt(e.currentTarget.id.split('_')[2])<i.end){
            var interval={init:parseInt(e.currentTarget.id.split('_')[2])+1, end:i.end};
            this.componentsStatus[this.activeTimeline][comp].intervals.push(interval);
            i.end=parseInt(e.currentTarget.id.split('_')[2])-1;
          }
        });
      }*/
              //this.componentContextMenu=false;
              console.log(this.componentsStatus);
          }
          this.dataService.saveTimeline(this.componentsStatus);
          this.sendTimeline();
      }
  }
  sourceChanged(event) {
      console.log(event.srcElement);
      //if (this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components)
      //this.componentsStatus[this.dataService.activeRoom][this.activeTimeline] = this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components;
      var comp = this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components
          .map((obj) => {
              return obj.id;
          })
          .indexOf(parseInt(event.srcElement.id.split("_")[1]));

      var prev =
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].components[comp].source;
      this.componentsStatus[this.dataService.activeRoom][
          this.activeTimeline
      ].components[comp].source = event.srcElement.value;

      if (
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].components[comp].slots[this.fr] == 1
      ) {
          if (
              prev.indexOf("cam_") > -1 ||
              prev.indexOf("aud_") > -1 ||
              prev.indexOf("dac_") > -1
          ) {
              let app = this.dataService.getAppInstance();
              var auxAttr = app.getAppAttribute("onair_" + prev.substr(4));
              if (auxAttr == undefined) {
                  auxAttr = [];
              }
              if (
                  auxAttr.indexOf(
                      this.dataService.activeRoom + "_" + this.activeTimeline
                  ) > -1
              ) {
                  auxAttr.splice(
                      auxAttr.indexOf(
                          this.dataService.activeRoom +
                              "_" +
                              this.activeTimeline
                      ),
                      1
                  );
                  app.setAppAttribute("onair_" + prev.substr(4), auxAttr);
              }
          }
          if (
              event.srcElement.value.indexOf("cam_") > -1 ||
              event.srcElement.value.indexOf("aud_") > -1 ||
              event.srcElement.value.indexOf("dac_") > -1
          ) {
              let app = this.dataService.getAppInstance();

              if (event.srcElement.value.indexOf("cam_") > -1) {
                  var srcName = event.srcElement.value.split("cam_")[1];
              } else if (event.srcElement.value.indexOf("aud_") > -1) {
                  var srcName = event.srcElement.value.split("aud_")[1];
              } else if (event.srcElement.value.indexOf("dac_") > -1) {
                  var srcName = event.srcElement.value.split("dac_")[1];
              }

              var auxAttr = app.getAppAttribute("onair_" + srcName);
              if (auxAttr != undefined) {
                  auxAttr.push(
                      this.dataService.activeRoom + "_" + this.activeTimeline
                  );
              } else {
                  auxAttr = [
                      this.dataService.activeRoom + "_" + this.activeTimeline,
                  ];
              }
              app.setAppAttribute("onair_" + srcName, auxAttr);
          }
      }
      if (event.srcElement.value.indexOf("cam") > -1) {
          var s = this.showCams
              .map((obj) => {
                  return obj.number;
              })
              .indexOf(event.srcElement.value.split("_")[1]);
          //this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].color="#232355";
      } else if (event.srcElement.value.indexOf("act") > -1) {
          var s = this.actors
              .map((obj) => {
                  return obj.number;
              })
              .indexOf(event.srcElement.value.split("_")[1]);
          //this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].color=this.actors[s].color;
      }
      // else if(event.srcElement.value.indexOf('view')>-1){
      //   var s:any=this.activeShow.multimedia.map((obj)=>{
      //     return obj.name;
      //   }).indexOf(event.srcElement.value.split('_')[1]);
      //   this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].components[comp].color="#232355";
      // }
      this.dataService.saveTimeline(this.componentsStatus);
      setTimeout(() => {
          this.sendTimeline();
      }, 2000);
  }
  changeNoSignalMedia(event) {
      this.componentsStatus["nosignalimg"] = event.srcElement.value;
      this.dataService.saveTimeline(this.componentsStatus);

      setTimeout(() => {
          let app = this.dataService.getAppInstance();
          app.setAppAttribute(
              "nosignalimg",
              this.componentsStatus["nosignalimg"]
          );
      }, 2000);
  }
  checkNoSignal(val) {
      if (val == this.componentsStatus["nosignalimg"]) {
          return true;
      } else {
          return false;
      }
  }
  rightSpreadInit(event) {
      event.preventDefault();
      this.rightDown = event.currentTarget.id;
      console.log(this.rightDown);
  }
  spreadEnd(event) {
      if (this.rightDown != "" && this.rightDown != undefined) {
          this.rightUp = event.currentTarget.id;
          if (this.rightUp.split("_")[1] != this.rightDown.split("_")[1]) {
              this.rightUp = "";
              this.rightDown = "";
          } else {
              var comp = this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
                  .map((obj) => {
                      return obj.id;
                  })
                  .indexOf(parseInt(this.rightUp.split("_")[1]));

              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[comp].intervals.forEach((i, j) => {
                  if (i.end == parseInt(this.rightDown.split("_")[2])) {
                      i.end = parseInt(this.rightUp.split("_")[2]);
                  }
              });
              if (
                  parseInt(this.rightUp.split("_")[2]) >
                  parseInt(this.rightDown.split("_")[2])
              ) {
                  for (
                      var i = parseInt(this.rightDown.split("_")[2]) + 1;
                      i <= parseInt(this.rightUp.split("_")[2]);
                      i++
                  ) {
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].slots[i] = 1;
                  }
              } else if (
                  parseInt(this.rightUp.split("_")[2]) <
                  parseInt(this.rightDown.split("_")[2])
              ) {
                  for (
                      var i = parseInt(this.rightDown.split("_")[2]);
                      i > parseInt(this.rightUp.split("_")[2]);
                      i--
                  ) {
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].slots[i] = 0;
                  }
              }
          }
      }
      if (this.leftDown != "" && this.leftDown != undefined) {
          this.leftUp = event.currentTarget.id;
          console.log(this.leftUp);
          if (this.leftUp.split("_")[1] != this.leftDown.split("_")[1]) {
              this.leftUp = "";
              this.leftDown = "";
          } else {
              var comp = this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
                  .map((obj) => {
                      return obj.id;
                  })
                  .indexOf(parseInt(this.leftUp.split("_")[1]));
              this.componentsStatus[this.activeTimeline].components[
                  comp
              ].intervals.forEach((i, j) => {
                  if (i.init == parseInt(this.leftDown.split("_")[2])) {
                      i.init = parseInt(this.leftUp.split("_")[2]);
                  }
              });
              if (
                  parseInt(this.leftUp.split("_")[2]) <
                  parseInt(this.leftDown.split("_")[2])
              ) {
                  for (
                      var i = parseInt(this.leftUp.split("_")[2]);
                      i < parseInt(this.leftDown.split("_")[2]);
                      i++
                  ) {
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].slots[i] = 1;
                  }
              } else if (
                  parseInt(this.leftUp.split("_")[2]) >
                  parseInt(this.leftDown.split("_")[2])
              ) {
                  for (
                      var i = parseInt(this.leftDown.split("_")[2]);
                      i < parseInt(this.leftUp.split("_")[2]);
                      i++
                  ) {
                      this.componentsStatus[this.dataService.activeRoom][
                          this.activeTimeline
                      ].components[comp].slots[i] = 0;
                  }
              }
          }
      }
      this.leftDown = "";
      this.rightDown = "";
      this.leftUp = "";
      this.rightUp = "";
      for (var i = 0; i < this.changedColor.length; i++) {
          if (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[parseInt(this.changedColor[i].split("_")[1])]
                  .slots[parseInt(this.changedColor[i].split("_")[2])] == 1
          ) {
              var aux = document.querySelector(
                  "#" + this.changedColor[i]
              ) as HTMLElement;
              aux.style.backgroundColor =
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[
                      parseInt(this.changedColor[i].split("_")[1])
                  ].color;
          } else {
              if (parseInt(this.changedColor[i].split("_")[2]) % 5 === 0) {
                  var aux = document.querySelector(
                      "#" + this.changedColor[i]
                  ) as HTMLElement;
                  aux.style.backgroundColor = "#2d2d2d";
              } else {
                  var aux = document.querySelector(
                      "#" + this.changedColor[i]
                  ) as HTMLElement;
                  aux.style.backgroundColor = "";
              }
          }
      }
      this.changedColor = [];
  }
  existsMultimedia(): boolean {
      if (this.activeShow && this.activeShow.multimedia) return true;
      return false;
  }
  componentSelectValue(c: any, n: number, type: string): boolean {
      const components =
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].components;

      // console.log({ n, component: components[n] });

      if (
          this.activeTimeline != "" &&
          components.length > 0 &&
          components[n]
      ) {
          if (type == "cam")
              if (components[n].source == "cam_" + c.id) return true;
              else return false;
          else if (type == "DeviceAndCam")
              if (components[n].source == "dac_" + c.name) return true;
              else return false;
          else if (type == "a")
              if (components[n].source == "aud_" + c.id) return true;
              else return false;
          else if (components[n].source == c.url) return true;
          else return false;
      } else return false;
  }
  spreadIf(i: number, n: number): boolean {
      if (
          this.activeTimeline != "" &&
          this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].components.length > 0
      ) {
          if (
              (this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n] == 1 &&
                  n != 0 &&
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[i].slots[n - 1] == 1 &&
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[i].slots[n + 1] == 1) ||
              (this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n] == 1 &&
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[i].slots[n - 1] == 0 &&
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[i].slots[n + 1] == 0)
          )
              return true;
          return false;
      } else return false;
  }
  spreadEndIf(i: number, n: number) {
      if (
          this.activeTimeline != "" &&
          Object.keys(
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
          ).length > 0
      )
          if (n % 5 === 0)
              return (
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[i].slots[n] == 0
              );
          else
              return (
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[i].slots[n] == 0
              );
      return false;
  }
  rightSpreadInitIf(i: number, n: number) {
      if (
          this.activeTimeline != "" &&
          Object.keys(
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
          ).length > 0
      )
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n] == 1 &&
              n != 0 &&
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n + 1] == 0 &&
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n - 1] == 1
          );
      return false;
  }
  leftSpreadInitIf(i: number, n: number) {
      if (
          this.activeTimeline != "" &&
          Object.keys(
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
          ).length > 0
      )
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n] == 1 &&
              n != 0 &&
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n - 1] == 0 &&
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n + 1] == 1
          );
      return false;
  }
  initIf(i: number, n: number) {
      if (
          this.activeTimeline != "" &&
          Object.keys(
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
          ).length > 0
      )
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n] == 1 &&
              (n == 0 || n == this.viewFrames.length - 1)
          );
  }
  checkStatus(i: number, n: number) {
      if (
          this.activeTimeline != "" &&
          Object.keys(
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components
          ).length > 0
      )
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[i].slots[n] == 1
          );
      return false;
  }
  isMuted(n: number, activeTimeline: string) {
      if (activeTimeline != "")
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[n].muted == "true"
          );
      else return false;
  }
  isMutedScene(c: number, n: number, activeTimeline: string) {
      if (activeTimeline != "")
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[c].mutedScenes[n] == "true"
          );
      else return false;
  }
  isLoopVideo(c: number, n: number, activeTimeline: string){
    if (activeTimeline != "")
          return (
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[c].loopVideo[n] == "true"
          );
      else return false;
  }
  isDash(c: number, n: number, activeTimeline: string){
    if (activeTimeline != "") {
        var auxsource =
            this.componentsStatus[this.dataService.activeRoom][
                this.activeTimeline
            ].components[c].source;
        if (auxsource.indexOf(".mpd") > -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
  }
  isNotImg(c: number, n: number, activeTimeline: string) {
      if (activeTimeline != "") {
          var auxsource =
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components[c].source;
          if (
              auxsource.indexOf(".png") > -1 ||
              auxsource.indexOf(".jpg") > -1 ||
              auxsource.indexOf(".gif") > -1 ||
              auxsource.indexOf(".jpeg") > -1
          ) {
              return false;
          } else {
              return true;
          }
      } else {
          return false;
      }
  }
  leftSpreadInit(event) {
      event.preventDefault();
      this.leftDown = event.currentTarget.id;
      console.log(this.leftDown);
  }
  loadIcon(n: number) {
      if (this.activeTimeline != "")
          return (
              "./assets/images/" +
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].layouts[n].toLowerCase() +
              ".png"
          );
      return "./assets/images/";
  }
  loadTransitionsIcon(n:number){
    if (this.activeTimeline != "")
      if(this.componentsStatus[this.dataService.activeRoom][this.activeTimeline].transitions[n]=='true'){
        return (
            "./assets/images/transitions_on.png"
        );
      }else{
        return (
            "./assets/images/transitions_off.png"
        );
      }
    return "./assets/images/";
  }

  changeColorTemp(event) {
      event.stopPropagation();
      if (
          (this.leftDown != "" &&
              this.leftDown != undefined &&
              event.currentTarget.id.split("_")[1] ==
                  this.leftDown.split("_")[1]) ||
          (this.rightDown != "" &&
              this.rightDown != undefined &&
              event.currentTarget.id.split("_")[1] ==
                  this.rightDown.split("_")[1])
      ) {
          var comp = this.componentsStatus[this.dataService.activeRoom][
              this.activeTimeline
          ].components
              .map((obj) => {
                  return obj.id;
              })
              .indexOf(parseInt(event.currentTarget.id.split("_")[1]));
          if (
              event.currentTarget.style.backgroundColor == "" ||
              event.currentTarget.style.backgroundColor == "rgb(45, 45, 45)"
          ) {
              event.currentTarget.style.backgroundColor =
                  this.componentsStatus[this.dataService.activeRoom][
                      this.activeTimeline
                  ].components[comp].color;
          } else {
              if (parseInt(event.currentTarget.id.split("_")[2]) % 5 === 0) {
                  event.currentTarget.style.backgroundColor = "#2d2d2d";
              } else {
                  event.currentTarget.style.backgroundColor = "";
              }
          }
          this.changedColor.push(event.currentTarget.id);
      }
  }
  chooseLayout() {
      console.log("choosing layout");
      this.openLayoutModal();
  }
  checkOnAir(n: any) {
      console.log("checkonair");
      var r = Object.keys(this.componentsStatus);
      var devAdd = [];
      var devRem = [];
      for (var i = 0; i < r.length; i++) {
          if (r[i] != "nosignalimg") {
              this.componentsStatus[r[i]].devices.forEach((d) => {
                  d.components.forEach((c) => {
                      if (
                          c.source.split("_")[0] == "cam" ||
                          c.source.split("_")[0] == "aud" ||
                          c.source.split("_")[0] == "dac"
                      ) {
                          let app = this.dataService.getAppInstance();
                          var auxSrc = c.source.substr(4);
                          var auxAttr = app.getAppAttribute(
                              "onair_" + auxSrc
                          );
                          if (auxAttr == undefined) {
                              auxAttr = [];
                          }
                          if (c.slots[n] == 1) {
                              if (auxAttr != undefined) {
                                  if (auxAttr.indexOf(d.id) == -1) {
                                      if (devAdd[auxSrc] == undefined) {
                                          devAdd[auxSrc] = [d.id];
                                      } else {
                                          devAdd[auxSrc].push(d.id);
                                      }
                                  }
                              } else {
                                  if (devAdd[auxSrc] == undefined) {
                                      devAdd[auxSrc] = [d.id];
                                  } else {
                                      devAdd[auxSrc].push(d.id);
                                  }
                              }
                          } else {
                              if (auxAttr.indexOf(d.id) > -1) {
                                  if (devRem[auxSrc] == undefined) {
                                      devRem[auxSrc] = [d.id];
                                  } else {
                                      devRem[auxSrc].push(d.id);
                                  }
                                  console.log("Borrado", auxAttr);
                              }
                          }
                      }
                  });
              });
          }
      }
      for (var i = 0; i < Object.keys(devAdd).length; i++) {
          let app = this.dataService.getAppInstance();
          var auxAttr = app.getAppAttribute(
              "onair_" + Object.keys(devAdd)[i]
          );
          if (auxAttr == undefined) {
              auxAttr = [];
          }
          devAdd[Object.keys(devAdd)[i]].forEach((el) => {
              auxAttr.push(el);
          });
          if (Object.keys(devRem).indexOf(Object.keys(devAdd)[i]) > -1) {
              devRem[Object.keys(devAdd)[i]].forEach((el) => {
                  auxAttr.splice(auxAttr.indexOf(el), 1);
              });
          }
          console.log(Object.keys(devAdd)[i], auxAttr);
          app.setAppAttribute("onair_" + Object.keys(devAdd)[i], auxAttr);
      }
      for (var i = 0; i < Object.keys(devRem).length; i++) {
          if (Object.keys(devAdd).indexOf(Object.keys(devRem)[i]) == -1) {
              let app = this.dataService.getAppInstance();
              var auxAttr = app.getAppAttribute(
                  "onair_" + Object.keys(devRem)[i]
              );
              devRem[Object.keys(devRem)[i]].forEach((el) => {
                  auxAttr.splice(auxAttr.indexOf(el), 1);
              });
              console.log(Object.keys(devRem)[i], auxAttr);
              app.setAppAttribute("onair_" + Object.keys(devRem)[i], auxAttr);
          }
      }
  }
  changeOrder(event: any, cmp: any, i: number) {
      event.stopPropagation();
      if (cmp.order[i] + 1 >= MAX_TIMELINE_CONTENTS) cmp.order[i] = 0;
      else cmp.order[i] = cmp.order[i] ? cmp.order[i] + 1 : i + 1;
      this.dataService.saveTimeline(this.componentsStatus);
      this.sendTimeline();
  }
  updateOrder(event: any, cmp: any, i: number) {
      cmp.order[i] = event.target.value;
      this.dataService.saveTimeline(this.componentsStatus);
      this.sendTimeline();
  }
  goto(n: any) {
      console.log("go to frame", n);
      this.checkOnAir(n);
      this.fr = n;
      this.seek(n);
  }
  sendTimeline() {
      //this.openSendTimelineModal();
      let app = this.dataService.getAppInstance();
      let activeDeviceName: string =
          this.dataService.getActiveRoom() + "_" + this.activeTimeline;
      app.setAppAttribute("timeline_" + activeDeviceName, {
          applyTo: activeDeviceName,
          componentStatus:
              this.componentsStatus[this.dataService.activeRoom][
                  this.activeTimeline
              ].components,
      });
      console.log("componentsStatus", this.componentsStatus);
  }

  trackActor(index, actor) {
      return actor ? actor.id : undefined;
  }
  trackCameras(index, cam) {
      return cam ? cam.name : undefined;
  }
  trackByViewers(index, vw) {
      return vw ? vw.id : undefined;
  }
  getMultimedia() {
      if (this.activeShow && this.activeShow.multimedia)
          return this.activeShow.multimedia;
      return [];
  }
  openSendTimelineModal() {
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = {
          optin_mode: "timeline_send",
      };
      // https://material.angular.io/components/dialog/overview
      const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
      modalDialog.afterClosed().subscribe((data) => {
          if (data.type == "timeline") {
              let app = this.dataService.getAppInstance();
              app.setAppAttribute("timeline", {
                  applyTo: data.data[0].id,
                  componentStatus: this.componentsStatus[data.data[0].id],
              });
              console.log("componentsStatus", this.componentsStatus);
          }
      });
  }
  openLayoutModal() {
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = {
          optin_mode: "layout",
          sub_mode: "",
      };
      // https://material.angular.io/components/dialog/overview
      const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
      modalDialog.afterClosed().subscribe((data) => {
          if (data.type == "layout") {
              this.dataService.setLayout(data.data, "all");
          }
      });
  }


}
export function mute(mu) {
  let mute = {
      init: function () {
          this.setCapability("mute", "supported");
          this.setItem("mute", mu || "undefined");
      },
      on: function () {
          //this.setIte', {"name":""});
      },
      off: function () {},
  };
  return { mute: mute };

}
