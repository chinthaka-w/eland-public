import {DocPageMetaData} from './doc-page-meta-data.model';
import {NewNotaryDoc} from './new-notary-doc.model';

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
