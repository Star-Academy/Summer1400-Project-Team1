import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { PipelineComponent } from './pages/pipeline/pipeline.component';
import {DatasetsComponent} from './pages/dashboard/datasets/datasets.component';
import {AddNewDatasetComponent} from './pages/dashboard/datasets/add-new-dataset/add-new-dataset.component';
import { ConnectionsComponent } from './pages/dashboard/connections/connections.component';
import { AddNewConnectionComponent } from './pages/dashboard/connections/add-new-connection/add-new-connection.component';

const routes: Routes = [
  {path: '', redirectTo:'dashboard', pathMatch:'full'},
  {path: 'dashboard', component: DashboardComponent,
    children: [
      {path: '', redirectTo:'datasets', pathMatch:'full'},
      { path: 'datasets', component: DatasetsComponent },
      { path: 'connection', component: ConnectionsComponent },
      { path: 'datasets/add', component: AddNewDatasetComponent },
      { path: 'connection/add', component: AddNewConnectionComponent},

    ]
  },
  {path: 'pipeline', component: PipelineComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
