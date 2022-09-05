import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomComponent } from './room.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule, MatDivider, MatDividerModule, MatIconModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { RoomRoutingModule } from './room-routing.module';
import { DataService } from 'src/app/shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';




@NgModule({
    imports: [
        CommonModule,
        RoomRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatTabsModule,
        DragDropModule,
        TranslateModule.forChild(),
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        TopBarModule
    ],
    declarations: [RoomComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]

    
})
export class RoomModule {
}
