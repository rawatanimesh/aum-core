import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AumTemplate } from './aum-template';

describe('AumTemplate', () => {
  let component: AumTemplate;
  let fixture: ComponentFixture<AumTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AumTemplate],
    }).compileComponents();

    fixture = TestBed.createComponent(AumTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
