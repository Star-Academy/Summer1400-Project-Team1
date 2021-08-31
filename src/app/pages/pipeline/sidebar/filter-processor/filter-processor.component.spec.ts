import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProcessorComponent } from './filter-processor.component';

describe('FilterProcessorComponent', () => {
  let component: FilterProcessorComponent;
  let fixture: ComponentFixture<FilterProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterProcessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
