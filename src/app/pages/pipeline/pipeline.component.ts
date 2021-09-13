import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PipelineService } from "src/app/services/pipeline.service";
import { Observable, Subscription } from "rxjs";
import { PipelineGraphComponent } from "./pipeline-graph/pipeline-graph.component";
import { GraphService } from "../../services/graph.service";
import { NodeType } from "../../models/graph/node";
import { switchMap } from "rxjs/operators";
import { Pipeline } from "../../models/pipeline";

@Component({
  selector: "app-pipeline",
  templateUrl: "./pipeline.component.html",
  styleUrls: ["./pipeline.component.scss"],
})
export class PipelineComponent implements OnInit, OnDestroy {
  // pipeline$!: Observable<Pipeline>;
  pipeline!: Pipeline;
  isEditingPipelineTitle = false;
  expandSidebar = false;
  expandSidebarSub!: Subscription;
  pipelineSub!: Subscription;
  expandPreview = false;
  isModalOpen = false;
  previewResize = {
    isResizing: false,
    previewHeight: 300,
    lastYPosition: 0,
  };

  constructor(
    public router: Router,
    public pipelineService: PipelineService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    document.onmouseup = () => {
      this.previewResize.isResizing = false;
    };
    this.expandSidebarSub = this.pipelineService.openSidebar.subscribe(
      () => (this.expandSidebar = true)
    );
    this.pipelineSub = this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.pipelineService.getPipelineById(+params.get("id")!)
        )
      )
      .subscribe((pipeline) => {
        this.pipeline = pipeline;
      });
  }

  editPipelineName(pipeline: Pipeline, ngForm: NgForm) {
    this.pipelineSub = this.pipelineService
      .editPipelineName(pipeline.Id, ngForm.value.newName)
      .subscribe((pipeline) => {
        this.pipeline = pipeline;
      });
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
    this.pipelineSub.unsubscribe();
  }

  get NodeType() {
    return NodeType;
  }
}
