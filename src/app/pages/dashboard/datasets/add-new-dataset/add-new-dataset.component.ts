import {Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common'
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-add-new-dataset',
  templateUrl: './add-new-dataset.component.html',
  styleUrls: ['./add-new-dataset.component.scss']
})
export class AddNewDatasetComponent implements OnInit {
  @ViewChild('form', {static: false}) form!: NgForm;
  datasetName!:string;
  panelOpenState: boolean=false;

  constructor(private location: Location) { }

  ngOnInit(): void {

  }

    onSubmit() {
    if (!this.form.valid) return;
    this.datasetName=this.form.value.datasetName;
    }

    onClose() {
        this.location.back();
    }
}
