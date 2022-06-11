import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';



import { Arquivo } from './../models/arquivos';
import { ArquivosctService } from './../service/arquivosct.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-list-filect',
  templateUrl: './list-filect.component.html',
  styleUrls: ['./list-filect.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ListFilectComponent implements OnInit, AfterViewInit {

  totalElements?: number = 0;
  arquivos: Arquivo[] = [];
  dtInicial?: string;
  dtFinal?: string;
  numEntrega?: string;
  dataSource1!: MatTableDataSource<Arquivo>;
  selection = new SelectionModel<Arquivo>(true, []);
  isShowFilterInput = false;
  search?: string;

  ELEMENT_DATA: Arquivo[] = [];
  isLoading = false;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 100];

  displayedColumns = [
    'select', 'id_caixa', 'periodo_ini', 'periodo_fim', 'filiais', 'endereco', 'doc_01', 'doc_02', 'doc_03',
     'printed', 'download']
    dataSource = new MatTableDataSource<Arquivo>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private arquivosctService: ArquivosctService, private toastr: ToastrService ) { }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.getAllarquivos();
    this.dataSource1 = new MatTableDataSource<Arquivo>(this.arquivos);

  }

  public getAllarquivos(){
    let resp = this.arquivosctService.listarArquivosct();
    resp.subscribe(report=>this.dataSource.data=report as Arquivo[])
  }

  generate(){
    if(!this.validateDates()){
      return;
    }
    const params = this.getParams();

    this.isLoading = true
    this.arquivosctService.getArquivos(params)
    .pipe(
      tap( (data: any) => {
        this.dataSource1.data = data.content;
        this.totalElements = data.totalElements;

        this.paginator.pageIndex = data.pageable.pageNumber;
        this.paginator.length = data.content.length;
      }),
      tap(f => {
        this.isLoading = false
      }),
      catchError(err => this.getError(err)
      ),
    )
    .subscribe();
  }

  validateDates() : boolean {
    let isValid = true;
    if(this.dtInicial && !this.dtFinal){
      this.toastr.error('Campo data final é obrigatório');
      isValid = false;
    }
    if(this.dtFinal && !this.dtInicial){
      this.toastr.error('Campo data inicial é obrigatório');
      isValid = false;
    }

    return isValid;
  }

  pageChanged(event: PageEvent) {

    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    this.nextPage();
  }

  nextPage(){
    const params = this.getParams();

    this.isLoading = true
    this.arquivosctService.getArquivos(params)
    .pipe(
      tap( (data: any) => {
        this.dataSource1.data = data.content;

        this.paginator.pageIndex = data.pageable.pageNumber;
        this.paginator.length = data.totalElements;
      }),
      tap(f => {
        this.isLoading = false;
      }),
      catchError(err => this.getError(err)
      ),
    )
    .subscribe();
  }

  getError(error: any): any{
    this.isLoading = false;
    this.toastr.error(error.message, error.status)
    return error;
  }

  getParams(): object{
    return {
      dataEntregaIni: this.dtInicial || '',
      dataEntregaFim: this.dtFinal || '',
      deliveryNumber: this.numEntrega || '',
      size: this.pageSize,
      page: this.currentPage
    };
  }

  cleanFilters(){
    this.dataSource1.filter = '';
    this.search = '';
  }

  download(){
    if(this.selection.selected.length == 0){
      this.toastr.error('É necessário selecionar ao menos um item.');
      return;
    }

    this.selection.selected.length == 1
    ? this.downloadOne(this.selection.selected[0].id_caixa)
    : this.downloadAll();

    this.selection.clear();
  }

  downloadOne(id_caixa: number){
    this.arquivosctService.downloadOne(id_caixa).subscribe( data => {
      this.zip(data);
    });
  }

  downloadAll(){
    const ids = this.selection.selected.map( s => s.id_caixa);
    this.arquivosctService.download(ids).subscribe(data => {
      this.zip(data);
    });
  }

  zip( data: any){
      let downloadURL = window.URL.createObjectURL(data);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "template.zpl";
      link.click();
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  applyFilter(): void {
    if(this.search){
      this.dataSource.filter = this.search.trim().toLowerCase();
    }
  }

  downloadRow(row: Arquivo){
    this.downloadOne(row.id_caixa);
  }

  printed(row: any){
    return row.printed ? 'Impresso' : 'Não impresso';
  }

  tooltipProduct(row: any){
    return row.productDescription.length > 30
      ? row.productDescription
      : '';
  }

  productDescription(description: string){
    return description.length > 30
      ? description.substring(0, 30)
      : description;
  }


}
