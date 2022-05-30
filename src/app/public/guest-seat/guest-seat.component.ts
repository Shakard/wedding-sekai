import * as $ from 'jquery'
import 'jqueryui';
import { Component, OnInit } from '@angular/core';
import { CanvasElement } from 'src/app/models/table-management/canvas-element';
import { UserService } from 'src/app/services/user/user.service';
// declare let $: any


@Component({
  selector: 'app-guest-seat',
  templateUrl: './guest-seat.component.html',
  styleUrls: ['./guest-seat.component.scss']
})

export class GuestSeatComponent implements OnInit {


  constructor(public userService: UserService,) { }

  ngOnInit() {

  }  
}