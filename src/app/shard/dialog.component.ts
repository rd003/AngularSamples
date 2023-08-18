import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  template: `
    <h1 mat-dialog-title>Delete file</h1>
    <div mat-dialog-content>{{ msg }}</div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClicked(false)">❌</button>
      <button mat-button (click)="onClicked(true)" cdkFocusInitial>✔️</button>
    </div>
  `,
  styles: [],
})
export class DialogComponent {
  msg = this.data.message;

  onClicked(val: boolean) {
    this.dialogRef.close(val);
  }

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
