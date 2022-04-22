import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Image } from 'src/app/models/table-management/image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SweetMessageService } from 'src/app/services/message.service';


@Component({
  selector: 'app-guest-seat',
  templateUrl: './guest-seat.component.html',
  styleUrls: ['./guest-seat.component.scss']
})

export class GuestSeatComponent {
  docs: File;
  images:Image[];
  length: any;


  responsiveOptions:any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '960px',
        numVisible: 4
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService
    ) { }

  ngOnInit() {
    this.getImages();
  }

  uploads(event) {
    this.docs = <File>event.target.files;
    this.length = <File>event.target.files.length;
  }

  public getImages() {    
    this.userService.get('images').subscribe(response => {
      this.images = response['data']
      console.log(this.images);
    });
  }

  storeFile(data: any) {
    this.userService.store('upload-images',  data )
      .subscribe({
        next: () => console.log(data)        
        // next: () => this.messageService.successConfirmation(),
        // error: (response) => this.messageService.errorUploadFile(response.error.errors.image),
        // complete: () => this.resetForm()
      });
  }

  deleteImage(id: any) {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.userService.delete('file/' + id)
            .subscribe(response => {
              this.getImages();              
              this.spinner.hide();
              this.messageService.success(response);
            }, error => {
              this.getImages();            
              this.spinner.hide();
              this.messageService.error(error);
            });
        }
      });
  }

  submitForm() {
    const formdata = new FormData;
    for (let i = 0; i < this.length; i++) {
      formdata.append('images' + [i], this.docs[i], this.docs[i].name);
      formdata.append('length', this.length);
        }
    console.log(formdata);
        
    this.storeFile(formdata);
  }




}