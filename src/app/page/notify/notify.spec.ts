import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notify } from './notify';

describe('Notify', () => {
  let component: Notify;
  let fixture: ComponentFixture<Notify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
