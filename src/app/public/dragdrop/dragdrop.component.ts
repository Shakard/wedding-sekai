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
  danceFloors: CanvasElement[];
  loungeRooms: CanvasElement[];
  entrances: CanvasElement[];
  exits: CanvasElement[];
  candyBars: CanvasElement[];
  weddingCakes: CanvasElement[];
  emergencyExits: CanvasElement[];
  caterings: CanvasElement[];
  cofeeStations: CanvasElement[];
  photoBooths: CanvasElement[];
  cocktailTables: CanvasElement[];
  photoAreas: CanvasElement[];
  playgrounds: CanvasElement[];
  nurseries: CanvasElement[];
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
    // this.getBathrooms();
    // this.getBands();
    // this.getDanceFloors();
    // this.getLoungeRooms();
    // this.getEntrances();
    // this.getExits();
    // this.getCandyBars();
    // this.getWeddingCakes();
    // this.getCocktailTables();
    // this.getEmergencyExits();
    // this.getCaterings();
    // this.getCofeeStations();
    // this.getPhotoBooths();
    // this.getPhotoAreas();
    // this.getPlaygrounds();
    // this.getNurseries();
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
      this.placeDiv(this.tables);
      this.placeDiv(this.canvasElements);
    }

    // if (this.tables) {
    //   this.placeDiv(this.tables);
    // }
    // if (this.bathrooms) {
    //   this.placeDiv(this.bathrooms)
    // }
    // if (this.bands) {
    //   this.placeDiv(this.bands)
    // }

    // if (this.danceFloors) {
    //   this.placeDiv(this.danceFloors)
    // }

    // if (this.loungeRooms) {
    //   this.placeDiv(this.loungeRooms)
    // }
    // if (this.entrances) {
    //   this.placeDiv(this.entrances)
    // }
    // if (this.exits) {
    //   this.placeDiv(this.exits)
    // }
    // if (this.candyBars) {
    //   this.placeDiv(this.candyBars)
    // }
    // if (this.weddingCakes) {
    //   this.placeDiv(this.weddingCakes)
    // }
    // if (this.emergencyExits) {
    //   this.placeDiv(this.emergencyExits)
    // }
    // if (this.caterings) {
    //   this.placeDiv(this.caterings)
    // }
    // if (this.cofeeStations) {
    //   this.placeDiv(this.cofeeStations)
    // }
    // if (this.photoBooths) {
    //   this.placeDiv(this.photoBooths)
    // }
    // if (this.cocktailTables) {
    //   this.placeDiv(this.cocktailTables)
    // }
    // if (this.photoAreas) {
    //   this.placeDiv(this.photoAreas)
    // }
    // if (this.playgrounds) {
    //   this.placeDiv(this.playgrounds)
    // }
    // if (this.nurseries) {
    //   this.placeDiv(this.nurseries)
    // }

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

  placeDiv(canvasElements: CanvasElement[]) {
    if (canvasElements) {
      canvasElements.forEach(element => {
        var x = element.pos_x;
        var y = element.pos_y;
        if (x != null && y != null) {
          var d = document.getElementById(element.id.toString());
          if (d != null) {
            d.style.position = "relative";
            d.style.left = x + 'px';
            d.style.top = y + 'px';
          }
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
    // var element = this.canvasElements.find(element => element.id == id);
    // console.log(element);
    // var x = element.pos_x;
    // var y = element.pos_y;
    // if (x != null && y != null) {
    //   var d = document.getElementById(element.id.toString());
    //   d.style.position = "relative";
    //   d.style.left = x + 'px';
    //   d.style.top = y + 'px';
    // }

  }

  getCanvasElementsById(type: number) {
    this.userService.post('canvas-elements-by-type', type).subscribe(response => {
      this.canvasElements = response['data']
    });
  }

  dragEnd(event: CdkDragEnd) {
    var id = event.source.element.nativeElement.id;
    var pos_x = event.source.getFreeDragPosition()['x'];
    var pos_y = event.source.getFreeDragPosition()['y'];
    var data = { id: id, pos_x: pos_x, pos_y: pos_y };

    this.userService.update('update-element-position', data).subscribe(response => {
      this.placeCanvasElementById(id);
      // this.getCanvasElementsById(Number(type));
      this.getAllElements();
      this.getTables();
      // this.getBathrooms();
      // this.getBands();
      // this.getDanceFloors();
      // this.getLoungeRooms();
      // this.getEntrances();
      // this.getExits();
      // this.getCandyBars();
      // this.getWeddingCakes();
      // this.getCocktailTables();
      // this.getEmergencyExits();
      // this.getCaterings();
      // this.getCofeeStations();
      // this.getPhotoBooths();
      // this.getPhotoAreas();
      // this.getPlaygrounds();
      // this.getNurseries();
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

  getCofeeStations() {
    this.userService.post('canvas-elements-by-type', 28).subscribe(response => {
      this.cofeeStations = response['data']
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
              this.getAllElements();
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
        // this.getBathrooms();
        // this.getBands();
        // this.getDanceFloors();
        // this.getLoungeRooms();
        // this.getEntrances();
        // this.getExits();
        // this.getCandyBars();
        // this.getWeddingCakes();
        // this.getCocktailTables();
        // this.getEmergencyExits();
        // this.getCaterings();
        // this.getCofeeStations();
        // this.getPhotoBooths();
        // this.getPhotoAreas();
      });
  }

  onSubmitDiningTable() {
    this.formCanvasElement.patchValue({ name: 'Mesa ' });
    this.formCanvasElement.patchValue({ code: 'Msa' });
    this.formCanvasElement.patchValue({ image: 'dining-table.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 18 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitBathroom() {
    this.formCanvasElement.patchValue({ code: 'Bño' });
    this.formCanvasElement.patchValue({ image: 'bathroom.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 17 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
    this.bathroomDialog = false;
  }

  onSubmitBand() {
    this.formCanvasElement.patchValue({ name: 'Banda ' });
    this.formCanvasElement.patchValue({ code: 'Bda' });
    this.formCanvasElement.patchValue({ image: 'band.png' });
    this.formCanvasElement.patchValue({ catalogue_id: 19 });
    this.storeCanvasElement(this.formCanvasElement.value);
    this.formCanvasElement.reset();
  }

  onSubmitDanceFloor() {
    this.formCanvasElement.patchValue({ name: 'Pista de baile ' });
    this.formCanvasElement.patchValue({ code: 'Ppb' });
    this.formCanvasElement.patchValue({ image: 'dance-floor.jpg' });
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
    this.formCanvasElement.patchValue({ image: 'candy-bar.png' });
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
    this.formCanvasElement.patchValue({ image: 'emergency-exit.jpg' });
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

  onSubmitCoffeStation() {
    this.formCanvasElement.patchValue({ name: 'Estación de café' });
    this.formCanvasElement.patchValue({ code: 'Cfee' });
    this.formCanvasElement.patchValue({ image: 'cofee-station.png' });
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

  onSubmitCocktailTable() {
    this.formCanvasElement.patchValue({ name: 'Mesa de cocteles' });
    this.formCanvasElement.patchValue({ code: 'ctl' });
    this.formCanvasElement.patchValue({ image: 'cocktail-area.png' });
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

  openNewBathroom() {
    this.formCanvasElement.reset();
    this.bathroomDialog = true;
  }

}
