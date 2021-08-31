import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { Router } from "@angular/router";
import { PipelineService } from "src/app/services/pipeline.service";

@Component({
  selector: "app-pipeline",
  templateUrl: "./pipeline.component.html",
  styleUrls: ["./pipeline.component.scss"],
})
export class PipelineComponent implements OnInit {
  pipelineTitle = "نام پایپلاین";
  isEditingPipelineTitle = false;
  expandSidebar = false;
  expandPreview = false;
  isModalOpen = false;
  previewResize = {
    isResizing: false,
    previewHeight: 300,
    lastYPosition: 0,
  };

  constructor(
    public router: Router,
    private pipelineService: PipelineService
  ) {}

  ngOnInit(): void {
    document.onmouseup = (event) => {
      this.previewResize.isResizing = false;
    };
    this.pipelineService.toggleSideBar.subscribe((expandSidebar: boolean) => {
      this.expandSidebar = expandSidebar;
    });
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
}
