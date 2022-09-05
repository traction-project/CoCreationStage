import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopBarComponent} from './top-bar.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDividerModule, MatIconModule, MatMenuModule } from '@angular/material';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatDividerModule,
        MatMenuModule,
        MatIconModule
     ],
    declarations: [
        TopBarComponent
    ],
    exports: [
        TopBarComponent
    ],
    providers:[
        TranslateService
    ]
})
export class TopBarModule {}