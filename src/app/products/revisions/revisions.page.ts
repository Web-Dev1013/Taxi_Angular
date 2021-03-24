import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Location } from '@angular/common';
import {
  DiffContent,
  DiffResults,
  DiffTableFormat,
} from 'ngx-text-diff/lib/ngx-text-diff.model';
import { StorageService } from '../../Accessories/helpers/services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RevisionsService } from '../../Accessories/helpers/services/revisions.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-revisions',
  templateUrl: './revisions.page.html',
  styleUrls: ['./revisions.page.scss'],
})
export class RevisionsPage implements OnInit {
  revisions = [];
  revisionId: string;
  stepValue: number;
  recentVersion: any;
  selectedRevision: any;
  currentVersionTitle = '';
  selectedRevisionTitle = '';
  currentVersionDescription = '';
  selectedRevisionDescription = '';
  currentVersionBody = '';
  selectedRevisionBody = '';
  categoryID: string;
  postId: string;
  diffFormat: DiffTableFormat = 'SideBySide';
  diffShowToolbar = false;
  diffHideMatchingLines = false;
  subCategoryId: string;
  compare = true;
  synchronize = false;
  constructor(
    private ionicStorage: Storage,
    private location: Location,
    private storageServ: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private revisionServ: RevisionsService,
    private loadingCtrl: LoadingController
  ) {
    this.revisions = JSON.parse(this.storageServ.get('revisions'));
    // console.log('4567890-', this.revisions.length);
    // this.stepValue = (this.revisions.length >=1) ? 1 : 0;
    // //console.log('=====',this.stepValue);

    this.recentVersion = JSON.parse(this.storageServ.get('recentVersion'));
    this.categoryID = this.activatedRoute.snapshot.paramMap.get('categorySlug');
    // console.log('this.categoryId', this.categoryID);
    this.postId = this.activatedRoute.snapshot.paramMap.get('postSlug');
    this.subCategoryId = this.activatedRoute.snapshot.paramMap.get(
      'subCategorySlug'
    );

    if (this.postId) {
      this.getRevisonsForPost();
    }
    // //console.log('recent v',this.recentVersion.title);
  }

  ngOnInit() {
    this.revisionId = this.revisions[0]._id;
    this.currentVersionTitle = this.recentVersion.title;
    this.selectedRevisionTitle = this.revisions[0].title;
    this.currentVersionDescription = this.recentVersion.description;
    this.selectedRevisionDescription = this.revisions[0].description;
    this.currentVersionBody = this.recentVersion.body;
    this.selectedRevisionBody = this.revisions[0].body;
  }

  onCompareResults() {
    // //console.log('diffResults');
  }

  getRevisions(revision) {
    // console.log('revisions', revision);
    this.selectedRevision = revision;
    this.revisionId = revision._id;
    this.selectedRevision = revision;
    this.selectedRevisionTitle = revision.title;
    this.selectedRevisionDescription = revision.description;
    this.selectedRevisionBody = revision.body;
  }

  active(revision) {
    return revision._id === this.revisionId;
  }

  back() {
    this.location.back();
  }

  restoreAutoSave() {
    if (this.subCategoryId) {
      const formData = {
        title: this.selectedRevisionTitle,
        body: this.selectedRevisionBody,
        description: this.selectedRevisionDescription,
        status: this.recentVersion.status,
      };
      this.revisionServ
        .subCategoryPostRevisions(
          this.activatedRoute.snapshot.paramMap.get('subCategorySlug'),
          this.activatedRoute.snapshot.paramMap.get('postSlug'),
          { ...formData }
        )
        .subscribe((response: any) => {
          // console.log(response.message);
        });
    } else {
      // console.log('category Id', this.categoryID);

      const postData = {
        title: this.selectedRevisionTitle,
        categorySlug: this.activatedRoute.snapshot.paramMap.get('categorySlug'),
        description: this.selectedRevisionDescription,
        status: this.recentVersion.status,
        body: this.selectedRevisionBody,
        contentType: 'post',
      };
      this.revisionServ
        .postRevisions(this.activatedRoute.snapshot.paramMap.get('postSlug'), {
          ...postData,
        })
        .subscribe((response: any) => {
          this.revisions = response.data;
        });
    }
  }

  getRevisionsOnChange(event) {
    this.compare = false;
    // this.presentLoading();
    setTimeout(() => {
      this.compare = true;
      // console.log('revision changed', event.detail.value);
      // console.log('revision', this.revisions[event.detail.value - 1].title);
      this.selectedRevision = this.revisions[event.detail.value - 1];
      // console.log('sleceted Revision', event.detail.value.upper - 1);

      this.revisionId = this.selectedRevision._id;
      this.selectedRevision = this.selectedRevision;
      this.selectedRevisionTitle = this.selectedRevision.title;
      this.selectedRevisionDescription = this.selectedRevision.description;
      this.selectedRevisionBody = this.selectedRevision.body;
      this.onCompareResults();
    }, 100);
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      cssClass: `loader`,
      message: 'Comparing Both sides',
      duration: 100,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  onDiffMethodUpdated(value) {
    this.diffFormat = value;
  }

  getRevisonsForPost() {
    if (this.subCategoryId) {
      this.revisionServ
        .getSubCategoryPostRevision(this.subCategoryId, this.postId)
        .subscribe((response: any) => {
          console.log('subcategory===', response.data);
        });
    } else {
      this.revisionServ
        .getPostRevision(this.postId)
        .subscribe((response: any) => {
          console.log('revisions for post', response.data);
        });
    }
  }
}
