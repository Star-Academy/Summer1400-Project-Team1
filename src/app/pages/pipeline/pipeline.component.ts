import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {PipelineService} from 'src/app/services/pipeline.service';
import {Node, NodeType} from '../../modals/node';


@Component({
    selector: 'app-pipeline',
    templateUrl: './pipeline.component.html',
    styleUrls: ['./pipeline.component.scss'],
})
export class PipelineComponent implements OnInit {
    nodes!: Node[];
    nodesSub!: Subscription;
    hasEndNodes : boolean=false;

    constructor(private pipelineService: PipelineService) {
    }

    ngOnInit(): void {
        this.pipelineService.getNodes();
        this.nodes = this.pipelineService.nodes;
        this.hasEndNodes = this.nodes[this.nodes.length - 1].id === -2;


        this.nodesSub = this.pipelineService.nodesChanged
            .subscribe((nodes: Node[]) => {
                this.nodes = nodes;
                this.hasEndNodes = this.nodes[this.nodes.length - 1].id === -2;
            });

    }

    deleteNode($event: Node) {
        this.pipelineService.deleteNode($event);

    }

    addNode($event: {index:number,node:Node}) {
        this.pipelineService
            .addNode($event.node, $event.index);
     }


    onEndNodeClick() {
        //TODO fkosdfdf

        // this.pipelineService.addNode(new Node(-2, 'end',NodeType.DESTINATION_LOCAL), this.nodes.length);
        // this.hasEndNodes = true;
    }

    onDeleteEndNode() {

    }

    onAddNode() {
        //TODO dalkdas
       // this.addNode(this.nodes.length)
    }
}
