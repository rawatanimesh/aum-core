import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  SimpleChanges,
  inject,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  NgControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Icon } from '../../utilities/icon/icon';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../buttons/button/button.component';
import { AumErrorStateMatcher } from '../input/input';

/**
 * Upload state for individual files
 */
export enum FileUploadState {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
}

/**
 * File metadata with upload progress
 */
export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  state: FileUploadState;
  progress: number;
  error?: string;
  addedAt?: Date;
}

/**
 * Upload configuration
 */
export interface FileUploadConfig {
  url?: string;
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: { [key: string]: string };
  fieldName?: string;
  withCredentials?: boolean;
}

@Component({
  selector: 'aum-upload-box',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    Icon,
    ButtonComponent,
    TranslateModule,
  ],
  templateUrl: './upload-box.html',
  styleUrl: './upload-box.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'UploadBoxComponent',
  standalone: true,
})
export class UploadBoxComponent implements OnInit, OnChanges, OnDestroy {
  // Expose enum to template
  FileUploadState = FileUploadState;

  // ViewChild for file input
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Basic Configuration
  @Input() label = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() multiple = true;
  @Input() filetype = '';
  @Input() variant: 'default' | 'compact' = 'default';

  // File Validation
  @Input() accept = '*/*';

  private _maxFileSize = 10 * 1024 * 1024; // 10MB default
  @Input()
  set maxFileSize(value: number | string) {
    if (typeof value === 'string') {
      this._maxFileSize = this.parseFileSize(value);
    } else {
      this._maxFileSize = value;
    }
  }
  get maxFileSize(): number {
    return this._maxFileSize;
  }

  private _minFileSize = 0;
  @Input()
  set minFileSize(value: number | string) {
    if (typeof value === 'string') {
      this._minFileSize = this.parseFileSize(value);
    } else {
      this._minFileSize = value;
    }
  }
  get minFileSize(): number {
    return this._minFileSize;
  }

  @Input() maxFiles: number | null = null;
  @Input() customValidator?: (file: File) => string | null;

  // Display Options
  @Input() showPreview = true;
  @Input() autoUpload = false;
  @Input() showProgressBar = true;

  // Upload Configuration
  @Input() uploadConfig?: FileUploadConfig;
  @Input() uploadFn?: (file: File) => Observable<HttpEvent<any>>;

  // Forms Integration
  @Input() control?: FormControl<UploadedFile[] | null>;
  @Input() data: UploadedFile[] = [];
  @Input() customErrorMessages: { [key: string]: string } = {};

  // Outputs
  @Output() dataChange = new EventEmitter<UploadedFile[]>();
  @Output() filesSelected = new EventEmitter<UploadedFile[]>();
  @Output() fileRemoved = new EventEmitter<UploadedFile>();
  @Output() uploadStarted = new EventEmitter<UploadedFile>();
  @Output() uploadProgress = new EventEmitter<{
    file: UploadedFile;
    progress: number;
  }>();
  @Output() uploadComplete = new EventEmitter<UploadedFile>();
  @Output() uploadError = new EventEmitter<{ file: UploadedFile; error: any }>();
  @Output() validationError = new EventEmitter<string>();
  @Output() dragStateChange = new EventEmitter<boolean>();

  // Internal state
  internalFiles: UploadedFile[] = [];
  isDragging = false;
  matcher = new AumErrorStateMatcher();

