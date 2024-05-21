import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsDetailsComponent } from './payments-details.component';

describe('PaymentsDetailsComponent', () => {
  let component: PaymentsDetailsComponent;
  let fixture: ComponentFixture<PaymentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
