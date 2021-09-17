import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregateProcessorComponent } from './aggregate-processor.component';

describe('AggregateProcessorComponent', () => {
  let component: AggregateProcessorComponent;
  let fixture: ComponentFixture<AggregateProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggregateProcessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregateProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
