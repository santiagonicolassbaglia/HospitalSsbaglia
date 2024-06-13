// captcha.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private captchaUrl = 'API_ENDPOINT_FOR_CAPTCHA';  // URL del backend para obtener el captcha

  constructor(private http: HttpClient) {}

  getCaptcha(): Observable<any> {
    return this.http.get<any>(this.captchaUrl);
  }

  validateCaptcha(captchaToken: string, userInput: string): Observable<any> {
    const url = `${this.captchaUrl}/validate`;  // URL del backend para validar el captcha
    return this.http.post<any>(url, { token: captchaToken, input: userInput });
  }
}
