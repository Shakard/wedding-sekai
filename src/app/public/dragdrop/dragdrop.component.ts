import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { Chair } from 'src/app/models/table-management/chair';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent implements OnInit {

  subs = new Subscription();
  users: User[];
  chairs: Chair[];
  tables: TableGuest[];

  constructor(public userService: UserService, private dragulaService: DragulaService) {

    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle",      
    });

    this.subs.add(this.dragulaService.drag("VAMPIRES")
      .subscribe(({ name, el, source }) => {
        // ...
      })
    );
    this.subs.add(this.dragulaService.drop("ITEMS")
      .subscribe(({ name, el, target, source, sibling }) => {
        console.log(this.tables);
      })
    );
    this.subs.add(this.dragulaService.dropModel("COLUMNS")
      .subscribe(({ name, el, source, item }) => {
        // console.log(item.id);        
      })
    );
    // some events have lots of properties, just pick the ones you need
    this.subs.add(this.dragulaService.dropModel("ITEMS")
      // WHOA
       .subscribe(({ name, el, target, source, sibling, sourceModel, targetModel, item }) => {
      //.subscribe(({ sourceModel, targetModel, item }) => {
        // console.log(item);
        
      })
    );

    // You can also get all events, not limited to a particular group
    this.subs.add(this.dragulaService.drop()
      .subscribe(({ name, el, target, source, sibling }) => {
        // ...
      })
    );
  }

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
    this.userService.getTablesAndUsers().subscribe(response => {
      this.tables = response['data']
    });
  }

  getChairs() {
    this.userService.getChairs().subscribe(response => {
      this.chairs = response['data']
    });
  }

  importData(tables: TableGuest[]) {
    this.userService.store('update-tables', { data: tables })
      .subscribe(response => {
        this.getGuests();
      });
  }

  saveChanges() {
    this.importData(this.tables);
  }

}
