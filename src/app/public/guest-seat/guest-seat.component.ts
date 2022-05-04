import { Component } from '@angular/core';
import { CanvasElement } from 'src/app/models/table-management/canvas-element';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-guest-seat',
  templateUrl: './guest-seat.component.html',
  styleUrls: ['./guest-seat.component.scss']
})

export class GuestSeatComponent {

  constructor(public userService: UserService,) { }

  ngOnInit() {
  }  
}