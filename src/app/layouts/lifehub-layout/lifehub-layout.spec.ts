import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifehubLayout } from './lifehub-layout';

describe('LifehubLayout', () => {
  let component: LifehubLayout;
  let fixture: ComponentFixture<LifehubLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifehubLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifehubLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
