import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogDeleteNodeDialog } from "./dialog-delete-node-dialog.component";

describe("DialogDeleteNodeComponent", () => {
  let component: DialogDeleteNodeDialog;
  let fixture: ComponentFixture<DialogDeleteNodeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteNodeDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteNodeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
