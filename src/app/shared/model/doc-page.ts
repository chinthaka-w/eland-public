import {DocPageMetaData} from './doc-page-meta-data';
import {NewNotaryDoc} from './new-notary-doc';

export class DocPage {
  pageName: string;
  status: string;
  lastUpdatedTime: Date;
  createdTime: Date;
  docId: number;
  docTypeId: number;
  lastUpdatedUser: string;
  docPageMetaDataCollection: DocPageMetaData[];
  newNotaryDocCollection: NewNotaryDoc[];
}
