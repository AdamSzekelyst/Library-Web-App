import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateBookComponent } from './update-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UpdateBookComponent', () => {
  let component: UpdateBookComponent;
  let fixture: ComponentFixture<UpdateBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        UpdateBookComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.bookForm.get('title')?.value).toBe('');
    expect(component.bookForm.get('author')?.value).toBe('');
    expect(component.bookForm.get('category')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.bookForm;
    expect(form.valid).toBeFalsy();

    form.controls['title'].setValue('Test Title');
    form.controls['author'].setValue('Test Author');
    form.controls['category'].setValue('Test Category');

    expect(form.valid).toBeTruthy();
  });

  it('should validate title minlength', () => {
    const titleControl = component.bookForm.controls['title'];
    titleControl.setValue('a');
    expect(titleControl.errors?.['minlength']).toBeTruthy();

    titleControl.setValue('ab');
    expect(titleControl.errors?.['minlength']).toBeFalsy();
  });
});
