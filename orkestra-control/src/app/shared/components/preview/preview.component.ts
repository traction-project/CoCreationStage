import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgModule, OnInit, Output, Sanitizer, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/shared/services/data.service';


@Component({
  selector: 'preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @Input() rooms: any;
  selectedRoom: number;
  @ViewChild('tabGroup') tabGroup;
  @Input() previewOn: boolean;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() playAllChange: EventEmitter<any> = new EventEmitter<any>();
  muteall:boolean=true;
  playall: boolean =true;
  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private elem: ElementRef) {
    this.dataService = dataService;
    this.selectedRoom = 0;
    window.addEventListener("message", (e) => { if(typeof e.data.id !=="undefined") this.selectDevice(e.data.id)})
    console.log(this.rooms);
  }
  ngOnInit(): void {
    console.log(this.rooms);
      setTimeout(() => {
        document.querySelectorAll('.mat-tab-label-content').forEach((t)=>{
          t.setAttribute('style','color:white');
        });
      },200);
    setTimeout(() => {
      this.tabChanged({});
   }, 600);

  }
  checkRooms() {

    return true;
  }
  hideIt(name: string) {
    if (name === this.dataService.activeRoom) return false;
    else return true;

  }
  tabChanged(event: any) {
    if (event.tab) {
      document.querySelectorAll('.mat-tab-label-content').forEach((t)=>{
        t.setAttribute('style','color:white');
      })
      this.selectedRoom = event.index;
      this.dataService.setActiveRoom(event.tab.textLabel)
      this.elem.nativeElement.querySelectorAll('iframe').forEach(x => {
        x.className = "flexDevices";
      });
      let _name: string = this.dataService.getSelectedDevice();
      let id = event.tab.textLabel + "_"+_name;
      setTimeout(() => this.elem.nativeElement.querySelector("[id='"+id+"']").className = "flexDevices selected", 300);
    }
    else {
      this.dataService.setActiveRoom(this.dataService.getActiveShow().rooms[0].name);
      this.elem.nativeElement.querySelectorAll('iframe').forEach(x => {
        x.className = "flexDevices";
      });
      let _name: string = this.dataService.getSelectedDevice();
      let id = this.dataService.getActiveShow().rooms[0].name + "_"+_name;
      setTimeout(() => this.elem.nativeElement.querySelector("[id='"+id+"']").className = "flexDevices selected", 300);
    }

  }
  selectDevice(name: string) {
    name = name.split("_")[name.split("_").length-1];
    this.dataService.setSelectedDevice(name);
    this.elem.nativeElement.querySelectorAll('iframe').forEach(x => {
      x.className = "flexDevices";
    });
    let id = this.dataService.getActiveRoom()+"_"+name;
    this.elem.nativeElement.querySelector("#"+this.dataService.activeRoom).querySelector("[id='"+id+"']").className = "flexDevices selected";
  }
  changeLayout(layoutName: string) {
    this.dataService.setLayout(layoutName, this.dataService.getSelectedDevice());
  }
  muteAll(){
    this.muteall = !this.muteall;
    this.change.emit(this.muteall);
  }
  playAll(){
    this.playall = !this.playall;
    this.playAllChange.emit(this.playall);
  }
}
