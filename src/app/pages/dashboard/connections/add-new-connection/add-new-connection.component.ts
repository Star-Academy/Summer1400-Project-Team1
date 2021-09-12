import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { ConnectionService } from "src/app/services/connection.service";

@Component({
  selector: "app-add-new-connection",
  templateUrl: "./add-new-connection.component.html",
  styleUrls: ["./add-new-connection.component.scss"],
})
export class AddNewConnectionComponent implements OnInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  hidePassword = true;
  saveNeeded: boolean = false;
  constructor(private location: Location,private connectionService:ConnectionService) {}

  ngOnInit(): void {}

  onClose() {
    if (!this.saveNeeded) this.location.back();
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.connectionService
    .createConnection({name: this.form.value.connectionName,
      server:this.form.value.server,
      userName:this.form.value.userName,
      password:this.form.value.password})
  }
}
