import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth/user';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent implements OnInit {

  users: User[];
  tables: TableGuest[];

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.getGuests();
    this.getTables();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  public getGuests() {
    this.userService.getGuests().subscribe(response => {
      this.users = response['data']
      console.log(this.users);
    });
  }

  getTables() {
    this.userService.getTables().subscribe(response => {
      this.tables = response['data']
    });
  }

}
