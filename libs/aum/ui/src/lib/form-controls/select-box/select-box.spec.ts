import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectBox } from './select-box';

describe('SelectBox', () => {
  let component: SelectBox;
  let fixture: ComponentFixture<SelectBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBox],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
