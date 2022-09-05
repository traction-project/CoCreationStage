import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from 'src/app/top-bar/top-bar.component';
import { PlayerRoutingModule } from './player-routing.module';
import { LayoutModule } from '../layout.module';
import { PlayerComponent } from './player.component';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';




@NgModule({
    imports: [
        CommonModule,
        PlayerRoutingModule,
        TranslateModule.forChild(),
        TopBarModule

    ],
    declarations: [PlayerComponent],
    providers: [],
     schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]

})
export class PlayerModule {
}
