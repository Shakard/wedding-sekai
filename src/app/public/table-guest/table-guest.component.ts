import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chair } from 'src/app/models/table-management/chair';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import { SweetMessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-table-guest',
  templateUrl: './table-guest.component.html',
  styleUrls: ['./table-guest.component.scss']
})
export class TableGuestComponent implements OnInit {

  table: TableGuest;
  number: Number;
  expandedRows: {} = {};
  selectedTables: TableGuest[];
  tables: TableGuest[];
  chairs: Chair[];
  formTable: FormGroup;
  formChair: FormGroup;
  tableValue: boolean;
  chairValue: boolean;
  submitted: boolean;
  tableDialog: boolean;
  chairDialog: boolean;
  tableByNumberDialog: boolean;
  chairByNumberDialog: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService
  ) { }

  ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();
    this.buildFormTable();
    this.buildFormChair();
    this.getTables();
    this.getChairs();    
    this.expandedRows = this.tables;
    

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  buildFormTable() {
    this.formTable = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      code: [null, Validators.required]
    });
  }

  buildFormChair() {
    this.formChair = this.formBuilder.group({
      id: [null],
      table: [null],
      user: [null],
      name: [null, Validators.required],
      code: [null, Validators.required]
    });
  }

  get tableIdField() {
    return this.formTable.get('id');
  }

  get chairIdField() {
    return this.formChair.get('id');
  }

  getTables() {
    this.userService.getTables().subscribe(response => {
      this.tables = response['data']
    });
  }

  getChairs() {
    this.userService.getChairs().subscribe(response => {
      this.chairs = response['data']
    });
  }

  openNewTable() {
    this.formTable.reset();
    this.submitted = false;
    this.tableDialog = true;
  }

  openNewTableByNumber() {
    this.submitted = false;
    this.tableByNumberDialog = true;
  }

  openNewChairByNumber() {
    this.submitted = false;
    this.chairByNumberDialog = true;
  }

  updateTable(table: TableGuest) {
    this.userService.update('table/' + table.id, { table })
      .subscribe(response => {
        this.getTables();
      });
  }

  storeTable(table: TableGuest) {
    this.userService.store('table/add', { 'table': table })
      .subscribe(response => {
        this.getTables();
      });
  }

  storeChair(chair: Chair) {
    this.userService.store('chair/add', { 'chair': chair })
      .subscribe(response => {
        this.getTables();
      });
  }

  editTable(table: TableGuest) {
    this.formTable.patchValue(table);
    this.tableDialog = true;
  }

  addChair(table: TableGuest) {
    this.formTable.patchValue(table);
    this.formChair.patchValue({ table: table });
    this.submitted = false;
    this.chairDialog = true;
  }

  addChairs(table: TableGuest) {
    this.formTable.patchValue(table);
    this.formChair.patchValue({ table: table });
    this.submitted = false;
    this.chairByNumberDialog = true;
  }

  deleteTable(table: TableGuest) {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.userService.delete('table/' + table.id)
            .subscribe(response => {
              this.getTables();              
              this.spinner.hide();
              this.messageService.success(response);
            }, error => {
              this.getTables();            
              this.spinner.hide();
              this.messageService.error(error);
            });
        }
      });
  }

  onSubmitTable() {
    console.log(this.formTable.value);

    this.spinner.show();
    if (this.formTable.valid) {
      this.submitted = true;
      if (this.tableIdField.value) {
        this.updateTable(this.formTable.value);
        this.formTable.reset();
        this.tableValue = false;
        this.spinner.hide();
        //this.messageService232.successUnit();
      }
      else {
        this.formTable.patchValue({ roles: 'Guest' });
        this.storeTable(this.formTable.value);
        this.formTable.reset();
        this.tableValue = false;
        this.spinner.hide();
      }
      this.tableDialog = false;
    } else {
      this.spinner.hide();
      //this.messageService232.invalidFields();
    }
  }

  onSubmitChair() {
    console.log(this.formChair.value);
    this.spinner.show();
    if (this.formChair.valid) {
      this.submitted = true;
      this.storeChair(this.formChair.value);
      this.formChair.reset();
      this.chairValue = false;
      this.spinner.hide();
    }
    else {
      this.spinner.hide();
      //this.messageService232.invalidFields();
    }
    this.chairDialog = false;
  }

  onSubmitTableByNumber(number: Number) {
    this.spinner.show();
    this.userService.store('store-table-by-number', { 'number': number })
      .subscribe(response => {
        this.getTables();
        this.tableByNumberDialog = false;
        this.number = null;
        this.spinner.hide();
        this.messageService.successStoreTables();
      });
  }

  storeChairs(number: Number) {
    this.onSubmitChairByNumber(number, this.formChair.value);
    this.chairByNumberDialog = false;
  }

  onSubmitChairByNumber(number: Number, chair: Chair) {
    this.spinner.show();
    this.userService.store('store-chair-by-number', { 'number': number, 'chair': chair })
      .subscribe(response => {
        this.tableByNumberDialog = false;
        this.number = null;
        this.getTables();
        this.spinner.hide();
        this.messageService.successStoreChairs();
      });
  }

}
