import { Component, OnInit } from '@angular/core';

import { Arquivo } from './../models/arquivos';
import { ArquivosctService } from './../service/arquivosct.service';

@Component({
  selector: 'app-form-filect',
  templateUrl: './form-filect.component.html',
  styleUrls: ['./form-filect.component.scss']
})
export class FormFilectComponent implements OnInit {

  arquivo: Arquivo;
  success: boolean = false;
  errors: null|String[] = [];

  constructor(private service: ArquivosctService) {
    this.arquivo = new Arquivo();
  }

  ngOnInit(): void { }

  onSubmit(){
    this.service
      .salvar(this.arquivo)
      .subscribe( response => {
        this.success = true;
        this.errors = null;
        this.arquivo = response;
      }, errorResponse => {
        this.success = false;
        this.errors = errorResponse.error.errors;
      })
  }

}
