import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlideToggleDemo } from './slide-toggle-demo';

describe('SlideToggleDemo', () => {
  let component: SlideToggleDemo;
  let fixture: ComponentFixture<SlideToggleDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideToggleDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideToggleDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
