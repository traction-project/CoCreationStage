/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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
