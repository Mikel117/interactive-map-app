import { Component, input, OnInit, output } from '@angular/core';
import { CircleButtonComponent } from '../../atoms/circle-button/circle-button.component';

@Component({
  standalone: true,
  imports: [CircleButtonComponent],
  selector: 'app-titles',
  templateUrl: 'titles.component.html',
  styleUrls: ['titles.component.scss'],
})
export class TitlesComponent implements OnInit {
  isBlackButtonShown = input<boolean>(false);
  onClickBackButton = output<void>();

  onBlackButtonClick() {
    this.onClickBackButton.emit();
  }

  ngOnInit() {}
}
