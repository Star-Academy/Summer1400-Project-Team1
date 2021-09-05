import { AfterContentInit, Component, ViewChild } from "@angular/core";
import { GraphService } from "../../../services/graph.service";

@Component({
  selector: "app-pipeline-graph",
  templateUrl: "./pipeline-graph.component.html",
  styleUrls: ["./pipeline-graph.component.scss"],
})
export class PipelineGraphComponent implements AfterContentInit {
  @ViewChild("graphContainer", { static: true })
  private container;

  constructor(private graphService: GraphService) {}

  ngOnInit() {}

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
