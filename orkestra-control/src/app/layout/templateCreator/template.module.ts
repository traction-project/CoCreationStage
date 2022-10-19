/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RoomComponent } from './room/room.component';
import { DevlistComponent } from './devlist/devlist.component';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSortModule, MatTableModule } from '@angular/material';
import { TemplateComponent } from './template.component';
import { TemplateRoutingModule } from './template-routing.module';
import { AddDialogComponent } from './Dialog/Add/add.dialog.component';
import { DataService } from 'src/app/shared/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { TopBarModule } from 'src/app/top-bar/top-bar.module';





@NgModule({
    imports: [
        CommonModule,
        TemplateRoutingModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        TranslateModule,
        MatDividerModule,
        TopBarModule
    ],
    declarations: [TemplateComponent,AddDialogComponent],
    providers: [],
    schemas: [
           CUSTOM_ELEMENTS_SCHEMA
   ]


})
export class TemplateModule {
}
