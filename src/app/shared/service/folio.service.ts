import { Injectable } from '@angular/core';
import { SysConfigService } from './sys-config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentType } from '../enum/document-type.enum';
import { FolioController } from '../custom-model/folio-controller.model';
import { PropertyController } from '../dto/property-controller.model';

@Injectable({
  providedIn: 'root'
})
export class FolioService {

  public BASE_URL = SysConfigService.BASE_URL;

  private headersJson = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  public constructor(private httpClient: HttpClient) { }

  getExpressTrustFolio(folioNo: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'expressTrustFolio/' + folioNo, { headers: this.headersJson });
  }

  setUiController(uiController, documentTypeId) {

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

  setPropertyController(propertyController: PropertyController, documentTypeId) {

    if (documentTypeId == DocumentType.EXPRESS_TRUST) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = true;
        propertyController.insertedPerson = false;
        propertyController.korale = true;
        propertyController.landId = true;
        propertyController.landName = true;
        propertyController.lotNo = true;
        propertyController.nameOfScheme = false;
        propertyController.nameOfServayor = true;
        propertyController.numberOfBasements = false;
        propertyController.numberOfBlocks = false;
        propertyController.numberOfStories = false;
        propertyController.partitionDate = false;
        propertyController.pattu = true;
        propertyController.planDate = true;
        propertyController.planNo = true;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = true;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = true;
        propertyController.toggle = false;
        propertyController.village = true;
        propertyController.propertyDetails = true;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
    }

    if (documentTypeId == DocumentType.CONDOMINIUM) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = true;
        propertyController.insertedPerson = false;
        propertyController.korale = false;
        propertyController.landId = false;
        propertyController.landName = true;
        propertyController.lotNo = true;
        propertyController.nameOfScheme = true;
        propertyController.nameOfServayor = true;
        propertyController.numberOfBasements = true;
        propertyController.numberOfBlocks = true;
        propertyController.numberOfStories = true;
        propertyController.partitionDate = false;
        propertyController.pattu = false;
        propertyController.planDate = false;
        propertyController.planNo = false;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = true;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = false;
        propertyController.toggle = false;
        propertyController.village = true;
        propertyController.propertyDetails = false;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
        propertyController.surveyPlanNo = true;
        propertyController.surveyPlanDate = true;
        propertyController.nameOfArchitect = true;
    }

    if (documentTypeId == DocumentType.GENERAL) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = true;
        propertyController.insertedPerson = false;
        propertyController.korale = true;
        propertyController.landId = false;
        propertyController.landName = true;
        propertyController.lotNo = true;
        propertyController.nameOfScheme = false;
        propertyController.nameOfServayor = true;
        propertyController.numberOfBasements = false;
        propertyController.numberOfBlocks = false;
        propertyController.numberOfStories = false;
        propertyController.partitionDate = false;
        propertyController.pattu = true;
        propertyController.planDate = true;
        propertyController.planNo = true;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = true;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = true;
        propertyController.toggle = false;
        propertyController.village = true;
        propertyController.propertyDetails = false;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
    }

    if (documentTypeId == DocumentType.GOV_LANDS) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = true;
        propertyController.insertedPerson = false;
        propertyController.korale = false;
        propertyController.landId = false;
        propertyController.landName = true;
        propertyController.lotNo = true;
        propertyController.nameOfScheme = false;
        propertyController.nameOfServayor = false;
        propertyController.numberOfBasements = false;
        propertyController.numberOfBlocks = false;
        propertyController.numberOfStories = false;
        propertyController.partitionDate = false;
        propertyController.pattu = false;
        propertyController.planDate = false;
        propertyController.planNo = true;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = false;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = true;
        propertyController.toggle = false;
        propertyController.village = true;
        propertyController.propertyDetails = false;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = true;
        propertyController.dateOfGrant = true;
    }

    if (documentTypeId == DocumentType.MOVABLE) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = false;
        propertyController.insertedPerson = false;
        propertyController.korale = false;
        propertyController.landId = false;
        propertyController.landName = false;
        propertyController.lotNo = false;
        propertyController.nameOfScheme = false;
        propertyController.nameOfServayor = false;
        propertyController.numberOfBasements = false;
        propertyController.numberOfBlocks = false;
        propertyController.numberOfStories = false;
        propertyController.partitionDate = false;
        propertyController.pattu = false;
        propertyController.planDate = false;
        propertyController.planNo = false;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = false;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = false;
        propertyController.toggle = false;
        propertyController.village = false;
        propertyController.propertyDetails = true;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
    }

    if (documentTypeId == DocumentType.NORMAL_TRUST) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = false;
        propertyController.insertedPerson = false;
        propertyController.korale = false;
        propertyController.landId = false;
        propertyController.landName = false;
        propertyController.lotNo = false;
        propertyController.nameOfScheme = false;
        propertyController.nameOfServayor = false;
        propertyController.numberOfBasements = false;
        propertyController.numberOfBlocks = false;
        propertyController.numberOfStories = false;
        propertyController.partitionDate = false;
        propertyController.pattu = false;
        propertyController.planDate = false;
        propertyController.planNo = false;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = false;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = false;
        propertyController.toggle = false;
        propertyController.village = false;
        propertyController.propertyDetails = true;
        propertyController.nameOfCharitable = true;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
    }

    if (documentTypeId == DocumentType.SPECIAL_CONDOMINIUM_DEEDS) {
        propertyController.allotmentNo = false;
        propertyController.assesmentNo = true;
        propertyController.insertedPerson = false;
        propertyController.korale = false;
        propertyController.landId = false;
        propertyController.landName = true;
        propertyController.lotNo = true;
        propertyController.nameOfScheme = true;
        propertyController.nameOfServayor = true;
        propertyController.numberOfBasements = true;
        propertyController.numberOfBlocks = true;
        propertyController.numberOfStories = true;
        propertyController.partitionDate = false;
        propertyController.pattu = false;
        propertyController.planDate = false;
        propertyController.planNo = false;
        propertyController.regPlanNo = false;
        propertyController.statementOfClaimNo = false;
        propertyController.street = true;
        propertyController.survaryAndPartitionDate = false;
        propertyController.titlePlanNo = false;
        propertyController.toggle = false;
        propertyController.village = true;
        propertyController.propertyDetails = false;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
        propertyController.surveyPlanNo = true;
        propertyController.surveyPlanDate = true;
        propertyController.nameOfArchitect = true;
    }

    if (documentTypeId == DocumentType.SPECIAL_DIVISION_DEEDS) {
        propertyController.allotmentNo = true;
        propertyController.assesmentNo = false;
        propertyController.insertedPerson = true;
        propertyController.korale = false;
        propertyController.landId = false;
        propertyController.landName = true;
        propertyController.lotNo = false;
        propertyController.nameOfScheme = false;
        propertyController.nameOfServayor = false;
        propertyController.numberOfBasements = false;
        propertyController.numberOfBlocks = false;
        propertyController.numberOfStories = false;
        propertyController.partitionDate = true;
        propertyController.pattu = false;
        propertyController.planDate = true;
        propertyController.planNo = true;
        propertyController.regPlanNo = true;
        propertyController.statementOfClaimNo = true;
        propertyController.street = true;
        propertyController.survaryAndPartitionDate = true;
        propertyController.titlePlanNo = false;
        propertyController.toggle = false;
        propertyController.village = false;
        propertyController.propertyDetails = false;
        propertyController.nameOfCharitable = false;
        propertyController.grantNo = false;
        propertyController.dateOfGrant = false;
    }

    return propertyController;
}

  getProvinces(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/provinces');
  }

  getDistricts(provinceId: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/districts/byProvince/' + provinceId);
  }

  getLandRegistries(districtId: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/landRegistries/byDistrict/' + districtId);
  }

  getGramaniladhariDivision(dsDivisionId: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/gnDivisions/byDsDivision/' + dsDivisionId);
  }

  getGNDivisionByLRDivision(lrDivisionId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'gnDivision/byLandRegistryDivision/' + lrDivisionId);
  }

  getGNDivision(id: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'gnDivision/' + id);
  }

  getDivisionalSecretaries(districtId: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/dsDivisions/byDistrict/' + districtId);
  }

  getLocalAuthorities(dsDivisionId: string): Observable<object> {
    return this.httpClient.get(this.BASE_URL + 'location/provincialCouncil/byDsDivision/' + dsDivisionId);
  }


  getDivisions(landRegistryId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'landRegistryDivision/byLandRegistry/' + landRegistryId);
  }

  getDivisionsByFolioType(landRegistryId: number, folioType: string): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'landRegistryDivision/byFolioType/' + landRegistryId + '/' + folioType);
  }

  getDivision(divisionId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'landRegistryDivision/' + divisionId);
  }

  getPaththus(koraleId: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/paththuwa/byKorale/' + koraleId);
  }

  getVillages(gnDivision: number): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'village/gnDivision/' + gnDivision);
  }

  getKorales(): Observable<Object> {
    return this.httpClient.get(this.BASE_URL + 'location/korale');
  }
}
