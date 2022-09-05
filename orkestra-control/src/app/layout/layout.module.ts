import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { UIComponent } from './controls/ui.component';
import { DataService } from '../shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';




@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule
        
    ],
    declarations: [
        LayoutComponent

    ],
    providers: [],
    schemas: [
	   CUSTOM_ELEMENTS_SCHEMA
   ]


})
export class LayoutModule { }
