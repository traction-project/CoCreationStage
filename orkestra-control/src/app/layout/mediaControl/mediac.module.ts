import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaCComponent } from './mediac.component';
import { MediaCRoutingModule } from './mediac-routing.module';
import { MatDividerModule, MatMenuModule, MatTabsModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';


@NgModule({
    imports: [
        CommonModule,
        MediaCRoutingModule,
        FormsModule,
        MatTabsModule,
        MatIconModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        MatDividerModule,
        MatMenuModule,
        TopBarModule

    ],
    declarations: [MediaCComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ],
   exports:[]


})
export class MediaCModule {
}
