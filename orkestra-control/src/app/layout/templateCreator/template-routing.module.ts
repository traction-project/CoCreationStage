import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomComponent } from './room/room.component';

import { TemplateComponent } from './template.component'

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
        path: '', component: TemplateComponent, data: {
            breadcrumb: 'Bbox annotation UI',
            icon: 'fa fa-paint-brush'
        },
       
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplateRoutingModule { }
