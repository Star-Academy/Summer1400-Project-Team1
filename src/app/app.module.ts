import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './pages/header/header.component';
import { DatasetsComponent } from './pages/dashboard/datasets/datasets.component';
import { ConnectionsComponent } from './pages/dashboard/connections/connections.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import { PipelineComponent } from './pages/pipeline/pipeline.component';
import { DatasetItemComponent } from './pages/dashboard/datasets/dataset-item/dataset-item.component';
import { AddNewDatasetComponent } from './pages/dashboard/datasets/add-new-dataset/add-new-dataset.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    DatasetsComponent,
    ConnectionsComponent,
    PipelineComponent,
    DatasetItemComponent,
    AddNewDatasetComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
