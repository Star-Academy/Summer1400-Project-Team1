import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PipelineService } from "src/app/services/pipeline.service";
import { Subscription } from "rxjs";

import { NodeType } from "../../models/graph/node";
import { switchMap } from "rxjs/operators";
import { Pipeline } from "../../models/pipeline";
import { MatDialog } from "@angular/material/dialog";
import { DownloadCsvDialogComponent } from "./download-csv-dialog/download-csv-dialog.component";

@Component({
  selector: "app-pipeline",
  templateUrl: "./pipeline.component.html",
  styleUrls: ["./pipeline.component.scss"],
})
export class PipelineComponent implements OnInit, OnDestroy,AfterViewInit {
  // pipeline$!: Observable<Pipeline>;
  outputSource = [];
  inputSource = [];
  outputSourceSub!:Subscription;
  inputSourceSub!:Subscription;
  pipeline!: Pipeline;
  isEditingPipelineTitle = false;
  expandSidebar = false;
  expandSidebarSub!: Subscription;
  pipelineSub!: Subscription;
  expandPreview = false;
  isModalOpen = false;
  pipelineId!:number;

  running:boolean=false;
  runningSub!: Subscription;
  runningFinishedSub!: Subscription;
  previewResize = {
    isResizing: false,
    previewHeight: 300,
    lastYPosition: 0,
  };

  constructor(
    public router: Router,
    public pipelineService: PipelineService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) {}
  ngAfterViewInit(): void {
    this.initialInputSource();
  }

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
        this.initialInputSource();

      });
      this.outputSourceSub= this.pipelineService.output.subscribe(output => {
        this.outputSource = output;
      });
      this.inputSourceSub= this.pipelineService.input.subscribe(input => {
        this.inputSource = input;
        console.log(this.inputSource);
        
      });

      this.runningSub = this.pipelineService.running.subscribe(running => {
        this.running  = running;
     
      })
     this.runningFinishedSub= this.pipelineService.runFinishedMessage.subscribe(message => {
        if (message==="FINISHED") {
          this.expandPreview=true;
        }
      });

  }
  async initialInputSource(){
    if (this.pipeline!==undefined && this.pipeline.Source !==undefined) {
      this.pipelineId=this.pipeline.Id;
      
await this.pipelineService.getOutputDataset(this.pipeline.Source.Id)
    .then(res=>{
      this.pipelineService.input.next(res);
    })      
    }
    
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
  }

  ngOnDestroy(): void {
    this.expandSidebarSub.unsubscribe();
    this.pipelineSub.unsubscribe();
    this.outputSourceSub.unsubscribe();
    this.runningSub.unsubscribe();
    this.runningFinishedSub.unsubscribe();
    this.inputSourceSub.unsubscribe();
  }

  get NodeType() {
    return NodeType;
  }

  runPipeline() {
    //TODO show error if didnt choose destination dataset
    this.pipelineService.runPipeline(this.pipeline.Id,this.pipeline.Destination.Id);
  }

  downloadCsv(){
    const dialogRef = this.dialog.open(DownloadCsvDialogComponent,{
      width: '30vw',
      height: '30vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.download(result);
    });
  
  }
  async download(result:any){
  await this.pipelineService.downloadCsv(result.limmiter,result.haveHeader,this.pipeline.Destination.Id)
  }
  async downloadYml(){
   await this.pipelineService.downloadYml(this.pipelineId);

  }
}
