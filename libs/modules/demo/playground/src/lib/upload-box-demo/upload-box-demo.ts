import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

import { PageComponent } from '@aum/ui/layout';
import { ButtonComponent } from '@aum/ui/buttons';
import { UploadBoxComponent, UploadedFile, FileUploadState, maxFilesValidator, uploadsCompleteValidator } from '@aum/ui/form-controls';
import { SnackbarService } from '@aum/ui/utilities';

@Component({
  selector: 'demo-upload-box',
  imports: [
    PageComponent,
    ButtonComponent,
    UploadBoxComponent,
    MatDividerModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './upload-box-demo.html',
  styleUrl: './upload-box-demo.scss',
})
export class UploadBoxDemo implements OnInit {
  private fb = inject(FormBuilder);
  private snackbar = inject(SnackbarService);

  pageInfo = {
    breadcrumbs: [
      { title: 'PLAYGROUND', route: '/playground' },
      { title: 'Upload Box', route: '/playground/upload-box' },
    ],
  };

  uploadForm!: FormGroup;
  standaloneFiles: UploadedFile[] = [];
  singleFileMode: UploadedFile[] = [];
  uploadedDocuments: UploadedFile[] = [];

  get documentsControl() {
    return this.uploadForm?.get('documents') as FormControl<UploadedFile[] | null>;
  }

  get requiredUploadControl() {
    return this.uploadForm?.get('requiredUpload') as FormControl<UploadedFile[] | null>;
  }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      documents: [null, [Validators.required, maxFilesValidator(5)]],
      images: [null, [maxFilesValidator(10)]],
      profilePicture: [null],
      requiredUpload: [null, [Validators.required, uploadsCompleteValidator()]],
    });
  }

  customFileValidator = (file: File): string | null => {
    if (file.name.toLowerCase().includes('temp')) {
      return 'Files with "temp" in the name are not allowed';
    }
    return null;
  };

  mockUpload(_file: File): Observable<HttpEvent<unknown>> {
    return new Observable((observer) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;

        if (progress <= 100) {
          observer.next({
            type: 1, // HttpEventType.UploadProgress
            loaded: progress,
            total: 100,
          } as HttpEvent<unknown>);
        }

        if (progress === 100) {
          clearInterval(interval);
          observer.next({
            type: 4, // HttpEventType.Response
            body: { success: true, fileId: Math.random().toString(36) },
          } as HttpEvent<unknown>);
          observer.complete();
        }
      }, 300);
    });
  }

  onFilesSelected(files: UploadedFile[]): void {
    console.log('Files selected:', files);
    this.snackbar.info(`${files.length} files selected`);
  }

  onFileRemoved(file: UploadedFile): void {
    console.log('File removed:', file.name);
    this.snackbar.info(`${file.name} removed`);
  }

  onUploadComplete(file: UploadedFile): void {
    console.log('Upload complete:', file.name);
    this.snackbar.success(`${file.name} uploaded successfully`);
  }

  onUploadError(event: { file: UploadedFile; error: unknown }): void {
    console.error('Upload error:', event);
    this.snackbar.error(`Failed to upload ${event.file.name}`);
  }

  onUploadProgress(event: { file: UploadedFile; progress: number }): void {
    console.log(`Upload progress: ${event.file.name} - ${event.progress}%`);
  }

  onValidationError(error: string): void {
    this.snackbar.error(error);
  }

  submitUploadForm(): void {
    if (this.uploadForm.valid) {
      console.log('Form submitted:', this.uploadForm.value);
      this.snackbar.success('All files uploaded successfully!');
    } else {
      this.snackbar.error('Please complete all required uploads');
    }
  }

  uploadStandaloneFiles(): void {
    if (!this.standaloneFiles?.length) {
      this.snackbar.error('Please select files to upload');
      return;
    }

    const filesToUpload = this.standaloneFiles.filter(
      (f) => f.state !== FileUploadState.SUCCESS && f.state !== FileUploadState.UPLOADING
    );

    if (!filesToUpload.length) {
      this.snackbar.info('All files are already uploaded');
      return;
    }

    this.snackbar.info(`Uploading ${filesToUpload.length} file(s)...`);

    filesToUpload.forEach((fileObj) => {
      if (fileObj.file) {
        fileObj.state = FileUploadState.UPLOADING;
        this.mockUpload(fileObj.file).subscribe({
          next: (event: HttpEvent<unknown>) => {
            if (event.type === 1) {
              const progressEvent = event as { loaded: number; total: number };
              fileObj.progress = (progressEvent.loaded / progressEvent.total) * 100;
            } else if (event.type === 4) {
              fileObj.state = FileUploadState.SUCCESS;
              fileObj.progress = 100;
              this.snackbar.success(`${fileObj.name} uploaded successfully`);
            }
          },
          error: (error) => {
            fileObj.state = FileUploadState.ERROR;
            fileObj.error = 'Upload failed';
            this.snackbar.error(`Failed to upload ${fileObj.name}`);
            console.error('Upload error:', error);
          },
        });
      }
    });
  }

  uploadRequiredFiles(): void {
    const files = this.requiredUploadControl?.value;

    if (!files?.length) {
      this.snackbar.error('Please select files to upload');
      return;
    }

    const filesToUpload = files.filter(
      (f) => f.state !== FileUploadState.SUCCESS && f.state !== FileUploadState.UPLOADING
    );

    if (!filesToUpload.length) {
      this.snackbar.info('All files are already uploaded');
      return;
    }

    this.snackbar.info(`Uploading ${filesToUpload.length} file(s)...`);

    filesToUpload.forEach((fileObj) => {
      if (fileObj.file) {
        fileObj.state = FileUploadState.UPLOADING;
        this.mockUpload(fileObj.file).subscribe({
          next: (event: HttpEvent<unknown>) => {
            if (event.type === 1) {
              const progressEvent = event as { loaded: number; total: number };
              fileObj.progress = (progressEvent.loaded / progressEvent.total) * 100;
            } else if (event.type === 4) {
              fileObj.state = FileUploadState.SUCCESS;
              fileObj.progress = 100;
              this.snackbar.success(`${fileObj.name} uploaded successfully`);
              const currentFiles = this.requiredUploadControl.value;
              this.requiredUploadControl.setValue([...(currentFiles || [])]);
              this.requiredUploadControl.updateValueAndValidity();
            }
          },
          error: (error) => {
            fileObj.state = FileUploadState.ERROR;
            fileObj.error = 'Upload failed';
            this.snackbar.error(`Failed to upload ${fileObj.name}`);
            console.error('Upload error:', error);
            const currentFiles = this.requiredUploadControl.value;
            this.requiredUploadControl.setValue([...(currentFiles || [])]);
            this.requiredUploadControl.updateValueAndValidity();
          },
        });
      }
    });
  }
}
