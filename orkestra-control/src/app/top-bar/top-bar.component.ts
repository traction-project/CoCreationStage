import { Input, Output } from '@angular/core';
import { Component, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import 'share-api-polyfill';
import {environment} from 'src/environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  dataService: any;
  record: boolean = false;
  sharedLink:string;
  showShareIcons:boolean = true;
  language:string="";
  
  @Output() recordEvent: EventEmitter<any> = new EventEmitter();
  @Input() display:boolean = true;
  constructor(private route: ActivatedRoute, private router: Router, dataService: DataService, public elem: ElementRef,private _snackBar: MatSnackBar,/*private keycloak: KeycloakService,*/private translate: TranslateService) {
    this.dataService = dataService;
    this.sharedLink = environment.protocol+"://"+environment.controlServer+"/player?id=controllerScreen&room=1234";
  }

  ngOnInit() {
    if (this.elem.nativeElement.querySelector('#record')) this.elem.nativeElement.querySelector('#record').addEventListener('click', () => {
      this.record = !this.record;
      this.recordEvent.emit(this.record);
    })
    console.log(this.route,this.router);
    if (this.router.routerState.toString().indexOf("ui") !=-1){
      this.showShareIcons = false;
    }
  }
  returnColor() {
    if (this.record) return "red";
    else return "white";
  }
  hideOptions(){
    this.display = false;
  }
  copyToMem() {
    var text = this.sharedLink
    navigator.clipboard.writeText(text).then (() =>{
    
        if ((navigator as any).share) {
          (navigator as any).share({
            title: 'Share Screen',
            url: text
          }).then(() => {
            console.log('Thanks for sharing!');
          })
          .catch(console.error);
        } else {
          // fallback
        }
  
    }, (err) =>{
      console.error('Async: Could not copy text: ', err);
    });
  }
  locale(lng: string) {
    this.dataService.setLanguage(lng);
    this.translate.setDefaultLang(lng);
    this.translate.use(lng);
    this.language = this.dataService.getLanguage().name;
   
  }
  logout (){
   // this.keycloak.logout();
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
