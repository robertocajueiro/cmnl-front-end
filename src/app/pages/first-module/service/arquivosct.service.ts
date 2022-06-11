import { catchError, Observable, retry, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Arquivo } from '../models/arquivos';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ArquivosctService {

  /* getArquivos(params: object) {
    throw new Error('Method not implemented.');
  } */


  constructor(private http: HttpClient ) { }

  salvar(arquivo: Arquivo) : Observable<Arquivo> {
    return this.http.post<Arquivo>('http://localhost:8080/api/arquivos', arquivo);
  }

  listarArquivosct(): Observable<any> {
    return this.http.get('http://localhost:8080/api/arquivos');
  }

  private path: string = environment.apiUrl;

  getArquivos(params?: any): Observable<any>{

    const querys = { params: new HttpParams({fromObject: params}) };

      const url = `${this.path}shipping-arquivo`;
      return this.http.get(url, querys).pipe(retry(1), catchError(this.handleError))
  }

  downloadOne(id_caixa: number){
    const url = `${this.path}shipping-arquivo/${id_caixa}/download`;
    return this.http.get(url, {responseType: 'blob'})
    .pipe(retry(1), catchError(this.handleError));
  }

  download(list: number[]){
    const url = `${this.path}shipping-arquivo/download`;
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
