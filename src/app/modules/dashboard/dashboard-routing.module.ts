import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { DashboradComponent } from './pages/dashborad.component';

const routes: Routes = [
    {
        path: 'dashboard', 
        component: DashboradComponent,
        loadChildren: () => import('./router-child.module').then(m => m.RouterChildModule)
    },
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
