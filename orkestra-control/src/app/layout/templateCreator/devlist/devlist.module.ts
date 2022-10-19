/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DevlistComponent } from './devlist.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule, MatIconModule, MatMenuModule, MatTabsModule } from '@angular/material';
import { DevlistRoutingModule } from './devlist-routing.module';
import { DataService } from 'src/app/shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';




@NgModule({
    imports: [
        CommonModule,
        DevlistRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatTabsModule,
        DragDropModule,
        TranslateModule.forChild(),
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        TopBarModule
    ],
    declarations: [DevlistComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]


})
export class DevlistModule {
}
