import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit {

  pipelineTitle = 'نام پایپلاین'
  isEditingPipelineTitle = false;
  expandSidebar = true;
  expandPreview = true;
  isModalOpen=false;
  previewResize = {
    isResizing: false,
    previewHeight: 300,
    lastYPosition: 0
  }

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  handleResize(event: MouseEvent){
    if (this.previewResize.isResizing){
      let heightOffset = this.previewResize.lastYPosition - event.pageY;
      this.previewResize.previewHeight += heightOffset;
      this.previewResize.lastYPosition = event.pageY
    }
  }
}
