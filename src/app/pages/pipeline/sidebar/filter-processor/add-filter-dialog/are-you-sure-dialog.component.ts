import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'app-add-filter-dialog',
    templateUrl: './are-you-sure-dialog.component.html',
    styleUrls: ['./are-you-sure-dialog.component.scss'],

})
export class AreYouSureDialog implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AreYouSureDialog>,
         public dialog: MatDialog,
      ) {


    }



    ngOnInit(): void {
    }


    onNoClick() {
        this.dialogRef.close();
    }
}