  // Dependency injection
  private ngControl = inject(NgControl, { optional: true, self: true });
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = null;
    }
  }

  ngOnInit(): void {
    if (this.control) {
      const initialValue = this.control.value;
      if (initialValue && initialValue.length > 0) {
        this.internalFiles = initialValue;
      }

      this.control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          if (value && value !== this.internalFiles) {
            this.internalFiles = value;
            this.cdr.markForCheck();
          }
        });
    } else if (this.data && this.data.length > 0) {
      this.internalFiles = this.data;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] && this.control) {
      if (this.disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }

    if (changes['data'] && !this.control && this.data) {
      this.internalFiles = this.data;
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.internalFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }

  // File Selection Handlers
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      this.processFiles(filesArray);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled && !this.readonly) {
      this.isDragging = true;
      this.dragStateChange.emit(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.dragStateChange.emit(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.dragStateChange.emit(false);

    if (this.disabled || this.readonly) {
      return;
    }

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const filesArray = Array.from(event.dataTransfer.files);
      this.processFiles(filesArray);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if ((event.key === 'Enter' || event.key === ' ') && !this.disabled && !this.readonly) {
      event.preventDefault();
      this.fileInput.nativeElement.click();
    }
  }

  onBrowseClick(): void {
    if (!this.disabled && !this.readonly) {
      this.fileInput.nativeElement.click();
    }
  }

  // File Processing
  processFiles(files: File[]): void {
    if (this.maxFiles !== null) {
      const totalFiles = this.internalFiles.length + files.length;
      if (totalFiles > this.maxFiles) {
        const remaining = this.maxFiles - this.internalFiles.length;
        const errorMsg = `Maximum ${this.maxFiles} files allowed. ${this.internalFiles.length} already selected. You can add ${remaining} more.`;
        this.validationError.emit(errorMsg);
        return;
      }
    }

    const validFiles: UploadedFile[] = [];

    for (const file of files) {
      const error = this.validateFile(file);
      if (error) {
        this.validationError.emit(`${file.name}: ${error}`);
        continue;
      }

      const uploadedFile: UploadedFile = {
        file,
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        state: FileUploadState.PENDING,
        progress: 0,
        addedAt: new Date(),
      };

      if (this.showPreview && file.type.startsWith('image/')) {
        this.generatePreview(uploadedFile);
      }

      validFiles.push(uploadedFile);
    }

    if (validFiles.length > 0) {
      if (!this.multiple && this.internalFiles.length > 0) {
        this.internalFiles.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
        this.internalFiles = validFiles;
      } else {
        this.internalFiles = [...validFiles, ...this.internalFiles];
      }
      this.updateValue();
      this.filesSelected.emit(validFiles);

      if (this.autoUpload) {
        validFiles.forEach((file) => this.uploadFile(file));
      }
    }
  }

  validateFile(file: File): string | null {
    if (this.accept && this.accept !== '*/*') {
      if (!this.isFileTypeAccepted(file)) {
        return `File type '${file.type}' is not accepted`;
      }
    }

    if (file.size > this.maxFileSize) {
      return `File size exceeds maximum of ${this.formatFileSize(this.maxFileSize)}`;
    }

    if (file.size < this.minFileSize) {
      return `File size is below minimum of ${this.formatFileSize(this.minFileSize)}`;
    }

    if (this.customValidator) {
      return this.customValidator(file);
    }

    return null;
  }

  isFileTypeAccepted(file: File): boolean {
    const acceptTypes = this.accept.split(',').map((t) => t.trim());

    return acceptTypes.some((type) => {
      if (type === '*/*') return true;

      if (type.endsWith('/*')) {
        const mainType = type.split('/')[0];
        return file.type.startsWith(mainType + '/');
      }

      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }

      return file.type === type;
    });
  }

  generatePreview(uploadedFile: UploadedFile): void {
    if (uploadedFile.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      uploadedFile.preview = e.target?.result as string;
      this.cdr.markForCheck();
    };

    reader.onerror = () => {
      console.error('Failed to generate preview for:', uploadedFile.name);
    };

    reader.readAsDataURL(uploadedFile.file);
  }

  // File Management
  removeFile(fileId: string): void {
    const file = this.internalFiles.find((f) => f.id === fileId);
    if (file) {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }

      this.internalFiles = this.internalFiles.filter((f) => f.id !== fileId);
      this.updateValue();
      this.fileRemoved.emit(file);
    }
  }

  clearAll(): void {
    this.internalFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    this.internalFiles = [];
    this.updateValue();
  }

  retryUpload(fileId: string): void {
    const file = this.internalFiles.find((f) => f.id === fileId);
    if (file) {
      file.state = FileUploadState.PENDING;
      file.progress = 0;
      file.error = undefined;
      this.uploadFile(file);
    }
  }

  // Upload Logic
  uploadFile(uploadedFile: UploadedFile): void {
    uploadedFile.state = FileUploadState.UPLOADING;
    uploadedFile.progress = 0;
    this.uploadStarted.emit(uploadedFile);
    this.cdr.markForCheck();

    const upload$ = this.uploadFn
      ? this.uploadFn(uploadedFile.file)
      : this.defaultUpload(uploadedFile.file);

    upload$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total
            ? Math.round((100 * event.loaded) / event.total)
            : 0;
          uploadedFile.progress = progress;
          this.uploadProgress.emit({ file: uploadedFile, progress });
          this.cdr.markForCheck();
        } else if (event.type === HttpEventType.Response) {
          uploadedFile.state = FileUploadState.SUCCESS;
          uploadedFile.progress = 100;
          this.uploadComplete.emit(uploadedFile);
          this.updateValue();
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        uploadedFile.state = FileUploadState.ERROR;
        uploadedFile.error = error.message || 'Upload failed';
        this.uploadError.emit({ file: uploadedFile, error });
        this.cdr.markForCheck();
      },
    });
  }

  private defaultUpload(file: File): Observable<HttpEvent<any>> {
    if (!this.uploadConfig?.url) {
      throw new Error('Upload URL not configured');
    }

    const formData = new FormData();
    formData.append(this.uploadConfig.fieldName || 'file', file);

    return this.http.request(
      this.uploadConfig.method || 'POST',
      this.uploadConfig.url,
      {
        body: formData,
        headers: this.uploadConfig.headers,
        reportProgress: true,
        observe: 'events',
        withCredentials: this.uploadConfig.withCredentials,
      }
    );
  }

  uploadAllFiles(): void {
    const pendingFiles = this.internalFiles.filter(
      (f) => f.state === FileUploadState.PENDING
    );
    pendingFiles.forEach((file) => this.uploadFile(file));
  }

  // Value Management
  private updateValue(): void {
    const value = this.internalFiles.length > 0 ? this.internalFiles : null;

    if (this.control) {
      this.control.setValue(value);
      this.control.markAsDirty();
      this.control.markAsTouched();
    } else {
      this.data = this.internalFiles;
    }

    this.dataChange.emit(this.internalFiles);
  }

  // Utility Methods
  private parseFileSize(size: string): number {
    const sizeStr = size.trim().toLowerCase();
    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(kb|mb|gb|bytes?)?$/i);

    if (!match) {
      console.warn(`Invalid file size format: ${size}. Using default value.`);
      return 0;
    }

    const value = parseFloat(match[1]);
    const unit = match[2] || 'bytes';

    const multipliers: { [key: string]: number } = {
      'byte': 1,
      'bytes': 1,
      'kb': 1024,
      'mb': 1024 * 1024,
      'gb': 1024 * 1024 * 1024,
    };

    return value * (multipliers[unit] || 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  formatFileDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
  }

  getFileIconName(fileType: string): string {
    if (fileType === 'application/pdf') return 'picture_as_pdf';

    if (
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/vnd.ms-excel.sheet.macroEnabled.12'
    ) {
      return 'table_chart';
    }

    if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'description';
    }

    if (
      fileType === 'application/vnd.ms-powerpoint' ||
      fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      return 'slideshow';
    }

    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'videocam';
    if (fileType.startsWith('audio/')) return 'audiotrack';

    if (
      fileType === 'application/zip' ||
      fileType === 'application/x-rar-compressed' ||
      fileType === 'application/x-7z-compressed' ||
      fileType === 'application/x-tar' ||
      fileType === 'application/gzip'
    ) {
      return 'folder_zip';
    }

    if (fileType.startsWith('text/') || fileType === 'application/json') {
      return 'article';
    }

    return 'insert_drive_file';
  }

  hasFilesToUpload(): boolean {
    return this.internalFiles.some((f) => f.state === FileUploadState.PENDING);
  }

  getPendingFilesCount(): number {
    return this.internalFiles.filter((f) => f.state === FileUploadState.PENDING).length;
  }

  private generateId(): string {
    return `file-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }

  // Error Handling
  getErrorMessage(): string {
    if (this.control && this.control.errors) {
      const errors = this.control.errors;

      for (const key in this.customErrorMessages) {
        if (errors[key]) {
          return this.customErrorMessages[key];
        }
      }

      if (errors['required']) return 'Please select at least one file.';
      if (errors['maxFiles']) return errors['maxFiles'];
      if (errors['fileType']) return errors['fileType'];
      if (errors['fileSize']) return errors['fileSize'];
      if (errors['uploadsIncomplete']) return errors['uploadsIncomplete'];

      return 'Invalid input.';
    }
    return '';
  }

  get showError(): boolean {
    return (
      !!this.control &&
      this.control.invalid &&
      (this.control.dirty ||
        this.control.touched ||
        (this.control.parent?.touched ?? false))
    );
  }
}
