import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/auth/user';
import { Chair } from 'src/app/models/table-management/chair';
import { SweetMessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user/user.service';
import panzoom from "panzoom";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CanvasElement } from 'src/app/models/table-management/canvas-element';
import { Gender } from 'src/app/models/table-management/Gender';


@Component({
  selector: 'app-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent implements OnInit {
  //=======================panzoom variables============================
  @ViewChild('tableContainer', { static: false }) tableContainer: ElementRef;
  panZoomController;
  zoomLevels: number[];
  currentZoomLevel: number;

  //====================================================================

  subs = new Subscription();
  formCanvasElement: FormGroup;

  isToggled = {};
  isHovered = {};
  canvasElement: CanvasElement;
  canvasElements: CanvasElement[];
  users: User[];
  chairs: Chair[];
  tables: CanvasElement[];
  bathrooms: CanvasElement[];
  bands: CanvasElement[];
  bathroomDialog: boolean;
  genders: string[];

  constructor(
    public userService: UserService,
    private dragulaService: DragulaService,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService,
    private formBuilder: FormBuilder
  ) {
    this.genders = [
       'Baño de Damas',
      'Baño de Caballeros'
  ];

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

    this.subs.add(this.dragulaService.drop("SPILL")
      .subscribe(({ name, el, target, source, sibling }) => {
        this.saveChanges();
      })
    );
  }

  ngOnInit(): void {
    this.buildFormCanvasElement();
    this.getAllElements();
    this.getGuests();
    this.getTables();
    this.getBathrooms();
    this.getBands();
  }

  ngAfterViewInit() {
    //===================panzoom library==================================
    this.zoomLevels = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
    this.currentZoomLevel = this.zoomLevels[4];
    // this.panZoomController = panzoom(this.tableContainer.nativeElement);
    this.panZoomController = panzoom(this.tableContainer.nativeElement, {
      beforeWheel: function (e) {
        // allow wheel-zoom only if altKey is pressed. Otherwise - ignore
        var shouldIgnore = !e.ctrlKey;
        return shouldIgnore;
      },
      beforeMouseDown: function (e) {
        // allow wheel-zoom only if altKey is pressed. Otherwise - ignore
        var shouldIgnore = !e.ctrlKey;
        return shouldIgnore;
      },
      zoomDoubleClickSpeed: 1,
      maxZoom: 1,
      minZoom: 0.2,
      initialZoom: 0.9
    })
    // =======================================================================

  }

  ngAfterViewChecked() {
    if (this.tables) {
      this.placeDiv(this.tables);
    }
    if (this.bathrooms) {
      this.placeDiv(this.bathrooms)
    }
    if (this.bands) {
      this.placeDiv(this.bands)
    }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
    this.dragulaService.destroy("COLUMNS");
  }

  buildFormCanvasElement() {
    this.formCanvasElement = this.formBuilder.group({
      id: [null],
      name: [null],
      code: [null],
      catalogue_id: [null]
    });
  }

  placeDiv(canvasElements: CanvasElement[]) {
    if (canvasElements) {
      canvasElements.forEach(element => {
        var x = element.pos_x;
        var y = element.pos_y;

        if (x != null && y != null) {
          var d = document.getElementById(element.id.toString());
          d.style.position = "relative";
          d.style.left = x + 'px';
          d.style.top = y + 'px';
        }
      });
    }
  }

  placeCanvasElementById(id: any) {
    var element = this.canvasElements.find(element => element.id == id);
    var x = element.pos_x;
    var y = element.pos_y;
    if (x != null && y != null) {
      var d = document.getElementById(element.id.toString());
      d.style.position = "relative";
      d.style.left = x + 'px';
      d.style.top = y + 'px';
    }

  }

  dragEnd(event: CdkDragEnd) {
    var id = event.source.element.nativeElement.id;
    var pos_x = event.source.getFreeDragPosition()['x'];
    var pos_y = event.source.getFreeDragPosition()['y'];
    var data = { id: id, pos_x: pos_x, pos_y: pos_y };

    this.userService.update('update-element-position', data).subscribe(response => {
      this.placeCanvasElementById(id);
      this.getTables();
      this.getBathrooms();
    });
  }

  public onHoverOut($i) {
    this.isToggled[$i] = false;
  }

  public getGuests() {
    this.userService.getGuests().subscribe(response => {
      this.users = response['data']
    });
  }

  public getTables() {
    this.userService.get('tables-with-guests').subscribe(response => {
      this.tables = response['data']
    });
  }

  public getAllElements() {
    this.userService.get('all-elements').subscribe(response => {
      this.canvasElements = response['data']
    });
  }

  getBathrooms() {
    this.userService.post('canvas-elements-by-type', 17).subscribe(response => {
      this.bathrooms = response['data']
    });

  }

  getBands() {
    this.userService.post('canvas-elements-by-type', 19).subscribe(response => {
      this.bands = response['data']
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

  updateTables(canvasElements: CanvasElement[]) {
    this.spinner.show();
    this.userService.store('update-canvas-element', { data: canvasElements })
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
          this.userService.get('reset-element-position')
            .subscribe(response => {
              this.getTables();
              this.getGuests();
              this.spinner.hide();
            });
        }
      });
  }

  storeCanvasElement(canvasElement: CanvasElement) {
    this.userService.store('store-canvas-element', { 'canvas_element': canvasElement })
      .subscribe(response => {
        this.getAllElements();
        this.getTables();
        this.getBathrooms();
      });
  }

  onSubmitDiningTable() {
    this.formCanvasElement.patchValue({ name: 'Mesa ' });
    this.formCanvasElement.patchValue({ code: 'M' });
    this.formCanvasElement.patchValue({ catalogue_id: 18 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitBathroom() {
    this.formCanvasElement.patchValue({ code: 'B' });
    this.formCanvasElement.patchValue({ catalogue_id: 17 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
    this.bathroomDialog= false;
  }

  onSubmitBand() {
    this.formCanvasElement.patchValue({ name: 'Banda ' });
    this.formCanvasElement.patchValue({ code: 'Bda' });
    this.formCanvasElement.patchValue({ catalogue_id: 19 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitTable() {
    this.spinner.show();
    this.userService.store('store-table-by-number', { 'number': 1 })
      .subscribe(response => {
        this.getTables();
        this.spinner.hide();
      });
  }

  deleteElement(canvasElement: CanvasElement) {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.userService.delete('canvas-element/' + canvasElement.id)
            .subscribe(response => {
              this.getGuests();
              this.getTables();
              this.getBathrooms();
              this.spinner.hide();
              this.messageService.success(response);
            }, error => {
              this.getGuests();
              this.getTables();
              this.getBathrooms();
              this.spinner.hide();
              this.messageService.error(error);
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
  //================================================================
  //======================fin de panzoom============================
  //================================================================

  openNewBathroom() {
    this.formCanvasElement.reset();
    this.bathroomDialog = true;
  }

}
