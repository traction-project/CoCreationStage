/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { JanusService } from 'src/app/shared/services/janus.service';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddDialogComponent } from './Dialog/Add/add.dialog.component';
import { Show } from 'src/app/shared/models/show.class';
import { Room } from 'src/app/shared/models/room.class';
import { MatPaginator, MatSort, MatTable } from '@angular/material';
import { DBService } from 'src/app/shared/services/db.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'template-component',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  orkestra: any;
  users: any;
  appData: any;
  app: any;
  server: any;
  dataSource: any;
  displayedColumns: any = [];
  language: string = "Português";
  currentScreenWidth: string = '';
  flexMediaWatcher: Subscription;
  mobile: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private route: ActivatedRoute, public dataService: DataService, private dbService: DBService, public dialog: MatDialog, private router: Router
    , public janusService: JanusService, private mediaObserver: MediaObserver, private translate: TranslateService,/*private keycloak: KeycloakService*/) {
    this.displayedColumns = ['name', 'numberOfRooms', 'numberOfScenes', 'actions'];
    this.dataService.setLanguage('pt');
    // this.language = this.dataService.getLanguage().name;
    this.dbService.getShows().subscribe((e) => {
      let data: any = e;
      let tnp: any[] = [];
      data.forEach(x => {
        let _x = JSON.parse(x.show);
        tnp.push(_x);
      })
      this.dataSource = tnp;
      this.dataService.setShows(tnp);
      console.log(tnp);
    })
    this.flexMediaWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias !== this.currentScreenWidth) {
        this.currentScreenWidth = change.mqAlias;
        this.setupTable();
      }
    }); // Be sure

  }
  setupTable() {
    this.displayedColumns = ['name', 'numberOfRooms', 'numberOfScenes', 'actions'];
    if (this.currentScreenWidth === 'xs') { // only display internalId on larger screens
      this.displayedColumns = this.displayedColumns.filter((t => {
        if (t == "name" || t == "actions") return true;
        else return false;
      }))
      this.mobile = true;
    }
    else {
      this.mobile = false;
    }
  }
  deleteItem(name: string) {
    this.translate.get("Type to confirm").subscribe(txt=>{});
    this.translate.get("Deleted ").subscribe(e => {
      this.translate.get("Type to confirm").subscribe(txt=>{
      let result = prompt(e + " " + name + "? "+txt+":"+name);
      if (result == name) {
        this.dataService.deleteShow(name);
        this.dbService.removeShow(name).subscribe(ev => {

          let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
          this.janusService.removeRoom(intRoom);
          this.dbService.getShows().subscribe((e) => {
            let data: any = e;
            let tnp: any[] = [];
            data.forEach(x => {
              let _x = JSON.parse(x.show);
              tnp.push(_x);
            })

            this.dataSource = tnp;
            this.dataService.setShows(tnp);

          })
        });

      }
    });
  });

  }
  cleanJanusRooms() {
    this.janusService.cleanRooms();
  }
  editTemplate(name: string) {
    this.dataService.getShowByName(name);
    localStorage.setItem('show', name);
    this.dataService.setActiveShow(name);
    this.janusService.setRoomByName(name);
    let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    this.janusService.isRoomExists(intRoom).then((ev) => {
      if (ev !== true) this.janusService.createRoom(intRoom).then(ev => {
        console.log("Room created at janus", ev);
      }).catch(ev => console.log(ev));
    });
    this.router.navigate(["/", "rooms"], { relativeTo: this.route })
  }
  copyTemplate(name: string) {
    let newName: string = name + "_copy";
    let newShow: Show = this.dataService.getShowByName(name);

    let json = JSON.stringify(newShow);
    json = (json as any).replaceAll("channel=" + name, "channel=" + newName);
    json = (json as any).replaceAll("name=" + name, "name=" + newName);
    let newRoom = newName.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    this.janusService.isRoomExists(newRoom).then((ev) => {
      if (ev !== true) this.janusService.createRoom(newRoom).then(ev => {
        console.log("Room created at janus", ev);
      }).catch(ev => console.log(ev));
    });
    json = (json as any).replaceAll("room=" + intRoom, "room=" + newRoom);
    let duplicateShow: Show = JSON.parse(json);
    duplicateShow.name = newName;
    this.dataService.addShow(duplicateShow);
    this.dataSource = this.dataService.getShows();
    this.table.renderRows();

  }
  renameTemplate(name: string) {
    let newName: string = prompt("Rename Show name to:", name);
    if (!newName) return;
    let newShow: Show = this.dataService.getShowByName(name);
    newShow.name = newName;

    let json = JSON.stringify(newShow);
    json = (json as any).replaceAll("channel=" + name, "channel=" + newName);
    json = (json as any).replaceAll("name=" + name, "name=" + newName);
    let newRoom = newName.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    this.janusService.isRoomExists(newRoom).then((ev) => {
      if (ev !== true) this.janusService.createRoom(newRoom).then(ev => {
        console.log("Room created at janus", ev);
      }).catch(ev => console.log(ev));
    });
    json = (json as any).replaceAll("room=" + intRoom, "room=" + newRoom);
    newShow = JSON.parse(json);
    this.dataService.updateShow(newShow);
    this.dataSource = this.dataService.deleteShow(name);
    this.dbService.removeShow(name).subscribe(ev => {

      let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
      this.janusService.removeRoom(intRoom);
      this.dbService.getShows().subscribe((e) => {
        let data: any = e;
        let tnp: any[] = [];
        data.forEach(x => {
          let _x = JSON.parse(x.show);
          tnp.push(_x);
        })

        this.dataSource = tnp;
        this.dataService.setShows(tnp);

      })
    });
    this.table.renderRows();

  }
  goToShowOnlyView(name: string) {
    this.dataService.getShowByName(name);
    localStorage.setItem('show', name);
    this.dataService.setActiveShow(name);
    this.janusService.setRoomByName(name);
    this.router.navigate(["/", "ui"], { relativeTo: this.route })
  }
  goToShowWithoutPreviews(name: string) {
    this.dataService.getShowByName(name);
    localStorage.setItem('show', name);
    this.dataService.setActiveShow(name);
    this.janusService.setRoomByName(name);
    let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    this.janusService.isRoomExists(intRoom).then((ev) => {
      if (ev !== true) this.janusService.createRoom(intRoom).then(ev => {
        console.log("Room created at janus", ev);
      }).catch(ev => console.log(ev));
    });
    this.router.navigate(["/", "ui", { master: true, previewOn: false }], { relativeTo: this.route })
  }
  goToShow(name: string) {
    this.dataService.getShowByName(name);
    localStorage.setItem('show', name);
    this.dataService.setActiveShow(name);
    this.janusService.setRoomByName(name);
    let intRoom = name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
    this.janusService.isRoomExists(intRoom).then((ev) => {
      if (ev !== true) this.janusService.createRoom(intRoom).then(ev => {
        console.log("Room created at janus", ev);
      }).catch(ev => console.log(ev));
    });
    this.router.navigate(["/", "ui", { master: true, previewOn: true }], { relativeTo: this.route })
  }
  seeDevList(name: string) {
    this.dataService.getShowByName(name);
    localStorage.setItem('show', name);
    this.dataService.setActiveShow(name);
    this.janusService.setRoomByName(name);
    this.router.navigate(["/", "devlist"], { relativeTo: this.route })
  }
  createTemplate() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { name: "", rooms: 0, remoteAudience: false, scenes: 0, nosignalimg: "" }
    });

    dialogRef.afterClosed().subscribe(result => {


      if (result !== undefined) {

        console.log(result);
        let rooms = [];
        for (let i = 0; i < parseInt(result.rooms); i++) {
          rooms.push(new Room("Room" + i));
        }
        if (result.remoteAudience) {
          rooms.push(new Room("RemoteAudience"));
        }
        result.name = result.name.replace(/ /g, '_');
        let show: Show = new Show(result.name, rooms, [], result.rooms, result.remoteAudience, parseInt(result.scenes), '');
        localStorage.setItem('show', result.name);
        this.dataService.addShow(show);
        this.dataService.setActiveShow(result.name);
        let intRoom = result.name.split('').map(x => { return x.charCodeAt(0) }).reduce((acu, y) => { return acu + y });
        this.janusService.isRoomExists(intRoom).then((ev) => {
          if (ev !== true) this.janusService.createRoom(intRoom).then(ev => {
            console.log("Room created at janus", ev);
          }).catch(ev => console.log(ev));
        });
        this.router.navigate(["/", "rooms"], { relativeTo: this.route })
      }
    });
  }

  changeStyle() {
    setTimeout(() => {
      document.querySelector('.cdk-overlay-connected-position-bounding-box').setAttribute('style', 'top:0px !important');
    }, 5);
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
