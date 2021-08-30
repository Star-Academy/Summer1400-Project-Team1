import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Node, NodeType} from '../modals/node';

@Injectable({
    providedIn: 'root',
})
export class PipelineService {
    nodesTemp: Node[] = [
        new Node(-1, 'دیتاست مبدا',NodeType.SOURCE_LOCAL),
        new Node(-2, 'دیتاست مقصد',NodeType.DESTINATION_LOCAL),
    ];


    private _nodes!: Node[];

    nodesChanged = new Subject<Node[]>();

    get nodes(): Node[] {
        return this._nodes;
    }

    set nodes(value: Node[]) {
        this._nodes = value;
        this.nodesChanged.next(value);
    }

    constructor() {
    }

    getNodes() {
        this.nodes = this.nodesTemp;
    }

    addNode(node: Node, index: number) {
        this.nodes.splice(index, 0, node);
     }

    deleteNode(node1: Node) {
        this.nodes = this.nodes.filter(
            (node: Node) => node.id !== node1.id,
        );
    }
}
