import { Component, OnInit, Input } from '@angular/core';
import { UiController } from 'src/app/shared/custom-model/ui-controller.model';
import { BoundaryDto } from 'src/app/shared/dto/boundary-dto.model';
import { BoundaryType } from 'src/app/shared/enum/boundary-type.enum';

@Component({
  selector: 'app-boundary',
  templateUrl: './boundary.component.html',
  styleUrls: ['./boundary.component.css']
})
export class BoundaryComponent implements OnInit {

  @Input()
  uiController: UiController;

  @Input()
  boundaryDto: BoundaryDto;

  public optionalBoundary: any = {};
  public boundaryType = BoundaryType;

  constructor() { }

  ngOnInit() {
  }

  addBoundary() {
    this.boundaryDto.optionalList.push(this.optionalBoundary)
    this.optionalBoundary = {};
  }

  deleteBoundary(index) {
    // Swal.fire({
    //   title: this.systemMethodService.getTranslation('ALERT.CONFIRM_MESSAGE.SUBMIT'),
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: this.systemMethodService.getTranslation('BUTTONS.CONFIRM'),
    //   showLoaderOnConfirm: true,
    // }).then((result) => {
    //   if (result.value) {
        this.boundaryDto.optionalList.splice(index, 1);
    //   }
    // })
    
  }

}
