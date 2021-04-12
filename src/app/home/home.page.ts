import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import Dropzone, { DropzoneOptions } from 'dropzone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('dropzone') element: ElementRef;
  dropzone?: Dropzone;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const element = this.renderer.selectRootElement(this.element.nativeElement);
    this.dropzone = new Dropzone(element, {
      previewsContainer: '#previews',
    });    
  }

  getPhoto() {
    Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    }).then((photo) => {
      this.dropzone.addFile(this.photoToBlob(photo));
    });
  }

  // https://stackoverflow.com/questions/36912819/cordova-camera-take-picture-as-blob-object
  private photoToBlob(photo: Photo) {
    const contentType = `image/${photo.format}`;
    const sliceSize = 512;

    const byteCharacters = atob(photo.base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }}
