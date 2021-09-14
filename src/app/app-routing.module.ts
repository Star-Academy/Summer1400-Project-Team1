import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { PipelineComponent } from "./pages/pipeline/pipeline.component";
import { DatasetsComponent } from "./pages/dashboard/datasets/datasets.component";
import { AddNewDatasetComponent } from "./pages/dashboard/datasets/add-new-dataset/add-new-dataset.component";
import { ConnectionsComponent } from "./pages/dashboard/connections/connections.component";
import { AddNewConnectionComponent } from "./pages/dashboard/connections/add-new-connection/add-new-connection.component";
import { PipelinesComponent } from "./pages/dashboard/pipelines/pipelines.component";
import { AddPipelineComponent } from "./pages/dashboard/pipelines/add-pipeline/add-pipeline.component";

import { AddLocalDatasetComponent } from "./pages/dashboard/datasets/add-local-dataset/add-local-dataset.component";
import { DatasetInfoComponent } from "./pages/dashboard/datasets/dataset-info/dataset-info.component";
//TODO change route animation
const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "datasets", pathMatch: "full" },
      { path: "datasets", component: DatasetsComponent },
      { path: "connection", component: ConnectionsComponent },
       { path: "connection/add", component: AddNewConnectionComponent },
      { path: "pipelines", component: PipelinesComponent },
      { path: "pipelines/add", component: AddPipelineComponent}
    ],
  },
  { path: "datasets/addlocal", component: AddLocalDatasetComponent },
  { path: "datasets/add", component: AddNewDatasetComponent },
  { path: "datasets/:id", component: DatasetInfoComponent },
  { path: "pipeline", component: PipelineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
