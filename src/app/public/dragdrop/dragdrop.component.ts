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
import { ResizedEvent } from 'angular-resize-event';


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
  guestDeployed: boolean;
  canvasElement: CanvasElement;
  canvasElements: CanvasElement[];
  users: User[];
  chairs: Chair[];
  tables: CanvasElement[];
  bathrooms: CanvasElement[];
  bands: CanvasElement[];
  danceFloors: CanvasElement[];
  loungeRooms: CanvasElement[];
  entrances: CanvasElement[];
  exits: CanvasElement[];
  candyBars: CanvasElement[];
  weddingCakes: CanvasElement[];
  emergencyExits: CanvasElement[];
  caterings: CanvasElement[];
  coffeeStations: CanvasElement[];
  photoBooths: CanvasElement[];
  cocktailTables: CanvasElement[];
  photoAreas: CanvasElement[];
  playgrounds: CanvasElement[];
  nurseries: CanvasElement[];
  genders: string[];
  width = 0;
  height = 0;

  constructor(
    public userService: UserService,
    private dragulaService: DragulaService,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService,
    private formBuilder: FormBuilder
  ) {

    this.dragulaService.createGroup("COLUMNS", {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === "group-handle"
    });

    this.subs.add(this.dragulaService.dropModel("SPILL")
      .subscribe(({ target, item }) => {

        if (target.id = 'invitados') {
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
      initialZoom: 0.8
    })
    // =======================================================================

  }

  ngAfterViewChecked() {
    if (this.canvasElements) {
      this.placeDiv(this.canvasElements);
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
      image: [null],
      catalogue_id: [null]
    });
  }

  onResized(event: ResizedEvent): void {
    this.width = event.newRect.width;
    this.height = event.newRect.height - 5;
  }

  resizeDiv(id:any) {
    var data = { id: id, width: this.width, height: this.height };
    this.userService.update('update-element-size', data).subscribe(response => {
      this.placeCanvasElementById(id);
      this.getAllElements();
  });


    // var img = document.getElementById('img' + id.toString());
    //  if (img != null) {
    //    img.style.height = this.height + "px";
    //    img.style.width = this.width + "px";
    //  }
  }

  placeDiv(canvasElements: CanvasElement[]) {
    if (canvasElements) {
      canvasElements.forEach(element => {
        var x = element.pos_x;
        var y = element.pos_y;
        var width = element.width;
        var height = element.height;
        if (x != null && y != null) {
          var d = document.getElementById(element.id.toString());
          if (d != null) {
            d.style.position = "relative";
            d.style.left = x + 'px';
            d.style.top = y + 'px';
          }
        }
        var img = document.getElementById('img' + element.id.toString());
        if (img != null) {
          img.style.height = height + "px";
          img.style.width = width + "px";
        }
      });

    }
  }

  placeCanvasElementById(id: any) {
    try {
      var element = this.canvasElements.find(element => element.id == id);
      var x = element.pos_x;
      var y = element.pos_y;
      if (x != null && y != null) {
        var d = document.getElementById(element.id.toString());
        d.style.position = "relative";
        d.style.left = x + 'px';
        d.style.top = y + 'px';
      }
    } catch (error) {
      var element = this.tables.find(element => element.id == id);
      var x = element.pos_x;
      var y = element.pos_y;
      if (x != null && y != null) {
        var d = document.getElementById(element.id.toString());
        d.style.position = "relative";
        d.style.left = x + 'px';
        d.style.top = y + 'px';
      }
    }
  }

  getCanvasElementsById(type: number) {
    this.userService.post('canvas-elements-by-type', type).subscribe(response => {
      this.canvasElements = response['data']
    });
  }

  dragEnd(event: CdkDragEnd, id: any) {
    // var id = event.source.element.nativeElement.id;
    var pos_x = event.source.getFreeDragPosition()['x'];
    var pos_y = event.source.getFreeDragPosition()['y'];
    var data = { id: id, pos_x: pos_x, pos_y: pos_y };

    this.userService.update('update-element-position', data).subscribe(response => {
      this.placeCanvasElementById(id);
      // this.getCanvasElementsById(Number(type));
      this.getAllElements();
    });
  }

  public onHoverOut($i) {
    setTimeout(() => {
      this.isHovered[$i] = false
    }, 2000);
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

  getDanceFloors() {
    this.userService.post('canvas-elements-by-type', 20).subscribe(response => {
      this.danceFloors = response['data']
    });

  }

  getLoungeRooms() {
    this.userService.post('canvas-elements-by-type', 21).subscribe(response => {
      this.loungeRooms = response['data']
    });

  }

  getEntrances() {
    this.userService.post('canvas-elements-by-type', 22).subscribe(response => {
      this.entrances = response['data']
    });

  }

  getExits() {
    this.userService.post('canvas-elements-by-type', 23).subscribe(response => {
      this.exits = response['data']
    });

  }

  getCandyBars() {
    this.userService.post('canvas-elements-by-type', 24).subscribe(response => {
      this.candyBars = response['data']
    });

  }

  getWeddingCakes() {
    this.userService.post('canvas-elements-by-type', 25).subscribe(response => {
      this.weddingCakes = response['data']
    });

  }

  getEmergencyExits() {
    this.userService.post('canvas-elements-by-type', 26).subscribe(response => {
      this.emergencyExits = response['data']
    });

  }

  getCaterings() {
    this.userService.post('canvas-elements-by-type', 27).subscribe(response => {
      this.caterings = response['data']
    });

  }

  getCoffeeStations() {
    this.userService.post('canvas-elements-by-type', 28).subscribe(response => {
      this.coffeeStations = response['data']
    });

  }

  getPhotoBooths() {
    this.userService.post('canvas-elements-by-type', 29).subscribe(response => {
      this.photoBooths = response['data']
    });

  }

  getCocktailTables() {
    this.userService.post('canvas-elements-by-type', 30).subscribe(response => {
      this.cocktailTables = response['data']
    });

  }

  getPhotoAreas() {
    this.userService.post('canvas-elements-by-type', 31).subscribe(response => {
      this.photoAreas = response['data']
    });

  }

  getPlaygrounds() {
    this.userService.post('canvas-elements-by-type', 32).subscribe(response => {
      this.playgrounds = response['data']
    });

  }

  getNurseries() {
    this.userService.post('canvas-elements-by-type', 33).subscribe(response => {
      this.nurseries = response['data']
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
        this.getAllElements();
        this.getGuests();
        this.spinner.hide();
      });
  }

  saveChanges() {
    this.updateTables(this.canvasElements);
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
              this.getAllElements();
              this.getTables();
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
      });
  }

  onSubmitDiningTable() {
    this.formCanvasElement.patchValue({ name: 'Mesa ' });
    this.formCanvasElement.patchValue({ code: 'Msa' });
    this.formCanvasElement.patchValue({ image: 'dinner-table.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 18 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitBathroomMan() {
    this.formCanvasElement.patchValue({ name: 'Baño de caballeros ' });
    this.formCanvasElement.patchValue({ code: 'Bño' });
    this.formCanvasElement.patchValue({ image: 'man.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 17 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitBathroomWoman() {
    this.formCanvasElement.patchValue({ name: 'Baño de damas ' });
    this.formCanvasElement.patchValue({ code: 'Bño' });
    this.formCanvasElement.patchValue({ image: 'woman.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 17 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitBand() {
    this.formCanvasElement.patchValue({ name: 'Escenario ' });
    this.formCanvasElement.patchValue({ code: 'Bda' });
    this.formCanvasElement.patchValue({ image: 'club.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 19 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitDanceFloor() {
    this.formCanvasElement.patchValue({ name: 'Pista de baile ' });
    this.formCanvasElement.patchValue({ code: 'Ppb' });
    this.formCanvasElement.patchValue({ image: 'dance-floor.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 20 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitLoungeRoom() {
    this.formCanvasElement.patchValue({ name: 'Salon' });
    this.formCanvasElement.patchValue({ code: 'Sln' });
    this.formCanvasElement.patchValue({ image: 'lounge.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 21 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitEntrance() {
    this.formCanvasElement.patchValue({ name: 'Ingreso' });
    this.formCanvasElement.patchValue({ code: 'Igso' });
    this.formCanvasElement.patchValue({ image: 'entrance.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 22 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitExit() {
    this.formCanvasElement.patchValue({ name: 'Salida' });
    this.formCanvasElement.patchValue({ code: 'Slda' });
    this.formCanvasElement.patchValue({ image: 'exit.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 23 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitCandyBar() {
    this.formCanvasElement.patchValue({ name: 'Mesa de dulces' });
    this.formCanvasElement.patchValue({ code: 'dlce' });
    this.formCanvasElement.patchValue({ image: 'candy-table.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 24 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitWeddingCake() {
    this.formCanvasElement.patchValue({ name: 'Pastel de Bodas' });
    this.formCanvasElement.patchValue({ code: 'Pstl' });
    this.formCanvasElement.patchValue({ image: 'wedding-cake.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 25 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitEmergencyExit() {
    this.formCanvasElement.patchValue({ name: 'Salida de emergencia' });
    this.formCanvasElement.patchValue({ code: 'Emrgncy' });
    this.formCanvasElement.patchValue({ image: 'emergency-exit.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 26 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitCatering() {
    this.formCanvasElement.patchValue({ name: 'Catering' });
    this.formCanvasElement.patchValue({ code: 'Ctrg' });
    this.formCanvasElement.patchValue({ image: 'catering.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 27 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitCoffeeStation() {
    this.formCanvasElement.patchValue({ name: 'Estación de café' });
    this.formCanvasElement.patchValue({ code: 'Cfee' });
    this.formCanvasElement.patchValue({ image: 'coffee-station.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 28 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitPhotoBooth() {
    this.formCanvasElement.patchValue({ name: 'Photo booth' });
    this.formCanvasElement.patchValue({ code: 'bth' });
    this.formCanvasElement.patchValue({ image: 'photo-booth.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 29 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitBar() {
    this.formCanvasElement.patchValue({ name: 'Bar' });
    this.formCanvasElement.patchValue({ code: 'ctl' });
    this.formCanvasElement.patchValue({ image: 'bar.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 30 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitPhotoArea() {
    this.formCanvasElement.patchValue({ name: 'Area de fotos' });
    this.formCanvasElement.patchValue({ code: 'Ftoa' });
    this.formCanvasElement.patchValue({ image: 'photo-area.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 31 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitPlayground() {
    this.formCanvasElement.patchValue({ name: 'Area de juegos' });
    this.formCanvasElement.patchValue({ code: 'Jgos' });
    this.formCanvasElement.patchValue({ image: 'playground.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 32 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitNursery() {
    this.formCanvasElement.patchValue({ name: 'Guardería' });
    this.formCanvasElement.patchValue({ code: 'Gdria' });
    this.formCanvasElement.patchValue({ image: 'nursery.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 33 });
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
              this.getAllElements();
              this.spinner.hide();
              this.messageService.success(response);
            }, error => {
              this.getGuests();
              this.getTables();
              this.getAllElements();
              this.spinner.hide();
              this.messageService.error(error);
            });
        }
      });
  }

  deleteAllElements() {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.userService.delete('destroy-all-canvas-elements')
            .subscribe(response => {
              this.getGuests();
              this.getTables();
              this.getAllElements();
              this.spinner.hide();
              this.messageService.success(response);
            }, error => {
              this.getGuests();
              this.getTables();
              this.getAllElements();
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
}
