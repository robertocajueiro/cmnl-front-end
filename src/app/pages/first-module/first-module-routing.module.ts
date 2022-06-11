import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFileComponent } from './list-file/list-file.component';
import { ListFilectComponent } from './list-filect/list-filect.component';
import { FormFilectComponent } from './form-filect/form-filect.component';

const routes: Routes = [
  {
    path: 'list-file',
    component: ListFileComponent
  },
  {
    path: 'list-filect',
    component: ListFilectComponent
  }
  ,
  {
    path: 'form-filect',
    component: FormFilectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FirstModuleRoutingModule { }
