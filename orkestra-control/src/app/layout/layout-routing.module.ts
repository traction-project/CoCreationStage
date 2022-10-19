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
