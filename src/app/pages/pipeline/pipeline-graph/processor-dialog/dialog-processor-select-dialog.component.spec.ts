import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogProcessorSelectDialog } from "./dialog-processor-select-dialog.component";

describe("ProcessorDialogComponent", () => {
  let component: DialogProcessorSelectDialog;
  let fixture: ComponentFixture<DialogProcessorSelectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogProcessorSelectDialog],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProcessorSelectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
