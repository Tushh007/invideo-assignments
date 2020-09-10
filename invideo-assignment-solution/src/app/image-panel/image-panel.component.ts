import { Component, OnInit, ViewChild } from '@angular/core';
import { PicsumService } from '../shared/services/picsum.service';
import { first } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Picsum } from '../shared/models/picsum' ;

@Component({
  selector: 'app-image-panel',
  templateUrl: './image-panel.component.html',
  styleUrls: ['./image-panel.component.css']
})
export class ImagePanelComponent implements OnInit {

  picsumImages: any;
  clickedImage: Picsum;
  dataSource: any;
  displayedColumns: string[] = ['url'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private picsumService: PicsumService) { }

  ngOnInit(): void {
    this.getPicsumImages();
  }

  getImage(data: any): void {
    this.clickedImage = data;
  }

  getPicsumImages(): void {
    this.picsumService.getImages()
          .pipe(first())
          .subscribe(
            data => {
              this.picsumImages = data;
              this.clickedImage = this.picsumImages[0];
              this.dataSource = new MatTableDataSource(this.picsumImages);
              this.dataSource.paginator = this.paginator;
            },
            error => {
              // console.log(error);
            });
  }

}
