/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIComponent } from './ui.component';
import { UIRoutingModule } from './ui-routing.module';
import { TimelineComponent } from 'src/app/timeline/timeline.component';
import { PreviewComponent } from 'src/app/shared/components/preview/preview.component';
import { MedialistComponent } from 'src/app/shared/components/medialist/medialist.component';
import { MatDividerModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { SafePipe } from 'src/app/shared/pipes/safe';
import {MatIconModule} from '@angular/material/icon'
import { NgChatModule } from 'ng-chat';
import { TranslateModule } from '@ngx-translate/core';
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
    declarations: [SafePipe,UIComponent,TimelineComponent,PreviewComponent,MedialistComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ],
   exports:[SafePipe]


})
export class UIModule {
}
