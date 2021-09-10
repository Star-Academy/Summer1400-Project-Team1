import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { PipelineService } from "src/app/services/pipeline.service";
import { Subscription } from "rxjs";
import { PipelineGraphComponent } from "./pipeline-graph/pipeline-graph.component";
import { GraphService } from "../../services/graph.service";
import { NodeType } from "../../models/graph/node";

@Component({
  selector: "app-pipeline",
  templateUrl: "./pipeline.component.html",
  styleUrls: ["./pipeline.component.scss"],
})
export class PipelineComponent implements OnInit, OnDestroy {
  pipelineTitle = "نام پایپلاین";
  isEditingPipelineTitle = false;
  expandSidebar = false;
  expandSidebarSub!: Subscription;
  expandPreview = false;
  isModalOpen = false;
  previewResize = {
    isResizing: false,
    previewHeight: 300,
    lastYPosition: 0,
  };

  constructor(public router: Router, public pipelineService: PipelineService) {}
  ngOnInit(): void {
    document.onmouseup = () => {
      this.previewResize.isResizing = false;
    };
    this.pipelineService.openSidebar.subscribe(
      () => (this.expandSidebar = true)
    );
  }

  editPipelineName(ngForm: NgForm) {
    this.pipelineTitle = ngForm.value.newTitle;
    this.isEditingPipelineTitle = false;
  }

  onStartResize(event: MouseEvent) {
    this.previewResize.isResizing = true;
    this.previewResize.lastYPosition = event.pageY;
  }

  handleResize(event: MouseEvent) {
    if (this.previewResize.isResizing) {
      let heightOffset = this.previewResize.lastYPosition - event.pageY;
      this.previewResize.previewHeight += heightOffset;
      this.previewResize.lastYPosition = event.pageY;
    }
  }

  toggleSidebar() {
    this.expandSidebar = !this.expandSidebar;
    //TODO empty side bar
  }

  ngOnDestroy(): void {
    this.expandSidebarSub.unsubscribe();
  }

  get NodeType() {
    return NodeType;
  }
}
