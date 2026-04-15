import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { ButtonComponent } from '@aum/ui/buttons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ui-lab-code-block',
  imports: [ButtonComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  @Input() code = '';
  @Input() language = 'typescript';

  copied = signal(false);

  copy(): void {
    navigator.clipboard.writeText(this.code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
