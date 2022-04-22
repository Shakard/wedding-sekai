import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Image } from 'src/app/models/table-management/image';
import { SweetMessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  docs: File;
  images: Image[] = [];
  length: any;
  headers = new HttpHeaders(
    {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  );

  constructor(
    private userService: UserService,
    private messageService: SweetMessageService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.getImages();
  }

  public getImages() {    
    this.userService.get('images').subscribe(response => {
      this.images = response['data']
    });
  }
  
  //Método del p-fileUpload para subir archivos
  onUpload(event) {
    this.spinner.show();
    for(let file of event.files) {
        this.images.push(file);
    }
    // this.messageService.successAddChair();s
    this.getImages();
}

  //Método custom para subir archivos
  myUploader(event) {
    const formdata = new FormData;
    console.log(event.files);    
    this.docs = <File>event.files;
    this.length = <File>event.files.length;

    for (let i = 0; i < this.length; i++) {
      formdata.append('images' + [i], this.docs[i], this.docs[i].name);
      formdata.append('length', this.length);
    }  
    this.storeFile(formdata);
  }

  storeFile(data: any) {
    this.userService.store('upload-images', data)
      .subscribe({
        next: () => this.getImages()
        // next: () => this.messageService.successConfirmation(),
        // error: (response) => this.messageService.errorUploadFile(response.error.errors.image),
        // complete: () => this.resetForm()
      });
  }

}
