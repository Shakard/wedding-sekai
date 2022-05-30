import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { GuestSeatComponent } from './guest-seat/guest-seat.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FileUploadModule } from 'primeng/fileupload';
import { DataComponent } from './data/data.component';


@NgModule({
  declarations: [    
    GuestSeatComponent, GalleryComponent, DataComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    FileUploadModule
  ]
})
export class PublicModule { }
