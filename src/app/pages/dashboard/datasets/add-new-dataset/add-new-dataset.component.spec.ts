import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewDatasetComponent } from './add-new-dataset.component';

describe('AddNewDatasetComponent', () => {
  let component: AddNewDatasetComponent;
  let fixture: ComponentFixture<AddNewDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
