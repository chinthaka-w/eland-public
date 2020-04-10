import { DocumentDTO } from './../../dto/document-dto';
import { DocServiceService } from './../../service/doc-service.service';
import { DocMetaKey } from './../../dto/doc-meta-key.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.css']
})
export class DocPreviewComponent implements OnInit {
  @Input() docMetaKeys: DocMetaKey[];
  docData: DocumentDTO[];

  constructor(private docservice: DocServiceService) { }

  ngOnInit() {
    this.getDocsByDocMeta(this.docMetaKeys);
  }

  getDocsByDocMeta(docMetaKeys: DocMetaKey[]) {
    this.docservice.getDocsByMeta(docMetaKeys).subscribe(
      (response: DocumentDTO[]) => {
        this.docData = response;
      }
    );
  }

}
