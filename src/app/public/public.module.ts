import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { GuestSeatComponent } from './guest-seat/guest-seat.component';


@NgModule({
  declarations: [    
    GuestSeatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule
  ]
})
export class PublicModule { }
