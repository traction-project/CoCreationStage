/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopBarComponent} from './top-bar.component'
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDividerModule, MatIconModule, MatMenuModule } from '@angular/material';
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        MatDividerModule,
        MatMenuModule,
        MatIconModule
     ],
    declarations: [
        TopBarComponent
    ],
    exports: [
        TopBarComponent
    ],
    providers:[
        TranslateService
    ]
})
export class TopBarModule {}