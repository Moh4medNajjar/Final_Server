import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletableServersComponent } from './deletable-servers.component';

describe('DeletableServersComponent', () => {
  let component: DeletableServersComponent;
  let fixture: ComponentFixture<DeletableServersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletableServersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletableServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
