// my-loader.component.ts
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../helpers/services/loader2.service';
import { StorageService } from '../../helpers/services/storage.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './common-loader.component.html',
  styleUrls: ['./common-loader.component.scss']
})
export class CommonLoaderComponent implements OnInit {

  loading: boolean;

  constructor(
    private loaderService: LoaderService,
    private storageServ: StorageService
    ) {

    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });

  }
  ngOnInit() {
  }

}
