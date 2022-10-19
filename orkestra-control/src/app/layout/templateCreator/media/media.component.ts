/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Orkestra, URI, UserTable, AppTable, KeyPress } from 'orkestraLib';
import { JanusService } from 'src/app/shared/services/janus.service';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'media-component',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent {
  orkestra: any;
  users: any;
  appData: any;
  app: any;
  server: any;
  rooms: any = [];
  mediaFiles: { name: string; url: string; }[];
  displayedColumns: string[];
  activeShow:any;

  constructor(private dataService: DataService, janusService: JanusService, private sanitizer: DomSanitizer, private router: Router, private changeDetectorRefs: ChangeDetectorRef,private translateService: TranslateService) {
    this.displayedColumns = ['name', 'url', 'actions'];
    this.activeShow = this.dataService.getActiveShow()
    if (typeof this.activeShow=="undefined") this.router.navigate(["/template"]);

    this.mediaFiles = [
      { name: "Octagon", url: 'https://d2pjmukh9qywdn.cloudfront.net/upload/transcoded/921eb5d0-543d-4fd2-90a3-c13d02fff89a.mpd' },
      { name: "Negro", url: "https://stagem2.traction-project.eu/upload/transcoded/4de5f8d8-d40f-468b-a3a4-440a443acbdc.mpd" },
      { name:"logo", url: "https://stagem3.traction-project.eu/upload/23c66a00-779e-4fe1-ba35-c19a28a17296.PNG"},
      { name: "Motion", url: "https://stagem3.traction-project.eu/upload/transcoded/cdbb7a71-e605-44f7-82d1-535a6c47b308.mpd" },
      { name: "Virutas", url: "https://stagem3.traction-project.eu/upload/transcoded/2cd2b61b-754b-4320-af45-2058f88bddb7.mpd" },
      { name: "Tunnel", url: "https://stagem2.traction-project.eu/upload/transcoded/901c99ee-9f4d-4996-891e-99120fadb0a1.mpd" },
      { name: "Particles", url: 'https://stagem2.traction-project.eu/upload/transcoded/4f9d894a-623a-47d2-bacd-585d4c32b237.mpd' },
      { name: "Yellow", url: "https://stagem2.traction-project.eu/upload/transcoded/2bd6a6ed-50bf-48fd-b325-60c13eac9759.mpd" },
      { name: "Yellow_2", url: "https://d2pjmukh9qywdn.cloudfront.net/upload/transcoded/46cfe70b-b844-411e-b817-844ad2f21d70.mpd" },
      { name: "Ondas", url:"https://d2pjmukh9qywdn.cloudfront.net/upload/transcoded/6cb74494-3575-4afa-9008-8180db8a5bfa.mpd"}
    ];

    // this.mediaFiles = [
    //   { name: "Octagon", url: 'https://cdntraction.s3.eu-west-3.amazonaws.com/Octagon1.mp4' },
    //   { name: "Negro", url: 'https://demotraction.s3.eu-west-3.amazonaws.com/videosTRaction/Negro1.mp4' },
    //   { name: "Motion", url: 'https://demotraction.s3.eu-west-3.amazonaws.com/videosTRaction/Motion1.mp4' },
    //   { name: "Virutas", url: 'https://cdntraction.s3.eu-west-3.amazonaws.com/Virutas1.mp4' },
    //   { name: "Tunnel", url: 'https://demotraction.s3.eu-west-3.amazonaws.com/videosTRaction/tunnel.mp4' },
    //   { name: "Ondas", url: 'https://cdntraction.s3.eu-west-3.amazonaws.com/ondas1.mp4' },
    //   { name: "Particles", url: 'https://demotraction.s3.eu-west-3.amazonaws.com/videosTRaction/Particles1.mp4' },
    //   { name: "Yellow", url: 'https://cdntraction.s3.eu-west-3.amazonaws.com/Yellow1.mp4' },
    //   { name: "Yellow_2", url: 'https://cdntraction.s3.eu-west-3.amazonaws.com/Yellow_21.mp4' },

    // ];

    console.log(this.dataService);
    this.addFiles(this.mediaFiles);
    setInterval(() => {
      let m = this.dataService.getActiveShow().multimedia;
      m =  m.filter((value, index, self) =>
        index === self.findIndex((t) => (
       t.place === value.place && t.name === value.name
      )))
      this.mediaFiles = [];
      m.forEach(f => {
        this.mediaFiles.push({ name: f.name, url: f.url });
      });
      this.changeDetectorRefs.detectChanges();
    }, 1500);
  }
  addFiles(files: any) {
    this.dataService.addMediaToShow(files);
  }
  removeFile(file:string){
    this.translateService.get('Are you sure').subscribe(msg => {
      let ans = confirm(msg + " ?")
      if (ans == true) this.dataService.removeMediaToShow(file);
    });
  }
  next() {
    // TODO:check whether is no empty
    this.router.navigate(["/", "ui", { master: true,previewOn:true }]);
  }
  back() {
    // TODO:check whether is no empty
    this.router.navigate(["/", "rooms"]);
  }  

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
