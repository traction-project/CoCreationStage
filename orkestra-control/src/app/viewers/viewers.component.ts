import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'viewers',
  templateUrl: './viewers.component.html',
  styleUrls: ['./viewers.component.css']
})
export class ViewersComponent implements OnInit{

  viewersList:any[]=[];
  dataService:any;
  viewersStatus:any[]=[];
  constructor(dataService:DataService) {
    this.dataService=dataService;
    this.dataService.getviewerObservable().subscribe((data)=>{
        this.viewersStatus = data ;
    })
  }
  ngOnInit(){

    this.viewersList=Array.from(Array(10).keys());
    this.dataService.setViewers(this.viewersStatus);

    this.viewersList.forEach((v)=>{
      var viewer={id:v,status:0};
      this.viewersStatus.push(viewer);
    });

  }
  activeViewer(event){
    console.log(event);
    var view:any=this.viewersStatus.map((obj)=>{
      return obj.id;
    })
    view = view.indexOf(event.srcElement.id.split('_')[1]);

    this.viewersStatus[view].status=1;
    this.dataService.setViewers(this.viewersStatus,view);
  }
  deactiveViewer(event){
    console.log(event);
    var view=this.viewersStatus.map((obj)=>{
      return obj.id;
    }).indexOf(event.srcElement.id.split('_')[1]);

    this.viewersStatus[view].status=0;
    this.dataService.setViewers(this.viewersStatus,view);
  }

}
