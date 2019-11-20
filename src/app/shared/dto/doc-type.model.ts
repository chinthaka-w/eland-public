import {DocPage} from './doc-page.model';
import {MetaData} from './meta-data.model';

export class DocType {
  description: string;
  status: string;
  lastUpdatedTime: Date;
  createdTime: Date;
  docPageCollection: DocPage[];
  metaDataCollection: MetaData[];
  lastUpdatedUser: string;
}
