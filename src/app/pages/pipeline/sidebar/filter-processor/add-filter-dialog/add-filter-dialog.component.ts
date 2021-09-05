import {Component, Injectable, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PipelineService} from "../../../../../services/pipeline.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {BehaviorSubject} from "rxjs";
import {Filter} from "../../../../../modals/filter-node";

/**
 * Node for to-do item
 */
export class TodoItemNode {
    children!: TodoItemNode[];
    item!: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
    item!: string;
    level!: number;
    expandable!: boolean;
    isParent!: boolean;

}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
    // AND: {
    // 'filter 1': null,
    // 'Organic eggs': null,
    // 'Protein Powder': null,
    // Fruits: {
    //   test: null,
    //   Apple: null,
    //   Berries: ['Blueberry', 'Raspberry'],
    //
    // }
    //},
    // Orange: {}
};


@Injectable()
export class ChecklistDatabase {

    dataChange = new BehaviorSubject<TodoItemNode[]>([]);

    get data(): TodoItemNode[] {
        return this.dataChange.value;
    }

    constructor() {
        this.initialize();
    }

    initialize() {
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        //     file node as children.
        const data = this.buildFileTree(TREE_DATA, 0);
         // Notify the change.
        this.dataChange.next(data);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
        return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new TodoItemNode();
            node.item = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.item = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

    /** Add an item to to-do list */
    insertItem( name: string , type: string,parent?: TodoItemNode,) {
        if (parent) {
            switch (type) {
                case 'filter':
                    parent.children.push({item: name} as TodoItemNode);
                    this.dataChange.next(this.data);
                    break;
                case 'and':
                    parent.children.push({
                        item: "AND", children: []
                    } as TodoItemNode);
                    this.dataChange.next(this.data);
                    break;
                case 'or':
                    parent.children.push({
                        item: "OR", children: []
                    } as TodoItemNode);
                    this.dataChange.next(this.data);
                    break;
            }
        }else{
            let root ={item:type,children:[
                 ]} as TodoItemNode;
            this.dataChange.next([root])
        }

    }

    updateItem(node: TodoItemNode, name: string) {
        node.item = name;
        this.dataChange.next(this.data);
    }
}


@Component({
    selector: 'app-add-filter-dialog',
    templateUrl: './add-filter-dialog.component.html',
    styleUrls: ['./add-filter-dialog.component.scss'],
    providers: [ChecklistDatabase]

})
export class AddFilterDialogComponent implements OnInit {

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

    /** A selected parent node to be inserted */
    selectedParent: TodoItemFlatNode | null = null;

    /** The new item's name */
    newItemName = '';

    treeControl!: FlatTreeControl<TodoItemFlatNode>;

    treeFlattener!: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

    dataSource!: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
    private isEmpty: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<AddFilterDialogComponent>,
        private pipelineService: PipelineService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private _database: ChecklistDatabase
    ) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        _database.dataChange.subscribe(data => {
            this.dataSource.data = data;
            this.isEmpty=data.length === 0;
         });
    }

    isTreeEmpty = () => this.isEmpty;
    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => {
         return _nodeData.isParent;
    }
    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TodoItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.item === node.item
            ? existingNode
            : new TodoItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.expandable = !!node.children?.length;
        flatNode.isParent = flatNode.item==="AND" ||flatNode.item==="OR"
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }


    /* Get the parent node of a node */
    filterDemo: Filter=new Filter(0,"age",">","20");
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    /** Select the category so we can insert the new item. */
    addNewItem(node: TodoItemFlatNode, type: string) {
        const parentNode = this.flatNodeMap.get(node);
        this._database.insertItem( '', type,parentNode!);
        this.treeControl.expand(node);
    }

    /** Save the node to database */
    saveNode(node: TodoItemFlatNode, itemValue: string) {
        const nestedNode = this.flatNodeMap.get(node);
        this._database.updateItem(nestedNode!, itemValue);
    }

    ngOnInit(): void {
    }

    onSelectProcessor(processor: string) {
        this.dialogRef.close(processor);
    }

    closeDialog() {
        this.dialogRef.close();
    }

    addRoot(type:string) {
        this._database.insertItem( '', type);
    }
}
