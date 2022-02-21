import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth/user';
import { Chair } from 'src/app/models/table-management/chair';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-guest-seat',
  templateUrl: './guest-seat.component.html',
  styleUrls: ['./guest-seat.component.scss']
})
export class GuestSeatComponent implements OnInit {
  users: User[];
  tables: TableGuest[];
  chairs: Chair[];

  constructor(private userService: UserService,) { }

  ngOnInit(): void {
    this.getGuests();
    this.getTables();
    this.getChairs();
  }

  public getGuests() {
    this.userService.getGuests().subscribe(response => {
      this.users = response['data']
      console.log(this.users);
    });
  }

  getTables() {
    this.userService.getTables().subscribe(response => {
      this.tables = response['data'];
      console.log(this.tables);      
    });
  }

  getChairs() {
    this.userService.get('unique-chairs').subscribe(response => {
      this.chairs = response['data'];
      console.log(this.chairs);
    });
  }

}
