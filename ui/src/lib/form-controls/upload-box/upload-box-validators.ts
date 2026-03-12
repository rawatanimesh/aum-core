import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UploadedFile, FileUploadState } from './upload-box';

/**
 * Validator that requires at least one file to be selected
 */
export function filesRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as UploadedFile[] | null;
    return !files || files.length === 0 ? { required: true } : null;
  };
}

/**
 * Validator that enforces a maximum number of files
 */
export function maxFilesValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as UploadedFile[] | null;
    if (files && files.length > max) {
      return { maxFiles: `Maximum ${max} files allowed` };
    }
    return null;
  };
}

/**
 * Validator that checks if file types are in the accepted list
 */
export function fileTypeValidator(acceptedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as UploadedFile[] | null;
    if (!files || files.length === 0) return null;

    const invalidFiles = files.filter((file) => {
      return !acceptedTypes.some((type) => {
        if (type === '*/*') return true;
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.split('/')[0] + '/');
        }
        return file.type === type;
      });
    });

    return invalidFiles.length > 0 ? { fileType: `Invalid file types` } : null;
  };
}

/**
 * Validator that checks if files exceed maximum size
 */
export function fileSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as UploadedFile[] | null;
    if (!files || files.length === 0) return null;

    const oversizedFiles = files.filter((file) => file.size > maxSize);

    return oversizedFiles.length > 0
      ? { fileSize: `Files exceed maximum size` }
      : null;
  };
}

/**
 * Validator that ensures all uploads are complete (no pending or uploading files)
 */
export function uploadsCompleteValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value as UploadedFile[] | null;
    if (!files || files.length === 0) return null;

    const pendingFiles = files.filter(
      (f) =>
        f.state === FileUploadState.PENDING ||
        f.state === FileUploadState.UPLOADING
    );

    return pendingFiles.length > 0
      ? { uploadsIncomplete: `${pendingFiles.length} file(s) not uploaded` }
      : null;
  };
}
