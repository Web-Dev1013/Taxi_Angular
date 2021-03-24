import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { baseUrl, tinyKey } from '../../../../environments/environment';
import { AngularDelegate } from '@ionic/angular';
import { StorageService } from '../../helpers/services/storage.service';
import { GalleryImageServiceService } from '../../helpers/services/gallery-image-service.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

declare var tinymce: any;
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() editorData: any;
  @Input() empty: any;
  @Output() editorDataToParent = new EventEmitter<any>();
  @Output() revisions = new EventEmitter<any>();
  @ViewChild('editor') editor: ElementRef;
  public editorForm: FormGroup;
  disabled: boolean;
  fileToUpload: any;
  imageUrl: any;
  interval: any;
  touched = false;
  bearerToken: any;
  initData: any[] = [];
  stateFlag: String = 'false';
  progressInfos: any[] = [];
  message: string[] = [];
  selectedFiles?: FileList;
  imageName: string = '';
  imageSize: string = '';
  fileInfos: any[] = [];

  baseUrl: string = 'http://localhost:8080/api/files/'; // FIXME: URL should not be hard coded.

  public tinyEditorKey: string = tinyKey;

  tinymceInit: any;
  constructor(
    private fb: FormBuilder,
    private galleryImageService: GalleryImageServiceService,
    private storageService: StorageService
  ) {
    this.editorForm = this.fb.group({
      editor: new FormControl(' ', [Validators.required]),
    });

    this.bearerToken = this.storageService.get('token');

    this.tinyMceInit();
  }

  ngOnInit() {
    // console.log('baseUrl in ngoninit', baseUrl);
    // if(this.empty){
    //   this.editorForm.patchValue({
    //     editor: ' ',
    //   });
    // }
    this.getChangesInMce();
    this.editorForm.patchValue({
      editor: this.editorData,
    });
  }

  ngAfterViewInit() {}

  get errorControl() {
    return this.editorForm.controls;
  }
  sendValueToParent(event) {
    const input = this.editorForm.value.editor;
    if (input) {
      if (event.event.code === 'Backspace' && !input) {
        this.touched = true;
        this.editorDataToParent.emit(' ');
      } else {
        this.editorDataToParent.emit(input);
      }
    } else {
      this.tinyMceInit();
      this.touched = true;
    }
  }

  sendValue() {
    this.editorDataToParent.emit(this.editorForm.value.editor);
  }

  getChangesInMce() {
    const input = this.editorForm.value.editor;
    this.editorForm.valueChanges.subscribe((x) => {
      // console.log('x', x);

      if (x.editor === '') {
        // console.log('empty');
        this.touched = true;
        this.editorDataToParent.emit(' ');
      }
      this.interval = setInterval(() => {
        // //console.log('changes in editor',this.editorForm.value);
        this.revisions.emit(this.editorForm.value);
      }, 180000);
    });
  }

  tinyMceInit() {
    this.tinymceInit = {
      height: 500,
      automatic_uploads: true,
      toolbar_sticky: true,
      toolbar_mode: 'sliding',
      image_advtab: true,
      file_picker_types: 'file image media',
      images_upload_credentials: true,
      relative_urls: false,
      remove_script_host: true,
      document_base_url: '/',
      convert_urls: true,
      placeholder: 'Enter Content',
      images_upload_base_path: `${baseUrl}`,
      // sticky_offset: 100,
      // sticky_toolbar_container: '.tox-toolbar',
      // sticky_menubar_container: '.tox-menubar',
      // sticky_statusbar_container: '.tox-statusbar',
      menubar: 'favs file edit view insert format tools table help',
      menu: {
        file: {
          title: 'File',
          items: 'newdocument restoredraft | preview | print ',
        },
        edit: {
          title: 'Edit',
          items: 'undo redo | cut copy paste | selectall | searchreplace',
        },
        view: {
          title: 'View',
          items:
            'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
        },
        insert: {
          title: 'Insert',
          items:
            'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
        },
        format: {
          title: 'Format',
          items:
            'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
        },
        tools: {
          title: 'Tools',
          items: 'spellchecker spellcheckerlanguage | code wordcount',
        },
        table: {
          title: 'Table',
          items: 'inserttable | cell row column | tableprops deletetable',
        },
        help: { title: 'Help', items: 'help' },
        favs: {
          title: 'My Favorites',
          items: 'code visualaid | searchreplace | emoticons',
        },
      },
      plugins: [
        'stickytoolbar autoresize',
        'advlist autolink link image lists charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
        'table emoticons template paste help',
      ],
      toolbar:
        'undo redo | formatselect | bold italic backcolor | tenCustomButton image tenImageGallery tenResponsiveVideo | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',

      setup: (editor) => {
        editor.ui.registry.addButton('tenImageGallery', {
          icon: 'image',
          tooltip: 'Insert a Gallery Image',
          disabled: true,
          onAction(_) {

          },
          onSetup(buttonApi) {
            const editorEventCallback = (eventApi) => {
              buttonApi.setDisabled(
                eventApi.element.nodeName.toLowerCase() === 'time'
              );
            };
            editor.on('NodeChange', editorEventCallback);

            /* onSetup should always return the unbind handlers */
            return (buttonApiHandler) => {
              editor.off('NodeChange', editorEventCallback);
            };
          },
        });

        editor.ui.registry.addButton('tenResponsiveVideo', {
          icon: 'embed',
          tooltip: 'Insert a Responsive Video',
          disabled: true,
          onAction(_) {
            editor.windowManager.open({
              title: 'Video Link',
              body: {
                type: 'panel',
                items: [
                  {
                    name: 'link',
                    type: 'input',
                    label: 'Video Link',
                  },
                ],
              },
              initialData: {
                link: 'http://www.youtube.com/embed/n_dZNLr2cME?rel=0&hd=1',
              },
              buttons: [
                {
                  text: 'Close',
                  type: 'cancel',
                  onclick: 'close',
                },
                {
                  text: 'Insert',
                  type: 'submit',
                  primary: true,
                  enabled: false,
                },
              ],
              onSubmit(api) {
                const data = api.getData().link;
                if (data) {
                  editor.insertContent(`
                    <div class="videoWrapper">
                      <iframe width="560" height="349" src="${data}" frameborder="0" allowfullscreen></iframe>
                    </div>
                  `);
                }

                api.close();
              },
            });
          },
          onSetup(buttonApi) {
            const editorEventCallback = (eventApi) => {
              buttonApi.setDisabled(
                eventApi.element.nodeName.toLowerCase() === 'time'
              );
            };
            editor.on('NodeChange', editorEventCallback);

            /* onSetup should always return the unbind handlers */
            return (buttonApiHandler) => {
              editor.off('NodeChange', editorEventCallback);
            };
          },
        });

        editor.ui.registry.addButton('tenCustomButton', {
          icon: 'link',
          tooltip: 'Insert Stylized Link',
          disabled: true,
          onAction(_) {
            editor.windowManager.open({
              title: 'TEN Button',
              body: {
                type: 'panel',
                items: [
                  {
                    name: 'text',
                    type: 'input',
                    label: 'Text to Display',
                  },
                  {
                    name: 'url',
                    type: 'input',
                    label: 'Link to Open',
                  },
                ],
              },
              buttons: [
                {
                  text: 'Close',
                  type: 'cancel',
                  onclick: 'close',
                },
                {
                  text: 'Insert',
                  type: 'submit',
                  primary: true,
                  enabled: false,
                },
              ],
              initialData: {
                text: editor.selection.getContent(),
                url: editor.selection.getContent(),
              },
              onSubmit(api) {
                const { url, text = '' } = api.getData();

                if (url) {
                  // insert markup
                  editor.insertContent(
                    `<a href="${url}" target="_blank" class="ten--specialized-button">${text}</a>`
                  );
                }

                // close the dialog
                api.close();
              },
            });
          },
          onSetup(buttonApi) {
            const editorEventCallback = (eventApi) => {
              buttonApi.setDisabled(
                eventApi.element.nodeName.toLowerCase() === 'time'
              );
            };
            editor.on('NodeChange', editorEventCallback);

            /* onSetup should always return the unbind handlers */
            return (buttonApiHandler) => {
              editor.off('NodeChange', editorEventCallback);
            };
          },
        });
      },
      images_upload_handler: function serverSideImageUpload(
        blobInfo,
        success,
        failure,
        progress
      ) {
        let xhr;
        let formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', `${baseUrl}/contents/image-uploader`);
        xhr.setRequestHeader(
          'Authorization',
          `Bearer ${localStorage.getItem('token')}`
        );
        xhr.upload.onprogress = (e) => {
          progress((e.loaded / e.total) * 100);
        };
        xhr.onload = () => {
          let json;
          if (xhr.status === 403) {
            failure('Something went wrong . Please try again', {
              remove: true,
            });
            return;
          }
          if (xhr.status < 200 || xhr.status >= 300) {
            failure('Something went wrong . Please try again');
            return;
          }
          json = JSON.parse(xhr.responseText);
          if (!json || typeof json.data !== 'string') {
            failure('Something went wrong . Please try again');
            return;
          }
          success(`${baseUrl}${json.data}`);
          // console.log('===baseUrl==', `${baseUrl}`);

          // console.log('path', `${baseUrl}${json.data}`);
        };
        xhr.onerror = () => {
          failure('Something went wrong . Please try again');
        };
        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
        // //console.log('formdata', blobInfo.blob(), blobInfo.filename());
      },
    };
  }

  // init define function
  initDefine() {
    this.getListFiles();
    let componentReference = this;
    setTimeout(function () {
      let initData: any = window.localStorage.getItem('initData');
      initData = JSON.parse(initData);
      setTimeout(function () {
        let imageSection = document.createElement('div');
        imageSection.setAttribute(
          'style',
          'overflow-y: auto; background: none'
        );
        imageSection.setAttribute('class', 'image-section');
        let uploadBtn = document.createElement('button');
        uploadBtn.setAttribute('class', 'btn btn-secondary upload_btn p-3');
        uploadBtn.addEventListener('click', (e) => {
          window.localStorage.setItem('replaceId', '0');
          componentReference.uploadFunc();
        });
        uploadBtn.innerHTML = 'UPLOAD';
        let uploadFile = document.createElement('input');
        uploadFile.type = 'file';
        uploadFile.setAttribute('id', 'file');
        uploadFile.setAttribute(
          'style',
          'opacity: 0; position: absolute; top: 0'
        );
        uploadFile.addEventListener('change', (e) => {
          componentReference.uploadImage(e);
        });
        let imageContents =
          '<div class="d-flex"><div class="upload"></div></div><div style="border-bottom:1px solid #151515"></div><div class="row" style="max-height: 300px">';
        initData.map(function (item: any, index: any) {
          imageContents +=
            '<div class="col-sm-4 d-flex mt-3"><div><div class="p-1 rounded-circle image_item d-flex"><img id="' +
            item._id +
            '" alt="' +
            item.title +
            '" style="width: 100px; height: 100px" src="assets/' +
            item.fileName +
            '" class="img-thumbnail img-fluid btn img_item" name="' +
            item.flag +
            '"></div><p id="caption_' +
            item._id +
            '" class="m-0 text-center btn d-block caption">' +
            item.caption +
            '</p></div><div class="btn remove-image"><svg width="24" height="24"><g fill-rule="nonzero"><path d="M19 4a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6c0-1.1.9-2 2-2h14zM5 6v12h14V6H5z"></path><path d="M14.4 8.6l1 1-2.3 2.4 2.3 2.4-1 1-2.4-2.3-2.4 2.3-1-1 2.3-2.4-2.3-2.4 1-1 2.4 2.3z"></path></g></svg></div></div>';
        });

        imageContents += '</div>';
        imageSection.innerHTML = imageContents;
        let modalBody = <HTMLDivElement>(
          document.querySelector('[role=tabpanel]')
        );

        setTimeout(() => {
          let captionBtn = document.querySelectorAll('.caption');
          for (var n = 0; n < captionBtn.length; n++) {
            captionBtn[n].addEventListener(
              'click',
              componentReference.changeCaption
            );
          }
        }, 100);

        modalBody.prepend(imageSection);
        if (!(<HTMLDivElement>document.querySelector('.image-caption'))) {
          let imageCaption = document.createElement('div');
          imageCaption.setAttribute('aria-disabled', 'false');
          imageCaption.setAttribute('class', 'tox-form__group');
          imageCaption.innerHTML =
            '<label class="tox-label" for="form-field_7218866513131616404863400">Image Caption</label><input type="text" tabindex="-1" data-alloy-tabstop="true" class="tox-textfield image-caption">';

          setTimeout(() => {
            let imageForm = <HTMLDivElement>(
              document.querySelector('.tox-dialog__body-content .tox-form')
            );
            if (
              imageForm.querySelector('.tox-icon.tox-checkbox-icon__unchecked')
            ) {
              (<HTMLDivElement>(
                imageForm.querySelector(
                  '.tox-icon.tox-checkbox-icon__unchecked'
                )
              )).click();
              imageForm
                .querySelector('.tox-form__grid.tox-form__grid--2col')
                ?.setAttribute('style', 'display: none');
              imageForm.appendChild(imageCaption);
            }
          }, 20);
        }

        let saveBtn = <HTMLButtonElement>document.querySelector('[title=Save]');
        saveBtn.addEventListener('click', componentReference.saveImageInfo);

        (<HTMLButtonElement>document.querySelector('.upload')).appendChild(
          uploadBtn
        );
        (<HTMLButtonElement>document.querySelector('.upload')).appendChild(
          uploadFile
        );
        document
          .querySelector('[role=tabpanel]')
          ?.setAttribute('style', 'height: auto !important');
        document
          .querySelector('[role=dialog]')
          ?.setAttribute('style', 'max-width: 600px !important');

        var imageItem = document.querySelectorAll('.image_item img');
        for (var i = 0; i < imageItem.length; i++) {
          imageItem[i].addEventListener('click', function (e: any) {
            (<HTMLInputElement>document.querySelector('#file')).click();
            window.localStorage.setItem('replaceId', e.target.id);
            componentReference.stateFlag = e.target.name;
          });
        }

        var removeImage = document.querySelectorAll('.remove-image');
        for (var j = 0; j < removeImage.length; j++) {
          removeImage[j].addEventListener('click', function (e: any) {
            if (confirm('Do you really want to delete?') == true) {
              componentReference.removeImage(e);
            }
          });
        }
      }, 100);

      // if (window.localStorage.getItem("replaceId") == "0") {
      (<HTMLDivElement>(
        document.querySelector('.tox-dialog__body')
      )).addEventListener('click', function (e: any) {
        if (e.target.className == 'tox-dialog__body-nav-item tox-tab') {
          if (<HTMLDivElement>document.querySelector('.image-section')) {
            (<HTMLDivElement>document.querySelector('.image-section')).remove();

            setTimeout(() => {
              if (!(<HTMLDivElement>document.querySelector('.image-caption'))) {
                let imageCaption = document.createElement('div');
                imageCaption.setAttribute('aria-disabled', 'false');
                imageCaption.setAttribute('class', 'tox-form__group');
                imageCaption.innerHTML =
                  '<label class="tox-label" for="form-field_7218866513131616404863400">Image Caption</label><input type="text" tabindex="-1" data-alloy-tabstop="true" class="tox-textfield image-caption">';

                setTimeout(() => {
                  let imageForm = <HTMLDivElement>(
                    document.querySelector('.tox-form__group')
                  );
                  if (
                    imageForm.querySelector(
                      '.tox-icon.tox-checkbox-icon__unchecked'
                    )
                  ) {
                    (<HTMLDivElement>(
                      imageForm.querySelector(
                        '.tox-icon.tox-checkbox-icon__unchecked'
                      )
                    )).click();
                    imageForm
                      .querySelector('.tox-checkbox')
                      ?.setAttribute('style', 'display: none');
                    imageForm.appendChild(imageCaption);
                  }
                }, 20);
              }
            }, 50);
            componentReference.initDefine();
          }
        }
      });
      // }
    }, 200);
  }

  getListFiles(): void {
    this.galleryImageService.getListFiles().subscribe(
      (res: any) => {
        let componentReference = this;
        if (res.body != undefined) {
          componentReference.initData = [];
          res.body.imageInfos.map(function (item: any, index: any) {
            componentReference.initData.push(item);
          });
          window.localStorage.setItem(
            'initData',
            JSON.stringify(componentReference.initData)
          );
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  changeCaption(e: any) {
    let oldCaption = e.target.innerHTML;
    let oldImage = e.target.parentNode.firstChild.firstChild;
    let oldImageUrl = <HTMLInputElement>(
      document.querySelectorAll('.tox-textfield')[0]
    );
    oldImageUrl.value = 'assets/' + oldImage.src.split('assets/')[1];
    (<HTMLInputElement>document.querySelectorAll('.tox-textfield')[1]).value =
      oldImage.alt;
    (<HTMLInputElement>document.querySelectorAll('.tox-textfield')[2]).value =
      '100';
    (<HTMLInputElement>document.querySelectorAll('.tox-textfield')[3]).value =
      '100';
    (<HTMLInputElement>(
      document.querySelectorAll('.tox-textfield')[4]
    )).value = oldCaption;
    window.localStorage.setItem('replaceId', oldImage.id);
    console.log('ID', window.localStorage.getItem('replaceId'));
    this.stateFlag = 'true';
    oldImageUrl.setAttribute('readonly', 'true');
  }

  uploadFunc() {
    (<HTMLInputElement>document.querySelector('#file')).click();
  }

  saveImageInfo() {
    var componentReference = this;
    let fileName = <HTMLInputElement>(
      document.querySelectorAll('.tox-textfield')[0]
    );
    let altData = <HTMLInputElement>(
      document.querySelectorAll('.tox-textfield')[1]
    );
    let caption = <HTMLInputElement>(
      document.querySelectorAll('.tox-textfield')[4]
    );
    let replaceId = window.localStorage.getItem('replaceId');
    this.stateFlag = 'true';

    setTimeout(function () {
      componentReference.galleryImageService
        .saveImageInfo(
          replaceId,
          fileName.value,
          altData.value,
          caption.value,
          componentReference.stateFlag
        )
        .subscribe(
          (event: any) => {
            if (event) {
              let textContent = <HTMLIFrameElement>(
                document.querySelector('#editor_ifr')
              );
              let figCaption = textContent.contentWindow?.document.querySelectorAll(
                '#tinymce figcaption'
              );
              if (figCaption) {
                (<HTMLElement>figCaption[figCaption.length - 2]).innerHTML =
                  caption.value;
              }
            }
          },
          (err: any) => {}
        );
    }, 100);
  }

  removeImage(e: any) {
    let selectedImage;
    if (e.target.tagName == 'svg') {
      selectedImage =
        e.target.parentNode.parentNode.firstChild.firstChild.firstChild;
    } else if (e.target.tagName == 'path') {
      selectedImage =
        e.target.parentNode.parentNode.parentNode.parentNode.firstChild
          .firstChild.firstChild;
    }
    let removeImageId: any = selectedImage.id;
    console.log(removeImageId);
    this.galleryImageService.removeImage(removeImageId).subscribe(
      (event: any) => {
        if (event) {
          if (<HTMLDivElement>document.querySelector('.image-section')) {
            (<HTMLDivElement>document.querySelector('.image-section')).remove();
            setTimeout(() => {
              this.initDefine();
            }, 20);
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  // Create upload button in tinyMCE plugin
  uploadImage(event: any) {
    this.selectedFiles = event.target.files;
    this.message = [];
    this.progressInfos = [];
    this.uploadFiles();
  }

  //uploading selected files
  uploadFiles(): void {
    this.message = [];
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
        this.imageName = this.selectedFiles[i].name;
        this.imageUrl = 'assets/' + this.selectedFiles[i].name;
        this.imageSize = this.selectedFiles[i].size + 'bytes';
      }
    }
  }

  //upload method
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.imageUrl = '';
    if (file) {
      this.galleryImageService
        .upload(file, window.localStorage.getItem('replaceId'))
        .subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressInfos[idx].value = Math.round(
                (100 * event.loaded) / event.total
              );
              if (<HTMLDivElement>document.querySelector('.image-section')) {
                (<HTMLDivElement>(
                  document.querySelector('.image-section')
                )).remove();
                this.initDefine();
              }
            } else if (event instanceof HttpResponse) {
              const msg = 'Uploaded the file successfully: ' + file.name;
              this.message.push(msg);
              this.fileInfos.push({
                name: file.name,
                url: this.baseUrl + file.name,
              });
              if (<HTMLDivElement>document.querySelector('.image-section')) {
                (<HTMLDivElement>(
                  document.querySelector('.image-section')
                )).remove();
                this.initDefine();
              }
              window.localStorage.setItem('replaceId', event.body);
            }
          },
          (err: any) => {
            this.progressInfos[idx].value = 0;
            const msg = 'Could not upload the file: ' + file.name;
            this.message.push(msg);
            this.fileInfos.push(file.name);
          }
        );
    }
  }

  onResize(event: any) {
    if (<HTMLDivElement>document.querySelector('.image-section')) {
      (<HTMLDivElement>document.querySelector('.image-section')).remove();
      this.initDefine();
    }
  }

  ngOnDestroy() {}

  // the funtion of uploading blob images

  // file_picker_callback(cb, value, meta) {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //   input.onchange = () => {
  //     const file = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const id = 'blobid' + new Date().getTime();
  //       const blobCache = tinymce.activeEditor.editorUpload.blobCache;
  //       const result1 = reader.result as string;
  //       const base64 = result1.split(',')[1];
  //       const blobInfo = blobCache.create(id, file, base64);
  //       blobCache.add(blobInfo);
  //       cb(blobInfo.blobUri(), { title: file.name });
  //     };
  //     reader.readAsDataURL(file);
  //   };
  //   input.click();
  // }
}
