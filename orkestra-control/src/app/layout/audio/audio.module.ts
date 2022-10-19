/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
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
