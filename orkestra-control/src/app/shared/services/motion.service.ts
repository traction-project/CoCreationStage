import { Injectable,EventEmitter,OnInit } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { DataService } from './data.service';
import {ObjectSync} from 'orkestraLib';
import { environment } from 'src/environments/environment';


@Injectable()
export class MotionService {

	private data:any=[];

	timerController: any;
  dataservice: DataService;
	timevalue:number;
  motionObservable: Observable<any>;
  motionObserver: any;
  constructor (dataservice:DataService){
		 this.motionObservable =new Observable((observer) => { this.motionObserver = observer});
		 this.dataservice =dataservice;

	}
	init (channel:string){
		let app = this.dataservice.getAppInstance();
		let objsync = new ObjectSync();
		this.timerController = app.enableSequencer(objsync,channel, environment.motionServer);
		app.timerObservable.subscribe(timeObject => {
				this.timevalue = timeObject.target.currentTime;
				this.motionObserver.next(this.timevalue);
		 });
	}

	play(){
		this.timerController.play();
	}
	pause(){
		this.timerController.pause();
	}
	reset(){
		if (this.paused())
			this.timerController.reset(0.0);
		else
			this.timerController.reset(1.0);
	}
	paused ():boolean{
		return this.timerController.playbackRate === 0;
	}
	seek(fr:any){
		if (this.paused())
				this.timerController.seek(fr,0.0);
		else
			this.timerController.seek(fr,1.0);

	}

}
