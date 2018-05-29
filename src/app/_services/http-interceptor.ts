import { Injectable, Injector } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // clone the request and add the new header
    let modifiedReq = req.clone({
      setHeaders: {
        "Content-Type": "application/json"
      }
    });

    return next
      // pass on the modified request
      .handle(modifiedReq)
      // intercept response
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          // process response
        }
      })
      // intercept request errors
      .catch(response => {
        if (response instanceof HttpErrorResponse) {
          // process error
        }

        return Observable.throw(response);
      });
  }

}
