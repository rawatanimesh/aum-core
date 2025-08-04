import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputDemo } from './input-demo';

describe('InputDemo', () => {
  let component: InputDemo;
  let fixture: ComponentFixture<InputDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
