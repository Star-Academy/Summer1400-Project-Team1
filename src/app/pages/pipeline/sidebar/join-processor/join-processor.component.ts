import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
interface JoinType {
   name: string;
}

@Component({
  selector: 'app-join-processor',
  templateUrl: './join-processor.component.html',
  styleUrls: ['./join-processor.component.scss']
})
export class JoinProcessorComponent implements OnInit {
  constructor() {
  }
  panelOpenState: boolean = true;
  filterProcessorList = [1,2,3,4,5]
  joinTypeControl = new FormControl('', Validators.required);
  joinTypes: JoinType[] = [
    { name: 'Left outer join'},
    { name: 'Inner join'},
    { name: 'Full outer join'},
    { name: 'Right outer join'},
  ];
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onClose() {

  }

  onDelete() {

  }

  onAddFilter() {

  }

}
