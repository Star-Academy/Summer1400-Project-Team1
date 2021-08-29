import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-add-new-connection',
  templateUrl: './add-new-connection.component.html',
  styleUrls: ['./add-new-connection.component.scss']
})
export class AddNewConnectionComponent implements OnInit {
  @ViewChild('form', {static: false}) form!: NgForm;
  connectionName!:string;
  constructor(private location: Location) { }

  ngOnInit(): void {
  }

    onClose() {
      this.location.back();
    }

  onSubmit() {
    if (!this.form.valid) return;
    this.connectionName=this.form.value.connectionName;
  }
}
