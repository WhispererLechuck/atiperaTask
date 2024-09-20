import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PeriodicElement } from './periodic-element';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PopupComponent } from './popup/popup/popup.component';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {RxState} from '@rx-angular/state';


type PeriodicElementKeys = keyof PeriodicElement;
export interface DialogData {
  item: PeriodicElement;
  type: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
const originalData = JSON.parse(JSON.stringify(ELEMENT_DATA));


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,MatTableModule,MatButtonModule,MatLabel,MatFormField,MatInputModule, MatProgressSpinnerModule],
  template: `
  <div class="container">
   <div>
      <mat-form-field appearance="fill">
         <mat-label>Filter</mat-label>
         <input matInput (keyup)="applyFilter($event)" (keydown)="clearTime()" placeholder="Type to filter">
      </mat-form-field>
   </div>
   <div>
      <button mat-button (click)="loadContent()">Reset table</button>
   </div>
   @if(isLoading){
    <div class="loading">
      <h3>Loading data...</h3>
      <mat-spinner></mat-spinner>
    </div>

   }
   @else {
   <table mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="position">
         <th mat-header-cell *matHeaderCellDef>No.</th>
         <td mat-cell (click)="edit(element,'position')" *matCellDef="let element"> {{element.position}} </td>
      </ng-container>
      <!-- Name Column -->
      <ng-container matColumnDef="name">
         <th mat-header-cell *matHeaderCellDef> Name </th>
         <td mat-cell (click)="edit(element,'name')" *matCellDef="let element"> {{element.name}} </td>
      </ng-container>
      <!-- Weight Column -->
      <ng-container matColumnDef="weight">
         <th mat-header-cell *matHeaderCellDef> Weight </th>
         <td mat-cell (click)="edit(element,'weight')" *matCellDef="let element"> {{element.weight}} </td>
      </ng-container>
      <!-- Symbol Column -->
      <ng-container matColumnDef="symbol">
         <th mat-header-cell *matHeaderCellDef> Symbol </th>
         <td mat-cell (click)="edit(element,'symbol')" *matCellDef="let element"> {{element.symbol}} </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="headerRows"></tr>
      <tr mat-row *matRowDef="let row; columns: headerRows;"></tr>
   </table>
   }
</div>
  `
  ,
  styleUrl: './app.component.css',
  providers: [RxState]
})
export class AppComponent implements OnInit{
  readonly popupDialog = inject(MatDialog);
  copyElementData: PeriodicElement[] = JSON.parse(JSON.stringify(ELEMENT_DATA));
  dataSource = new MatTableDataSource<PeriodicElement>();
  headerRows = ['position', 'name', 'weight', 'symbol'];
  emptyFieldFlag: boolean = false;
  editedObject: any = null; 
  editedField: PeriodicElementKeys = 'name';
  editedValue: any = '';
  typingTimer: any;
  timeLimit: number = 2000;
  isLoading: boolean = true;
  loadTimer: any;
  loadLimit: number = 1000;

  constructor(private state: RxState<{ data: PeriodicElement[] }>) {
    this.state.set({ data: ELEMENT_DATA });
    /*
    This subscribe is the way I found to detect the changes in the variable dataSource, I am sorry if this does not meet your expectations. 
    */
    this.state.select('data').subscribe(data => {
      this.dataSource.data = data;
    });
  }


  edit(item:PeriodicElement, head: PeriodicElementKeys) {
    this.editedObject = item;
    this.editedField = head;
    this.editedValue = item[head];
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.popupDialog.open(PopupComponent, { data: {item: this.editedValue, type: this.editedField}});
    /*
    Based in the Material Angular documentation, the only way to receive data from the Mat-dialog is using this subscribe.
    */
    dialogRef.afterClosed().subscribe(x =>{
      if(x!=undefined){
        this.updateElement(x);
      }
    })
  }

  updateElement(inputValue: any){
    this.state.set({
      data: this.state.get().data.map(el =>
        el.position === this.editedObject.position ? { ...el, [this.editedField]: inputValue } : el
      ),
    });
  }

  applyFilter(event: Event) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(()=>{
      const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    }, this.timeLimit);


    
  }
  clearTime(){
    clearTimeout(this.typingTimer);
  }

  loadContent():void{
    this.isLoading = true;      
    this.reset();
    clearTimeout(this.loadTimer);
    this.loadTimer = setTimeout(()=>{
      this.isLoading = false;
    },this.loadLimit)
    
  }

  reset(){
    this.emptyFieldFlag = false;
    this.editedObject = null; 
    this.editedField = 'name';
    this.editedValue = '';
    
    this.state.set({ data: ELEMENT_DATA });
  }

  title = 'atiperaTask';
  ngOnInit(): void {
    
    this.loadContent();
  }

    
}
