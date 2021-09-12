import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import {PipelineService} from "../../../../services/pipeline.service";
import {Pipeline} from "../../../../models/pipeline";

@Component({
  selector: 'app-add-pipeline',
  templateUrl: './add-pipeline.component.html',
  styleUrls: ['./add-pipeline.component.scss']
})
export class AddPipelineComponent implements OnInit {

  constructor(public location: Location, public pipelineService: PipelineService) { }

  ngOnInit() {
  }

  onClose() {
    this.location.back();
  }

  onSubmit(form: NgForm) {
    this.pipelineService.addPipeline(form.value.pipelineName);
    this.location.back();
  }

}
