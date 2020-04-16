import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-image-priview',
  templateUrl: './image-priview.component.html',
  styleUrls: ['./image-priview.component.css']
})
export class ImagePriviewComponent implements OnInit {

  @Input() isDeedPreview: boolean;
  @Input() files: any[];

  public viewerConfig = {
    btnClass: 'default', // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
    allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
      rotateCounterClockwise: 'fa fa-undo',
      next: 'fa fa-arrow-right',
      prev: 'fa fa-arrow-left',
      fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
      next: true,
      prev: true
    },
    // customBtns: [
    //   {
    //     name: 'rotateClockwise',
    //     icon: 'fa fa-repeat'
    //   },
    //   {
    //     name: 'rotateCounterClockwise',
    //     icon: 'fa fa-undo'
    //   }
    // ]
  };

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

  transform(base64Image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

}
