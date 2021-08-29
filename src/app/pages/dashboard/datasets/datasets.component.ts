import { Component, OnInit } from '@angular/core';
import { Dataset } from 'src/app/modals/dataset';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {

  datasets=[
      new Dataset(),
      new Dataset(),
      new Dataset(),
      new Dataset(),
  ]
  constructor() { }

  ngOnInit(): void {
  }

    onUpload(event: any) {
      if(event.target !== null)
        console.log(event.target.files);
    }
}
