import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DevToolsComponent } from './dev-tools.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    DevToolsComponent,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DevToolsComponent }
    ])
  ]
})
export class DevToolsModule { } 