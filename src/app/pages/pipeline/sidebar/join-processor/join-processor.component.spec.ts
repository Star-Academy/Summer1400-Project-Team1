import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinProcessorComponent } from './join-processor.component';

describe('JoinProcessorComponent', () => {
  let component: JoinProcessorComponent;
  let fixture: ComponentFixture<JoinProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinProcessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
