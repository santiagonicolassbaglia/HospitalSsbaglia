import { NgIf } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {
  captchaForm: FormGroup;
  captchaQuestion: string;
  private captchaAnswer: number;
  captchaValid: boolean | null = null;

  @Output() captchaResolved = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {
    this.captchaForm = this.fb.group({
      captchaResponse: ['', [Validators.required]]
    });

    this.generateCaptcha();
  }

  ngOnInit(): void {
    this.captchaForm.get('captchaResponse')?.valueChanges.subscribe(value => {
      this.validateCaptcha(value);
    });
  }

  generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    this.captchaQuestion = `${num1} + ${num2}`;
    this.captchaAnswer = num1 + num2;
  }

  validateCaptcha(response: string) {
    if (parseInt(response) === this.captchaAnswer) {
      this.captchaValid = true;
      this.captchaResolved.emit(true);
    } else {
      this.captchaValid = false;
      this.captchaResolved.emit(false);
    }
  }
}
