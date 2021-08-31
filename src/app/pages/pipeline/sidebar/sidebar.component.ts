import { Component, Input, OnInit } from "@angular/core";
import { NodeType } from "src/app/modals/node";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @Input() processType!: string;
  constructor() {}

  ngOnInit(): void {}
}
