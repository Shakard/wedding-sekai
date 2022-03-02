import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { Chair } from 'src/app/models/table-management/chair';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import { SweetMessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent implements OnInit {

  subs = new Subscription();
  isToggled = {};
  users: User[];
  chairs: Chair[];
  tables: TableGuest[];
  canvas: String[];
  dropPosition = {x: 0, y: 0};

  constructor(
    public userService: UserService,
    private dragulaService: DragulaService,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService
  ) {

    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle"
    });

    this.subs.add(this.dragulaService.dropModel("SPILL")
      .subscribe(({ target, item }) => {
        if (target.id != 'mesas') {
          this.clearGuest(item.id);
        }
      })
    );

    this.subs.add(this.dragulaService.drag("VAMPIRES")
      .subscribe(({ name, el, source }) => {
        // ...
      })
    );
    this.subs.add(this.dragulaService.drop("SPILL")
      .subscribe(({ name, el, target, source, sibling }) => {
        this.saveChanges();
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
    this.canvas = JSON.parse(localStorage.getItem('canvas'));
  }

  dragEnd(event: CdkDragEnd) {
    console.log(event.dropPoint);
    let myStorage = window.localStorage;    
    myStorage.setItem("canvas", JSON.stringify(event.dropPoint));
  }

  public onHoverOut($i) {
    this.isToggled[$i] = false;       
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

  clearGuest(id: number) {
    this.spinner.show();
    this.userService.update('clear-user-table-id/' + id, { id }).subscribe(response => {
      this.spinner.hide();
    });
  }

  updateTables(tables: TableGuest[]) {
    this.spinner.show();
    this.userService.store('update-tables', { data: tables })
      .subscribe(response => {
        this.getTables();
        this.getGuests();
        this.spinner.hide();
      });
  }

  saveChanges() {
    this.updateTables(this.tables);
  }

  clearAllUsers() {
    this.messageService.questionClearTables({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.spinner.show();
          this.userService.get('clear-all-table-id')
            .subscribe(response => {
              this.getTables();
              this.getGuests();
              this.spinner.hide();
            });
        }
      });
  }

}
