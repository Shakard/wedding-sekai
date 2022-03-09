import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { Chair } from 'src/app/models/table-management/chair';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import { SweetMessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user/user.service';
import { PanZoomConfig, PanZoomConfigOptions } from 'ngx-panzoom';
import panzoom from "panzoom";

// import('src/assets/myJS/canvas.js');


@Component({
  selector: 'app-guest-seat',
  templateUrl: './guest-seat.component.html',
  styleUrls: ['./guest-seat.component.scss']
})
export class GuestSeatComponent implements OnInit {
  //=======================panzoom===========================
  @ViewChild('tableContainer', { static: false }) tableContainer: ElementRef;
  panZoomController;
  zoomLevels: number[];

  currentZoomLevel: number;

  //=========================================================

  subs = new Subscription();
  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 3,
    scalePerZoomLevel: 1.8,
    neutralZoomLevel: 2,
    zoomStepDuration: 0.2,
    freeMouseWheelFactor: 0.01,
    zoomToFitZoomLevelFactor: 0.9,
    dragMouseButton: 'right'
  };
  panZoomConfig: PanZoomConfig = new PanZoomConfig(this.panZoomConfigOptions);
  isToggled = {};
  isHovered = {};
  users: User[];
  chairs: Chair[];
  tables: TableGuest[];
  canvas: String[];

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
  }

  ngAfterViewChecked() {
    if (this.tables) {
      this.placeDiv(this.tables);      
    }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
    this.dragulaService.destroy("COLUMNS");
  }

  placeDiv(tables: TableGuest[]) {
    tables.forEach(table => {
      var x = table.pos_x;
      var y = table.pos_y;
      if (x != null && y != null) {
        var d = document.getElementById(table.id.toString());
        d.style.position = "relative";
        d.style.left = x + 'px';
        d.style.top = y + 'px';
      }
    });
  }

  dragEnd(event: CdkDragEnd) {
    this.spinner.show();    
    var id = event.source.element.nativeElement.id;
    var pos_x = event.source.getFreeDragPosition()['x'];
    var pos_y = event.source.getFreeDragPosition()['y'];
    var data = {id: id, pos_x: pos_x, pos_y:pos_y};

    this.userService.update('update-table-position', data).subscribe(response => {
      this.spinner.hide();
    });
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

  resetTablesPosition() {
    this.messageService.questionResetPosition({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.userService.get('reset-tables-position')
            .subscribe(response => {
              this.getTables();
              this.getGuests();
              this.spinner.hide();
            });
        }
      });
  }

  //=============================================================================================
  //===============================panzoom=======================================================
  //=============================================================================================

  zoom() {
    const isSmooth = false;
    const scale = this.currentZoomLevel;


    if (scale) {
      const transform = this.panZoomController.getTransform();
      const deltaX = transform.x;
      const deltaY = transform.y;
      const offsetX = scale + deltaX;
      const offsetY = scale + deltaY;

      if (isSmooth) {
        this.panZoomController.smoothZoom(0, 0, scale);
      } else {
        this.panZoomController.zoomTo(offsetX, offsetY, scale);
      }
    }

  }

  zoomToggle(zoomIn: boolean) {
    const idx = this.zoomLevels.indexOf(this.currentZoomLevel);
    if (zoomIn) {
      if (typeof this.zoomLevels[idx + 1] !== 'undefined') {
        this.currentZoomLevel = this.zoomLevels[idx + 1];
      }
    } else {
      if (typeof this.zoomLevels[idx - 1] !== 'undefined') {
        this.currentZoomLevel = this.zoomLevels[idx - 1];
      }
    }
    if (this.currentZoomLevel === 1) {
      this.panZoomController.moveTo(0, 0);
      this.panZoomController.zoomAbs(0, 0, 1);
    } else {
      this.zoom();
    }
  }

  ngAfterViewInit() {

    this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
    this.currentZoomLevel = this.zoomLevels[4];
    // panzoom(document.querySelector('#scene'));
    this.panZoomController = panzoom(this.tableContainer.nativeElement);
  }

  //================================================================
  //======================fin de panzoom============================
  //================================================================

}