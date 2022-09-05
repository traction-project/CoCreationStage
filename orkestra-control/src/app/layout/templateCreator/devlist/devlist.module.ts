import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DevlistComponent } from './devlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule, MatIconModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { DevlistRoutingModule } from './devlist-routing.module';
import { DataService } from 'src/app/shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';




@NgModule({
    imports: [
        CommonModule,
        DevlistRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatTabsModule,
        DragDropModule,
        TranslateModule.forChild(),
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        TopBarModule
    ],
    declarations: [DevlistComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]


})
export class DevlistModule {
}
