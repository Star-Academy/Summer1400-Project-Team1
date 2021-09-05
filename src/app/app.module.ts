import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { AddNewConnectionComponent } from "./pages/dashboard/connections/add-new-connection/add-new-connection.component";
import { NodeItemComponent } from "./pages/pipeline/pipeline-graph/node-item/node-item.component";
import { ProcessorDialogComponent } from "./pages/pipeline/pipeline-graph/node-item/processor-dialog/processor-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AddDestinationDialogComponent } from "./pages/pipeline/pipeline-graph/add-destination-dialog/add-destination-dialog.component";
import { PipelineGraphComponent } from './pages/pipeline/pipeline-graph/pipeline-graph.component';
import { AddNewOperationComponent } from './pages/pipeline/add-new-operation/add-new-operation.component';
import { PipelinesComponent } from './pages/dashboard/pipelines/pipelines.component';
import { SidebarComponent } from './pages/pipeline/sidebar/sidebar.component';
import { FilterProcessorComponent } from './pages/pipeline/sidebar/filter-processor/filter-processor.component';
import { JoinProcessorComponent } from './pages/pipeline/sidebar/join-processor/join-processor.component';
import { AggregateProcessorComponent } from './pages/pipeline/sidebar/aggregate-processor/aggregate-processor.component';
import {MatSelectModule} from "@angular/material/select";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { FilterItemComponent } from './pages/pipeline/sidebar/filter-processor/filter-item/filter-item.component';
import {MatTreeModule} from "@angular/material/tree";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import { AddFilterDialogComponent } from './pages/pipeline/sidebar/filter-processor/add-filter-dialog/add-filter-dialog.component';
import {MatMenuModule} from "@angular/material/menu";

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
    AddNewOperationComponent,
    AddNewConnectionComponent,
    NodeItemComponent,
    ProcessorDialogComponent,
    AddDestinationDialogComponent,
    PipelineGraphComponent,
    SidebarComponent,
    PipelinesComponent,
    FilterProcessorComponent,
    JoinProcessorComponent,
    AggregateProcessorComponent,
    FilterItemComponent,
    AddFilterDialogComponent
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
        MatSnackBarModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        DragDropModule,
        MatButtonToggleModule,
        MatTreeModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatMenuModule
    ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
