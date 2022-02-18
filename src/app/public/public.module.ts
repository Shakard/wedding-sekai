import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { SeatComponent } from './seat/seat.component';
import { GuestSeatComponent } from './guest-seat/guest-seat.component';



@NgModule({
  declarations: [  
  
    SeatComponent, GuestSeatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule
  ]
})
export class PublicModule { }
