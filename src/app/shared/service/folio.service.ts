import { Injectable } from '@angular/core';
import { SysConfigService } from './sys-config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentType } from '../enum/document-type.enum';
import { FolioController } from '../custom-model/folio-controller.model';

@Injectable({
  providedIn: 'root'
})
export class FolioService {

  public BASE_URL = SysConfigService.BASE_URL;

  private headersJson = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  public constructor(private httpClient: HttpClient) { }

  // tslint:disable-next-line:ban-types
  getExpressTrustFolio(folioNo): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'expressTrustFolio/' + folioNo, { headers: this.headersJson });
  }

  setUiController(uiController, documentTypeId) {

    console.log('type: ', documentTypeId)

    if (documentTypeId == DocumentType.NORMAL_TRUST) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = true;
      uiController.isMultipleTrustee = true;
      uiController.isTruster = true;
      uiController.isMultipleTruster = true;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = true;
      uiController.isMultipleOldTrustee = true;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = false;
      uiController.isMultipleGrantor = false;
      uiController.isGrantee = false;
      uiController.isMultipleGrantee = false;
      uiController.isBoundary = false;
      uiController.isExtent = false;
      uiController.isParticulars = false;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = false;
    }
    else if (documentTypeId == DocumentType.EXPRESS_TRUST) {

      uiController.isTrust = true;
      uiController.isMultipleTrust = true;
      uiController.isTrustee = true;
      uiController.isMultipleTrustee = true;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = true;
      uiController.isMultipleCoTrustee = true;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = true;
      uiController.isMultipleBeneficiary = true;
      uiController.isBeneficial = true;
      uiController.isMultipleBeneficial = true;
      uiController.isGrantor = false;
      uiController.isMultipleGrantor = false;
      uiController.isGrantee = false;
      uiController.isMultipleGrantee = false;
      uiController.isBoundary = true;
      uiController.isExtent = true;
      uiController.isParticulars = false;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = false;
    }
    else if (documentTypeId == DocumentType.GENERAL) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = false;
      uiController.isMultipleTrustee = false;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = true;
      uiController.isMultipleGrantor = true;
      uiController.isGrantee = true;
      uiController.isMultipleGrantee = true;
      uiController.isBoundary = true;
      uiController.isExtent = true;
      uiController.isParticulars = true;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = false;
    }
    else if (documentTypeId == DocumentType.CONDOMINIUM) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = false;
      uiController.isMultipleTrustee = false;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = true;
      uiController.isMultipleGrantor = true;
      uiController.isGrantee = true;
      uiController.isMultipleGrantee = true;
      uiController.isBoundary = true;
      uiController.isExtent = true;
      uiController.isParticulars = true;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = true;
    }
    else if (documentTypeId == DocumentType.SPECIAL_DIVISION_DEEDS) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = false;
      uiController.isMultipleTrustee = false;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = true;
      uiController.isMultipleGrantor = true;
      uiController.isGrantee = true;
      uiController.isMultipleGrantee = true;
      uiController.isBoundary = true;
      uiController.isExtent = true;
      uiController.isParticulars = true;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = false;
    }
    else if (documentTypeId == DocumentType.SPECIAL_CONDOMINIUM_DEEDS) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = false;
      uiController.isMultipleTrustee = false;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = true;
      uiController.isMultipleGrantor = true;
      uiController.isGrantee = true;
      uiController.isMultipleGrantee = true;
      uiController.isBoundary = true;
      uiController.isExtent = true;
      uiController.isParticulars = true;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = true;
    }
    else if (documentTypeId == DocumentType.MOVABLE) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = false;
      uiController.isMultipleTrustee = false;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = true;
      uiController.isMultipleGrantor = true;
      uiController.isGrantee = true;
      uiController.isMultipleGrantee = true;
      uiController.isBoundary = false;
      uiController.isExtent = false;
      uiController.isParticulars = true;
      uiController.isRemark = true;
      uiController.isProperty = false;
      uiController.isUnit = false;
    }
    else if (documentTypeId == DocumentType.GOV_LANDS) {

      uiController.isTrust = false;
      uiController.isMultipleTrust = false;
      uiController.isTrustee = false;
      uiController.isMultipleTrustee = false;
      uiController.isTruster = false;
      uiController.isMultipleTruster = false;
      uiController.isCoTrustee = false;
      uiController.isMultipleCoTrustee = false;
      uiController.isOldTrustee = false;
      uiController.isMultipleOldTrustee = false;
      uiController.isBeneficiary = false;
      uiController.isMultipleBeneficiary = false;
      uiController.isBeneficial = false;
      uiController.isMultipleBeneficial = false;
      uiController.isGrantor = true;
      uiController.isMultipleGrantor = true;
      uiController.isGrantee = true;
      uiController.isMultipleGrantee = true;
      uiController.isBoundary = true;
      uiController.isExtent = true;
      uiController.isParticulars = true;
      uiController.isRemark = true;
      uiController.isProperty = true;
      uiController.isUnit = false;
    }

    console.log('tt: ', uiController)
    return uiController;
  }

  setFolioController(newFolioController: FolioController, documentTypeId) {

    if (documentTypeId == DocumentType.EXPRESS_TRUST) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = true;
      newFolioController.district = true;
      newFolioController.landRegistry = true;
      newFolioController.dsDivision = true;
      newFolioController.gnDivision = true;
      newFolioController.provincialCouncil = true;
      newFolioController.trustName = true;
      newFolioController.trustAddress = true;
      newFolioController.trustPurpose = true;
      newFolioController.wardName = false;
      newFolioController.wardNo = false;
    }

    if (documentTypeId == DocumentType.CONDOMINIUM) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = false;
      newFolioController.district = true;
      newFolioController.landRegistry = false;
      newFolioController.dsDivision = true;
      newFolioController.gnDivision = true;
      newFolioController.provincialCouncil = false;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = true;
      newFolioController.wardNo = true;
    }

    if (documentTypeId == DocumentType.GENERAL) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = true;
      newFolioController.district = true;
      newFolioController.landRegistry = true;
      newFolioController.dsDivision = true;
      newFolioController.gnDivision = true;
      newFolioController.provincialCouncil = true;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = false;
      newFolioController.wardNo = false;
    }

    if (documentTypeId == DocumentType.GOV_LANDS) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = false;
      newFolioController.district = true;
      newFolioController.landRegistry = true;
      newFolioController.dsDivision = true;
      newFolioController.gnDivision = true;
      newFolioController.provincialCouncil = false;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = false;
      newFolioController.wardNo = false;
    }

    if (documentTypeId == DocumentType.MOVABLE) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = false;
      newFolioController.district = false;
      newFolioController.landRegistry = false;
      newFolioController.dsDivision = false;
      newFolioController.gnDivision = false;
      newFolioController.provincialCouncil = false;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = false;
      newFolioController.wardNo = false;
    }

    if (documentTypeId == DocumentType.NORMAL_TRUST) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = false;
      newFolioController.district = false;
      newFolioController.landRegistry = false;
      newFolioController.dsDivision = false;
      newFolioController.gnDivision = false;
      newFolioController.provincialCouncil = false;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = false;
      newFolioController.wardNo = false;
    }

    if (documentTypeId == DocumentType.SPECIAL_CONDOMINIUM_DEEDS) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = false;
      newFolioController.district = true;
      newFolioController.landRegistry = false;
      newFolioController.dsDivision = true;
      newFolioController.gnDivision = true;
      newFolioController.provincialCouncil = false;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = true;
      newFolioController.wardNo = true;
    }

    if (documentTypeId == DocumentType.SPECIAL_DIVISION_DEEDS) {
      newFolioController.lrDivision = true;
      newFolioController.volume = true;
      newFolioController.number = true;
      newFolioController.province = true;
      newFolioController.district = true;
      newFolioController.landRegistry = true;
      newFolioController.dsDivision = true;
      newFolioController.gnDivision = true;
      newFolioController.provincialCouncil = true;
      newFolioController.trustName = false;
      newFolioController.trustAddress = false;
      newFolioController.trustPurpose = false;
      newFolioController.wardName = false;
      newFolioController.wardNo = false;
    }

    return newFolioController;
  }
}
