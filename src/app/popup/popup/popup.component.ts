import { Component,ChangeDetectionStrategy, inject, model} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
  MatDialogRef

} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogData } from '../../app.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],  
  template: `
  <div mat-dialog-content class="boxContent">
    <h3>Edit {{data.type}}</h3>
    <mat-form-field>
    <input matInput [(ngModel)]="editedValue" (keydown.enter)="confirm()">
  </mat-form-field>
  
    <button mat-button (click)="confirm()" >Confirm</button>
    <button mat-button (click)="cancel()">Cancel</button>
    <div>
       @if (emptyFieldFlag){
      <span>The text field should not be empty.</span>
    }
    </div>
   
  </div>
  `,
  styleUrl: './popup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent {
  readonly dialogRef = inject(MatDialogRef<PopupComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  emptyFieldFlag: boolean = false;
  editedValue = this.data.item;


  confirm(){
    let isEmpty = this.isEmptyOrSpaces(String(this.editedValue));
    if (this.data.item && !isEmpty) {
      this.emptyFieldFlag = false;
      this.dialogRef.close(this.editedValue);
    }
    else {
      this.emptyFieldFlag = true;
    }
  }
  cancel(){
    this.emptyFieldFlag = false;
    this.dialogRef.close();
  }
  isEmptyOrSpaces(str: string){
    return str === null || str.match(/^ *$/) !== null;
  }
}
