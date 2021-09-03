import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogSelectDatasetDialog } from "./dialog-select-dataset-dialog.component";

describe("AddDestinationDialogComponent", () => {
  let component: DialogSelectDatasetDialog;
  let fixture: ComponentFixture<DialogSelectDatasetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogSelectDatasetDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectDatasetDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
