import { Injectable, inject } from '@angular/core';
 import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
 
import { SpinnerService } from '../services/spinner.service';

 
export const SpinnerInterceptor = class SpinnerInterceptor implements HttpInterceptor {
    constructor(private readonly spinnerSvc = inject(SpinnerService)) {}
     
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.spinnerSvc.show();
        return next.handle(req).pipe(finalize(() => this.spinnerSvc.hide()));
    }
    }
    