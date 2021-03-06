import {DocPageMetaData} from './doc-page-meta-data.model';

export class MetaData {
  metaKey: string;
  description: string;
  status: string;
  lastUpdatedTime: Date;
  createdTime: Date;
  docPageMetaDataCollection: DocPageMetaData[];
  docTypeId: number;
  lastUpdatedUser: string;
}
