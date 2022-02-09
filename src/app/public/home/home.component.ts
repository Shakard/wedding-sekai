import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/auth/user';
import { UserService } from 'src/app/services/user/user.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Chair } from 'src/app/models/table-management/chair';
import { TableGuest } from 'src/app/models/table-management/table-guest';
import * as XLSX from 'xlsx';
import { SweetMessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  importedData: any[];
  convertedJson!: string;
  user: User;
  selectedUsers: User[];
  users: User[];
  tables: TableGuest[];
  chairs: Chair[];
  chairsById: Chair[];
  formUser: FormGroup;
  formTable: FormGroup;
  formChair: FormGroup;
  tableSelected: boolean = false;
  userValue: boolean;
  submitted: boolean;
  importDataDialog: boolean;
  userDialog: boolean;
  chairDialog: boolean;
  setPassword: boolean;
  statuses: any[];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private messageService: SweetMessageService
  ) { }

  ngAfterViewInit() {
    this.getGuests();
    this.getTables();
    this.getChairs();
  }

  ngOnInit(): void {
    this.buildFormUser();
    this.buildFormTable();
    this.buildFormChair();
  }

  buildFormUser() {
    this.formUser = this.formBuilder.group({
      id: [null],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      confirmation: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.minLength(5)],
      password_confirmation: [null, Validators.minLength(5)],
      roles: [null]
    });
  }

  onChange(event: any) {
    console.log(event.value);
  }

  buildFormTable() {
    this.formTable = this.formBuilder.group({
      id: [null],
    });
  }

  buildFormChair() {
    this.formChair = this.formBuilder.group({
      id: [null],
      user: [null],
    });
  }

  get userIdField() {
    return this.formUser.get('id');
  }

  get firstNameField() {
    return this.formUser.get('first_name');
  }

  get lastNameField() {
    return this.formUser.get('last_name');
  }

  get confirmationField() {
    return this.formUser.get('confirmation');
  }

  get phoneField() {
    return this.formUser.get('phone');
  }

  get emailField() {
    return this.formUser.get('email');
  }
  get passwordField() {
    return this.formUser.get('password');
  }
  get passwordConfirmationField() {
    return this.formUser.get('password_confirmation');
  }
  get rolesField() {
    return this.formUser.get('roles');
  }

  openNewUser() {
    this.formUser.reset();
    this.submitted = false;
    this.setPassword = true;
    this.userDialog = true;
  }

  openImportData() {
    this.submitted = false;
    this.importDataDialog = true;
  }

  public getLoggedUser() {
    this.userService.getLoggedUser().subscribe(response => {
      this.user = response['data']
    });
  }

  getChairsByTableId() {
    this.userService.getChairsByTableId(this.formTable.value.id).subscribe(response => {
      this.chairsById = response['data'];
      console.log(this.chairs);
    });
  }

  getChairs() {
    this.spinner.show();
    this.userService.getChairs().subscribe(response => {
      this.chairs = response['data'];
      this.spinner.hide();
    });
  }

  selectTable(event: any) {
    this.formTable.patchValue(event.value);
    this.tableSelected = true;
    this.getChairsByTableId();
  }

  selectChair(event: any) {
    this.formChair.patchValue({ id: event.value.id });
    this.getGuests();
  }

  public getGuests() {
    this.spinner.show();
    this.userService.getGuests().subscribe(response => {
      this.users = response['data']
      console.log(this.users);
      this.spinner.hide();
    });
  }

  public getTables() {
    this.spinner.show();
    this.userService.getTables().subscribe(response => {
      this.tables = response['data']
      this.spinner.hide();
    });
  }

  updateUser(user: User) {
    this.spinner.show();
    this.userService.update('user/' + user.id, { user })
      .subscribe(response => {
        this.getGuests();
        this.spinner.hide();
      });
  }

  updateChair(chair: Chair) {
    this.spinner.show();
    this.userService.update('add-user/' + chair.id, { chair })
      .subscribe(response => {
        this.getGuests();
        this.spinner.hide();
      });
  }

  storeUser(user: User) {
    this.spinner.show()
    this.userService.store('add-user', { 'user': user })
      .subscribe(response => {
        this.getGuests();
        this.spinner.hide();
      });
  }

  importData(data: Array<any>) {
    this.spinner.show()
    this.userService.store('import-users', { data: data })
      .subscribe(response => {
        this.getGuests();
        this.spinner.hide();
        this.messageService.successImportGuests();
      });
  }

  editUser(user: User) {
    this.formUser.patchValue(user);
    this.userDialog = true;
    this.setPassword = false;
  }

  addChair(user: User) {
    this.formChair.patchValue({ user: user });
    this.submitted = false;
    this.chairDialog = true;
  }

  deleteUser(user: User) {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.spinner.show();
          this.userService.delete('user/' + user.id)
            .subscribe(response => {
              this.getGuests();              
              this.spinner.hide();
              this.messageService.success(response);
            }, error => {
              this.getGuests();            
              this.spinner.hide();
              this.messageService.error(error);
            });
        }
      });
  }

  onSubmitUser() {
    if (this.formUser.valid) {
      this.formUser.patchValue({ confirmation: 0});
      this.submitted = true;
      if (this.userIdField.value) {
        this.updateUser(this.formUser.value);
        this.formUser.reset();
        this.userValue = false;
        this.userDialog = false;
        this.messageService.successUpdateGuest();
      }
      else {
        this.formUser.patchValue({ roles: 'Guest' });
        this.storeUser(this.formUser.value);
        this.formUser.reset();
        this.userValue = false;
        this.userDialog = false;
        this.messageService.successStoreGuest();
      }
    } else {
      this.userDialog=false;
      this.messageService.invalidFields();
    }
  }

  onSubmitImport() {
    //this.convertedJson = JSON.stringify(this.importedData, undefined, 4)
    console.log(this.importedData);
    this.importData(this.importedData);
    this.importDataDialog = false;
  }

  onSubmitChair() {
    this.updateChair(this.formChair.value);
    this.formChair.reset();
    this.tableSelected = false;
    this.chairDialog = false;
    this.messageService.successAddChair();
  }

  removeChair(user: User) {
    this.formChair.patchValue(user.chair);
    this.formChair.patchValue({ user: null });
    this.updateChair(this.formChair.value);
    this.formChair.reset();
    this.tableSelected = false;
  }

  fileUpload(event: any) {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let binaryData = event.target.result;
      let workBook = XLSX.read(binaryData, { type: 'binary' });
      workBook.SheetNames.forEach(sheet => {
        const data = XLSX.utils.sheet_to_json(workBook.Sheets[sheet]);
        this.importedData = data;
        console.log(this.importedData);
      })
    }
  }

}
