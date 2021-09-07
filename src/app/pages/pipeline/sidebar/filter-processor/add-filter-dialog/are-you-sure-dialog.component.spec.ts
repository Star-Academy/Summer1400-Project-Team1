import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreYouSureDialog } from './are-you-sure-dialog.component';

describe('AddFilterDialogComponent', () => {
  let component: AreYouSureDialog;
  let fixture: ComponentFixture<AreYouSureDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreYouSureDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreYouSureDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
