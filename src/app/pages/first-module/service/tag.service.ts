import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, retry, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { Tag } from "../models/tag";

@Injectable({
  providedIn: 'root'
})

export class TagService {

  private path: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTags(params?: any): Observable<any>{

    const querys = { params: new HttpParams({fromObject: params}) };
  
      const url = `${this.path}shipping-tag`;
      return this.http.get(url, querys).pipe(retry(1), catchError(this.handleError))
  }

  downloadOne(id: number){
    const url = `${this.path}shipping-tag/${id}/download`;
    return this.http.get(url, {responseType: 'blob'})
    .pipe(retry(1), catchError(this.handleError));
  }

  download(list: number[]){
    const url = `${this.path}shipping-tag/download`;
    return this.http.post(url, list, {responseType: 'blob'})
    .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      //window.alert(errorMessage);
      return throwError(() => {
        return error;
      });
  }
}