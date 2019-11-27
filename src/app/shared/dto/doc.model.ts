import {DocPage} from './doc-page.model';

export class Doc {
  filePath: string;
  status: string;
  lastUpdatedTime: Date;
  createdTime: Date;
  docPageCollection: DocPage[];
  lastUpdatedUser: string;
}
