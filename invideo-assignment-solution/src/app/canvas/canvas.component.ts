import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Picsum } from '../shared/models/picsum';
class Point {
  x = 0;
  y = 0;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  constructor() { }

  @Input() set selectedImage(data: Picsum){
    try {
      this.loadImage(data.download_url);
    } catch {

    }
  }

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  eventText = '';
  indicators;
  _canvas;
  _canvasContext: CanvasRenderingContext2D;
  _canvasMouseDown = false;
  _canvasImageCaptured = false;
  _canvasEdited = false;
  _canvasZoom = 1;
  _canvasColor = '#00FF00';
  _canvasMaxZoom = 1;
  _canvasMinZoom = 0.1;
  _canvasZoomStep = 0.1;
  _canvasPinchZoomStep = 0.02;
  _canvasPoint: Point = new Point();
  _canvasPanStart: Point = new Point();
  _canvasImage: HTMLImageElement = new Image();
  _image: HTMLImageElement = new Image();
  _draw = false;
  _sx = 0;
  _sy = 0;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  loadImage(imageSource): void {

    const img = new Image();
    const self = this;
    this._canvas = this.canvas.nativeElement;

    img.onload = () => {
      self._canvasContext = self._canvas.getContext('2d');
      self._canvasContext.clearRect(0, 0, self._canvas.width, self._canvas.height);
      self._canvasZoom = 1;
      const sHeight = img.height * self._canvasZoom;
      const sWidth = img.height * (16 / 9) * self._canvasZoom;

      self._canvasContext.drawImage(img, self._sx, self._sy, sWidth, sHeight, 0, 0, self._canvas.width, self._canvas.height);
    };

    img.src = imageSource;
    this._image = img;
  }

  realignImage(sWidth, sHeight): void {
    if (this._sx + sWidth > this._image.width || this._sy + sHeight > this._image.height || this._sx < 0 || this._sy < 0) {
      if (this._sx + sWidth > this._image.width) {
        this._sx = this._image.width - sWidth;
      }
      if (this._sy + sHeight > this._image.height) {
        this._sy = this._image.height - sHeight;
      }
      if (this._sx < 0) {
        this._sx = 0;
      }
      if (this._sy < 0) {
        this._sy = 0;
      }
    }
  }

  redrawImage(): void {
    const sWidth = this._image.height * (16 / 9) * this._canvasZoom;
    const sHeight = this._image.height * this._canvasZoom;
    this.realignImage(sWidth, sHeight);
    this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._canvasContext.drawImage(this._image, this._sx, this._sy, sWidth, sHeight, 0, 0, this._canvas.width, this._canvas.height);
  }

  zoomImage(direction: number): any {
    const zoom = this._canvasZoom - direction * this._canvasZoomStep;
    if (zoom > this._canvasMaxZoom || zoom < this._canvasMinZoom) { return; }
    this._canvasZoom = zoom;
    this.redrawImage();
  }

  resetImage(): void {
    this._canvasZoom = 1;
    this._canvasPoint = new Point();
    this.redrawImage();
  }



}
