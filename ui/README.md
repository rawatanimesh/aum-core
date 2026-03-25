# @aum/ui — AUM Core UI Components

Reusable, standalone Angular components built on Material Design 3. All components support light/dark theming, UI scaling (Compact/Default/Large), and responsive design out of the box.

## Import paths

```typescript
import { ButtonComponent }              from '@aum/ui/buttons';
import { InputComponent }               from '@aum/ui/form-controls/input';
import { CheckboxComponent }            from '@aum/ui/form-controls/checkbox';
import { RadioButtonComponent }         from '@aum/ui/form-controls/radio-button';
import { SelectBoxComponent }           from '@aum/ui/form-controls/select-box';
import { DatePickerComponent }          from '@aum/ui/form-controls/date-picker';
import { AutocompleteComponent }        from '@aum/ui/form-controls/autocomplete';
import { PageComponent }                from '@aum/ui/layout/page';
import { CardComponent }                from '@aum/ui/layout/card';
import { BreadcrumbComponent }          from '@aum/ui/navigation/breadcrumb';
import { MenuListComponent, MenuList }  from '@aum/ui/navigation';
import { ConfirmationDialogComponent }  from '@aum/ui/dialogs/confirmation-dialog';
import { GenericDialogComponent }       from '@aum/ui/dialogs/generic-dialog';
import { SnackbarService }              from '@aum/ui/utilities/snackbar';
import { SpinnerComponent }             from '@aum/ui/utilities/spinner';
import { UploadBoxComponent }           from '@aum/ui/utilities/upload-box';
```

## Component overview

### Buttons & Actions

| Component | Selector | Key inputs |
|-----------|----------|------------|
| `ButtonComponent` | `<aum-button>` | `type` (filled/outlined/basic/icon), `value`, `icon`, `disabled`, `tooltip` |
| `MenuListComponent` | `<aum-menu-list>` | `list: MenuItem[]` — outputs `(itemSelected)` |

### Form Controls

| Component | Selector |
|-----------|----------|
| `InputComponent` | `<aum-input>` |
| `CheckboxComponent` | `<aum-checkbox>` |
| `RadioButtonComponent` | `<aum-radio-button>` |
| `SelectBoxComponent` | `<aum-select-box>` |
| `DatePickerComponent` | `<aum-date-picker>` |
| `AutocompleteComponent` | `<aum-autocomplete>` |

### Layout & Navigation

| Component | Selector | Notes |
|-----------|----------|-------|
| `PageComponent` | `<aum-page>` | Content projection via `aum-page-body` attribute |
| `CardComponent` | `<aum-card>` | Content projection via `card-header`, `card-body`, `card-footer` |
| `BreadcrumbComponent` | `<aum-breadcrumb>` | |

### Dialogs & Feedback

| Component / Service | Notes |
|---------------------|-------|
| `ConfirmationDialogComponent` | Open via `MatDialog.open()` |
| `GenericDialogComponent` | Content projection via `dialog-header`, `dialog-body`, `dialog-footer` |
| `SnackbarService` | `success()`, `error()`, `info()`, `warning()` |
| `SpinnerComponent` | Page-level and element-level loading states |
| `UploadBoxComponent` | File upload with drag-and-drop |

## Usage example

```typescript
@Component({
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  template: `
    <aum-card>
      <div card-body>
        <aum-button type="filled" value="Save" (buttonClick)="save()"></aum-button>
      </div>
    </aum-card>
  `,
})
export class MyComponent {}
```

## Styling requirements

All component SCSS files must include:

```scss
@use 'functions' as *;

.my-component {
  padding: rem(16);                    // rem() — never px
  color: var(--mat-sys-on-surface);    // Material system variable — never #hex
}
```

See [BEST_PRACTICES.md](../../../../BEST_PRACTICES.md) for the full styling guide.

## Running tests

```bash
nx test aum-core-ui
```
