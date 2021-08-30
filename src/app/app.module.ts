import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { HeaderComponent } from "./pages/header/header.component";
import { DatasetsComponent } from "./pages/dashboard/datasets/datasets.component";
import { ConnectionsComponent } from "./pages/dashboard/connections/connections.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { PipelineComponent } from "./pages/pipeline/pipeline.component";
import { DatasetItemComponent } from "./pages/dashboard/datasets/dataset-item/dataset-item.component";
import { AddNewDatasetComponent } from "./pages/dashboard/datasets/add-new-dataset/add-new-dataset.component";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { AddNewConnectionComponent } from "./pages/dashboard/connections/add-new-connection/add-new-connection.component";
import { NodeItemComponent } from "./pages/pipeline/node-item/node-item.component";
import { ProcessorDialogComponent } from "./pages/pipeline/node-item/processor-dialog/processor-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { AddDestinationDialogComponent } from "./pages/pipeline/add-destination-dialog/add-destination-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    DatasetsComponent,
    ConnectionsComponent,
    PipelineComponent,
    DatasetItemComponent,
    AddNewDatasetComponent,
    AddNewConnectionComponent,
    NodeItemComponent,
    ProcessorDialogComponent,
    AddDestinationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
