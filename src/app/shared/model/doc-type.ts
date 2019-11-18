import {DocPage} from './doc-page';
import {MetaData} from './meta-data';

export class DocType {
  description: string;
  status: string;
  lastUpdatedTime: Date;
  createdTime: Date;
  docPageCollection: DocPage[];
  metaDataCollection: MetaData[];
  lastUpdatedUser: string;
}
