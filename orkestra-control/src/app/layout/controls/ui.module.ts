import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIComponent } from './ui.component';
import { UIRoutingModule } from './ui-routing.module';
import { ViewersComponent } from 'src/app/viewers/viewers.component';
import { CamerasComponent } from 'src/app/cameras/cameras.component';
import { TimelineComponent } from 'src/app/timeline/timeline.component';
import { PreviewComponent } from 'src/app/shared/components/preview/preview.component';
import { MedialistComponent } from 'src/app/shared/components/medialist/medialist.component';
import { MatDividerModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { SafePipe } from 'src/app/shared/pipes/safe';
import {MatIconModule} from '@angular/material/icon'
import { NgChatModule } from 'ng-chat';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';


@NgModule({
    imports: [
        CommonModule,
        UIRoutingModule,
        FormsModule,
        MatTabsModule,
        MatIconModule,
        NgChatModule,
        TranslateModule.forChild(),
        TopBarModule,
        MatMenuModule,
        MatDividerModule

    ],
    declarations: [SafePipe,UIComponent,ViewersComponent,CamerasComponent,TimelineComponent,PreviewComponent,MedialistComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ],
   exports:[SafePipe]


})
export class UIModule {
}
