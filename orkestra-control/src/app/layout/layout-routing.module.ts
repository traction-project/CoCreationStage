import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'template' },
            { path: 'ui', loadChildren: () => import('./controls/ui.module').then(mod => mod.UIModule)},
            { path: 'camera',loadChildren: () => import('./camera/camera.module').then(mod => mod.CameraModule)},
            { path: 'audio', loadChildren: () => import('./audio/audio.module').then(mod => mod.AudioModule)},
            { path: 'player', loadChildren: () => import('./player/player.module').then(mod => mod.PlayerModule)},
            { path: 'mediac', loadChildren: () => import('./mediaControl/mediac.module').then(mod => mod.MediaCModule)},
            { path: 'template',loadChildren: () => import('./templateCreator/template.module').then(mod => mod.TemplateModule)},
            { path: 'rooms', loadChildren: () => import('./templateCreator/room/room.module').then(mod => mod.RoomModule)},
            { path: 'devlist', loadChildren: () => import('./templateCreator/devlist/devlist.module').then(mod => mod.DevlistModule)},
            { path: 'media',loadChildren: () => import('./templateCreator/media/media.module').then(mod => mod.MediaModule)},

        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
