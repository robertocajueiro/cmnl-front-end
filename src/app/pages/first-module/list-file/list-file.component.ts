import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, tap } from 'rxjs';
import { Tag } from '../models/tag';
import { TagService } from '../service/tag.service';

@Component({
  selector: 'app-list-file',
  templateUrl: './list-file.component.html',
  styleUrls: ['./list-file.component.scss']
})
export class ListFileComponent implements OnInit, AfterViewInit {

  dtInicial?: string;
  dtFinal?: string;
  numEntrega?: string;
  tags: Tag[] = [];
  dataSource!: MatTableDataSource<Tag>;
  selection = new SelectionModel<Tag>(true, []);
  isShowFilterInput = false;
  totalElements?: number = 0;
  search?: string;

  ELEMENT_DATA: Tag[] = [];
  isLoading = false;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  
  displayedColumns: string[] = ['select', 'id','orderCode', 'volume',
                                'orderVolumetry', 'deliveryNumber', 'productCode', 
                                'productDescription','inclusionDate','invoiceDate', 
                                'clientName', 'printed', 'download'];


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private tagService: TagService, 
              private toastr: ToastrService) { }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Tag>(this.tags);
  }

  generate(){
    if(!this.validateDates()){
      return;
    }
    const params = this.getParams();
  
    this.isLoading = true
    this.tagService.getTags(params)
    .pipe(
      tap( data => {
        this.dataSource.data = data.content;
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
    this.tagService.getTags(params)
    .pipe(
      tap( data => {
        this.dataSource.data = data.content;
        
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
    this.dataSource.filter = '';
    this.search = '';
  }

  download(){
    if(this.selection.selected.length == 0){
      this.toastr.error('É necessário selecionar ao menos um item.');
      return;
    }

    this.selection.selected.length == 1 
    ? this.downloadOne(this.selection.selected[0].id)
    : this.downloadAll();

    this.selection.clear();
  }

  downloadOne(id: number){
    this.tagService.downloadOne(id).subscribe( data => {
      this.zip(data);
    });    
  }

  downloadAll(){
    const ids = this.selection.selected.map( s => s.id);
    this.tagService.download(ids).subscribe(data => {
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

  downloadRow(row: Tag){
    this.downloadOne(row.id);
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

