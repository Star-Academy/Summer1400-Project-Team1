import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { ConnectionService } from "src/app/services/connection.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-add-new-connection",
  templateUrl: "./add-new-connection.component.html",
  styleUrls: ["./add-new-connection.component.scss"],
})
export class AddNewConnectionComponent implements OnInit,OnDestroy {
  @ViewChild("form", { static: false }) form!: NgForm;
  hidePassword = true;

  inProgress:boolean=false;
  inProgressSub!:Subscription;
  saveNeeded: boolean = false;
  constructor(private location: Location,private connectionService:ConnectionService) {}


  ngOnInit(): void {
    this.connectionService.inProgress.next(false);
     this.inProgressSub = this.connectionService.inProgress.subscribe((inProgress:boolean) => {
      this.inProgress =inProgress;
    });
  }

  onClose() {
    if (!this.saveNeeded) this.location.back();
  }


  //TODO check password and other erros 
  onSubmit() {
    if (!this.form.valid) return;
    this.connectionService
    .createConnection({name: this.form.value.connectionName,
      server:this.form.value.server,
      userName:this.form.value.userName,
      password:this.form.value.password})
  }
  ngOnDestroy(): void {
    this.inProgressSub.unsubscribe();
  }
}
