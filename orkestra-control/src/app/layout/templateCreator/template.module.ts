import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RoomComponent } from './room/room.component';
import { DevlistComponent } from './devlist/devlist.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSortModule, MatTableModule } from '@angular/material';
import { TemplateComponent } from './template.component';
import { TemplateRoutingModule } from './template-routing.module';
import { AddDialogComponent } from './Dialog/Add/add.dialog.component';
import { DataService } from 'src/app/shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';





@NgModule({
    imports: [
        CommonModule,
        TemplateRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        TranslateModule,
        MatDividerModule,
        TopBarModule
    ],
    declarations: [TemplateComponent,AddDialogComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]


})
export class TemplateModule {
}
