import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDestinationDialogComponent } from './add-destination-dialog.component';

describe('AddDestinationDialogComponent', () => {
  let component: AddDestinationDialogComponent;
  let fixture: ComponentFixture<AddDestinationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDestinationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDestinationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
