import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HornoComponent } from './horno.component';

describe('HornoComponent', () => {
  let component: HornoComponent;
  let fixture: ComponentFixture<HornoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HornoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HornoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
