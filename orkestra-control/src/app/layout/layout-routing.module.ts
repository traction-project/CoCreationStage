/* << Copyright 2022 Tamayo Uria, Ana Domínguez Fanlo, Mikel Joseba Zorrilla Berasategui, Héctor Rivas Pagador, Sergio Cabrero Barros, Juan Felipe Mogollón Rodríguez, Daniel Mejías y Stefano Masneri >>
This file is part of CoCreationStage.
CoCreationStage is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CoCreationStage is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
You should have received a copy of the GNU Lesser General Public License along with Orkestralib. If not, see <https://www.gnu.org/licenses/>. */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'template' },
            { path: 'ui', loadChildren: './controls/ui.module#UIModule' },
            { path: 'camera', loadChildren: './camera/camera.module#CameraModule' },
            { path: 'audio', loadChildren: './audio/audio.module#AudioModule' },
            { path: 'player', loadChildren: './player/player.module#PlayerModule' },
            { path: 'mediac', loadChildren: './mediaControl/mediac.module#MediaCModule' },
            { path: 'template', loadChildren: './templateCreator/template.module#TemplateModule' },
            { path: 'rooms', loadChildren: './templateCreator/room/room.module#RoomModule' },
            { path: 'devlist', loadChildren: './templateCreator/devlist/devlist.module#DevlistModule' },
            { path: 'media', loadChildren: './templateCreator/media/media.module#MediaModule' }

        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
