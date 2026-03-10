import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericDialogDemo } from './generic-dialog-demo';

describe('GenericDialogDemo', () => {
  let component: GenericDialogDemo;
  let fixture: ComponentFixture<GenericDialogDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDialogDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericDialogDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
