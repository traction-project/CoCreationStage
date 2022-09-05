import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UIComponent } from './ui.component'

const routes: Routes = [
    // { path: '', component: TasksComponent},

    {
        path: '', component: UIComponent, data: {
            breadcrumb: 'Bbox annotation UI',
            icon: 'fa fa-paint-brush'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UIRoutingModule { }
