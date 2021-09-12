import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocalDatasetComponent } from './add-local-dataset.component';

describe('AddLocalDatasetComponent', () => {
  let component: AddLocalDatasetComponent;
  let fixture: ComponentFixture<AddLocalDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLocalDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocalDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
