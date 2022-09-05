import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioRoutingModule } from './audio-routing.module';
import { LayoutModule } from '../layout.module';
import { AudioComponent } from './audio.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule, MatIconModule, MatMenuModule } from '@angular/material';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';
import { ChatMobileComponent } from 'src/app/shared/components/chat-mobile/chat-mobile.component';
import { ResizerDirective } from 'src/app/shared/components/chat-mobile/resizer.directive';




@NgModule({
    imports: [
        CommonModule,
        AudioRoutingModule,
        TranslateModule.forChild(),
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        TopBarModule

    ],
    declarations: [AudioComponent,ChatMobileComponent,ResizerDirective],
    providers: [],
     schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]

})
export class AudioModule {
}
