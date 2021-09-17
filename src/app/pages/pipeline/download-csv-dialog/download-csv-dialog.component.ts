import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PipelineService } from 'src/app/services/pipeline.service';

@Component({
  selector: 'app-download-csv-dialog',
  templateUrl: './download-csv-dialog.component.html',
  styleUrls: ['./download-csv-dialog.component.scss']
})
export class DownloadCsvDialogComponent implements OnInit {
  @ViewChild("form", { static: false }) form!: NgForm;

  haveHeader:boolean=true;
  
  constructor( public dialogRef: MatDialogRef<DownloadCsvDialogComponent>,
    
    private pipelineService:PipelineService) { }

  ngOnInit(): void {
  }

  async onSubmit(){
    if (this.form.value.datasetSeparator==="") return;
    let limmiter =this.form.value.datasetSeparator;
    let haveHeader =this.haveHeader;
    this.dialogRef.close({limmiter,haveHeader})

  }

}
