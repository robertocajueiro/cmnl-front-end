import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirstModuleRoutingModule } from './first-module-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ListFileComponent } from './list-file/list-file.component';
import { ListFilectComponent } from './list-filect/list-filect.component';
import { HomeComponent } from './home/home.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { FormFilectComponent } from './form-filect/form-filect.component';

@NgModule({
  declarations: [
    ListFileComponent,
    ListFilectComponent,
    HomeComponent,
    FormFilectComponent
  ],
  imports: [
    CommonModule,
    FirstModuleRoutingModule,
    SharedModule,
    MatToolbarModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatSortModule,
    NgxMaskModule.forRoot()
  ]
})
export class FirstModuleModule { }
