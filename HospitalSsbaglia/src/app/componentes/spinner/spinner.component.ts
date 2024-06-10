// spinner.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']  // <- Correction here
})
export class SpinnerComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  private subscription: Subscription;

  constructor(private loadingService: SpinnerService) {}

  ngOnInit() {
    this.subscription = this.loadingService.loading$.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
