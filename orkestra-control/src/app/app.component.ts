import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private router: Router,translate: TranslateService) {
        translate.setDefaultLang('pt');
    }
    ngOnInit() {
        //this.router.navigate([''])
      }
}
