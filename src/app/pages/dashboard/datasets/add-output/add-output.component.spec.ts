import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutputComponent } from './add-output.component';

describe('AddOutputComponent', () => {
  let component: AddOutputComponent;
  let fixture: ComponentFixture<AddOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
