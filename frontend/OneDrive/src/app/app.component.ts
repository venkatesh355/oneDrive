import { Component, ViewChild } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'OneDrive';
  uploadFiles: File[] = [];
  folderName: string = '';

  @ViewChild('uploadForm') uploadForm!: NgForm; 
  @ViewChild('fileInput') fileInput!: any; 
  constructor(private http: HttpClient,private snackBar: MatSnackBar,) {}

  selectedFile(event: any) {
    console.log("Files selected");
    if (event.target.files.length > 0) {
      this.uploadFiles = Array.from(event.target.files);
      console.log("files", this.uploadFiles);
    }
  }

  onSubmit() {
    console.log("Form submitted");

    const formData = new FormData();
    for (let file of this.uploadFiles) {
      formData.append('files', file); 
    }
    formData.append('folderName', this.folderName);

    this.http.post<any>('http://localhost:5000/upload', formData).subscribe(
      (res) => {
        if(res.status === true){
          if (this.uploadForm) {
            this.uploadForm.resetForm();
          }
          this.uploadFiles = [];
          this.folderName = '';
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        }
        this.showMessage(res.message,'green-snackbar')
        // console.log("response", res);
      },
      (err) => {
        console.log("Error", err);
        this.showError("Error in Uploading File","red-snackbar")
      }
    );
  }
  showMessage(msg: string , panelClass: string) {
    this.snackBar.open(msg, "Info", { duration: 4000, horizontalPosition: 'end', verticalPosition: 'top' , panelClass: [panelClass] });
  }
  showError(msg: string,panelClass: string) {
    this.snackBar.open(msg, "Error", { duration: 4000, horizontalPosition: 'end', verticalPosition: 'top' , panelClass: [panelClass]});
  }
}
