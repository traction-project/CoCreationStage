/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaCComponent } from './mediac.component';
import { MediaCRoutingModule } from './mediac-routing.module';
import { MatDividerModule, MatMenuModule, MatTabsModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';


@NgModule({
    imports: [
        CommonModule,
        MediaCRoutingModule,
        FormsModule,
        MatTabsModule,
        MatIconModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        MatDividerModule,
        MatMenuModule,
        TopBarModule

    ],
    declarations: [MediaCComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ],
   exports:[]


})
export class MediaCModule {
}
