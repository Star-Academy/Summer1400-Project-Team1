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
  
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  editPipelineName(ngForm: NgForm) {
    this.pipelineTitle = ngForm.value.newTitle
    this.isEditingPipelineTitle = false;
  }
}
