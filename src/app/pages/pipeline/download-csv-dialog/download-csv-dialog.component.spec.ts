import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCsvDialogComponent } from './download-csv-dialog.component';

describe('DownloadCsvDialogComponent', () => {
  let component: DownloadCsvDialogComponent;
  let fixture: ComponentFixture<DownloadCsvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadCsvDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadCsvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
