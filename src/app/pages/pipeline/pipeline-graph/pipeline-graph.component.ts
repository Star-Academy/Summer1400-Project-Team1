import { AfterContentInit, Component, Input, ViewChild } from "@angular/core";
import { GraphService } from "../../../services/graph.service";
import { MatDialog } from "@angular/material/dialog";
import { PipelineService } from "../../../services/pipeline.service";
import { TerminalNode } from "../../../models/graph/terminal-nodes/terminal-node";
import { DialogSelectDatasetDialog } from "./add-destination-dialog/dialog-select-dataset-dialog.component";
import { Dataset } from "../../../models/dataset";
import { Pipeline } from "../../../models/pipeline";
import { NodeType } from "../../../models/graph/node";
import { OgmaService } from "../../../services/ogma.service";

@Component({
  selector: "app-pipeline-graph",
  templateUrl: "./pipeline-graph.component.html",
  styleUrls: ["./pipeline-graph.component.scss"],
})
export class PipelineGraphComponent implements AfterContentInit {
  @Input() pipeline!: Pipeline;
  @ViewChild("graphContainer", { static: true })
  private container;

  constructor(
    private ogmaService: OgmaService,
    private graphService: GraphService,
    private dialog: MatDialog,
    private pipelineService: PipelineService
  ) {}

  ngOnInit() {
    this.graphService.clickedNode.subscribe((node) => {
      if (node instanceof TerminalNode) this.promptDatasetSelectDialog(node);
    });
  }

  promptDatasetSelectDialog(terminalNode: TerminalNode) {
    const dialogRef = this.dialog.open(DialogSelectDatasetDialog, {
      width: "50vw",
    });
    dialogRef.afterClosed().subscribe((dataset: Dataset) => {
      if (dataset) {
        this.setDataset(terminalNode, dataset);
      }
    });
  }

  setDataset(terminalNode: TerminalNode, dataset: Dataset) {
    let obs =
      terminalNode.nodeType === NodeType.SOURCE
        ? this.pipelineService.setSrcDataset(this.pipeline.Id, dataset.Id)
        : this.pipelineService.setDestDataset(this.pipeline.Id, dataset.Id);
    obs.toPromise().then(() => {
      terminalNode.dataset = dataset;
      this.ogmaService.updateTerminalNode(terminalNode);
    });
  }

  ngAfterContentInit(): void {
    this.graphService.constructGraph(this.container.nativeElement);
  }

  zoomIn() {
    this.graphService.zoomIn();
  }

  zoomOut() {
    this.graphService.zoomOut();
  }
}
