import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {CdkTableModule} from '@angular/cdk/table';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { HeaderComponent } from "./pages/header/header.component";
import { DatasetsComponent } from "./pages/dashboard/datasets/datasets.component";
import { ConnectionsComponent } from "./pages/dashboard/connections/connections.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";
import { PipelineComponent } from "./pages/pipeline/pipeline.component";
import { AddNewDatasetComponent } from "./pages/dashboard/datasets/add-new-dataset/add-new-dataset.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { AddNewConnectionComponent } from "./pages/dashboard/connections/add-new-connection/add-new-connection.component";
import { DialogProcessorSelectDialog } from "./pages/pipeline/pipeline-graph/processor-dialog/dialog-processor-select-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {MatStepperModule} from '@angular/material/stepper';
import { DialogSelectDatasetDialog } from "./pages/pipeline/pipeline-graph/add-destination-dialog/dialog-select-dataset-dialog.component";
import { PipelineGraphComponent } from "./pages/pipeline/pipeline-graph/pipeline-graph.component";
import { PipelinesComponent } from "./pages/dashboard/pipelines/pipelines.component";
import { SidebarComponent } from "./pages/pipeline/sidebar/sidebar.component";
import { FilterProcessorComponent } from "./pages/pipeline/sidebar/filter-processor/filter-processor.component";
import { JoinProcessorComponent } from "./pages/pipeline/sidebar/join-processor/join-processor.component";
import { AggregateProcessorComponent } from "./pages/pipeline/sidebar/aggregate-processor/aggregate-processor.component";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FilterItemComponent } from "./pages/pipeline/sidebar/filter-processor/filter-item/filter-item.component";
import { TableInputOutputComponent } from "./pages/pipeline/table-input-output/table-input-output.component";
import { MatTreeModule } from "@angular/material/tree";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { DialogDeleteNodeDialog } from "./pages/pipeline/sidebar/dialog-delete-node/dialog-delete-node-dialog.component";
import { HttpClientModule } from "@angular/common/http";
import { AddLocalDatasetComponent } from './pages/dashboard/datasets/add-local-dataset/add-local-dataset.component';
import { AddPipelineComponent } from "./pages/dashboard/pipelines/add-pipeline/add-pipeline.component";
import {MatListModule} from '@angular/material/list';
import { DatasetInfoComponent } from './pages/dashboard/datasets/dataset-info/dataset-info.component';
import { HomeComponent } from './pages/home/home.component';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    DatasetsComponent,
    ConnectionsComponent,
    PipelineComponent,
    AddLocalDatasetComponent,
    AddNewDatasetComponent,
    AddNewConnectionComponent,
    AddNewConnectionComponent,
    DialogProcessorSelectDialog,
    DialogSelectDatasetDialog,
    PipelineGraphComponent,
    SidebarComponent,
    PipelinesComponent,
    FilterProcessorComponent,
    JoinProcessorComponent,
    AggregateProcessorComponent,
    FilterItemComponent,
    TableInputOutputComponent,
    DialogDeleteNodeDialog,
    AddPipelineComponent,
    DatasetInfoComponent,
    HomeComponent,
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
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
    MatTooltipModule,
    MatMenuModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatListModule,
    CdkTableModule,
    MatChipsModule
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
