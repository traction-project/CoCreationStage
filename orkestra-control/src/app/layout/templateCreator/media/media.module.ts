import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaComponent } from './media.component';
import { MediaRoutingModule } from './media-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule, MatIconModule, MatMenuModule, MatSortModule, MatTableModule, MatTabsModule } from '@angular/material';
import { UploadModule } from 'src/app/shared/upload/upload.module';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';




@NgModule({
    imports: [
        CommonModule,
        MediaRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        UploadModule,
        MatTableModule,
        MatSortModule,
        MatIconModule, 
        TranslateModule.forChild(),
        TopBarModule,
        MatDividerModule,
        MatMenuModule
    ],
    declarations: [MediaComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]
 
    
})
export class MediaModule {
}
