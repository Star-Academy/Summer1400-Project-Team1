import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatRadioButton} from '@angular/material/radio';
export interface DialogData {
  processorType: string;
 }

@Component({
  selector: 'app-processor-dialog',
  templateUrl: './processor-dialog.component.html',
  styleUrls: ['./processor-dialog.component.scss']
})
export class ProcessorDialogComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<ProcessorDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }


  onSelectProcessor(processor: string) {
      this.dialogRef.close(processor);

  }
}
