import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Smg360CoreServicesComponent } from './smg360-core-services.component';

describe('Smg360CoreServicesComponent', () => {
  let component: Smg360CoreServicesComponent;
  let fixture: ComponentFixture<Smg360CoreServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Smg360CoreServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Smg360CoreServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
