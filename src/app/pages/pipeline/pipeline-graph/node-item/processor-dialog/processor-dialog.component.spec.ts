import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorDialogComponent } from './processor-dialog.component';

describe('ProcessorDialogComponent', () => {
  let component: ProcessorDialogComponent;
  let fixture: ComponentFixture<ProcessorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
