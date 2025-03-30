import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvenTableComponent } from './oven-table.component';

describe('OvenTableComponent', () => {
  let component: OvenTableComponent;
  let fixture: ComponentFixture<OvenTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvenTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
