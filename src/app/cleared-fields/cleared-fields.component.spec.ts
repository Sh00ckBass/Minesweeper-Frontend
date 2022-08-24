import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearedFieldsComponent } from './cleared-fields.component';

describe('ClearedFieldsComponent', () => {
  let component: ClearedFieldsComponent;
  let fixture: ComponentFixture<ClearedFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearedFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearedFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
