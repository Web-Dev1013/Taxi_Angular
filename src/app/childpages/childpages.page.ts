import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarDataService } from '../Accessories/helpers/services/sidebar-data.service';
import { AlertController, IonSlides, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProductGroupsService } from '../Accessories/helpers/services/product-groups.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../Accessories/helpers/services/storage.service';
import { LoaderService } from '../Accessories/helpers/services/loader2.service';
import { PostComment } from '../Accessories/models/post-comment';
import { PostCommentService } from '../Accessories/helpers/services/post-new-comment.service';
import { ToastService } from '../Accessories/helpers/services/toast.service';
import { UsersService } from '../Accessories/helpers/services/users.service';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../Accessories/helpers/services/product.service';
import { Page } from '../users/page';
import { Content } from '../Accessories/models/content';
import { ContentType } from '../Accessories/models/enum.content-types';
import { Category } from '../Accessories/models/category';
import { SubCategoryPost } from '../Accessories/models/subcategory-post';
import { Product } from '../Accessories/models/product';

const TITLE_SEPARATOR = ' | ';
@Component({
  selector: 'app-childpages',
  templateUrl: './childpages.page.html',
  styleUrls: ['./childpages.page.scss'],
})
export class ChildpagesPage implements OnInit {
  @ViewChild('categoryTabSlider', { static: false })
  public categoryTabSlider: IonSlides;

  public readonly APPLICATION_TITLE: string = 'TEN PORTAL';
  private readonly DEFAULT_LOCK_CONTENT: string =
    'Contact Support to unlock this section.';

  // Variables for updating the url
  public slugForProductGroup: string = null;
  public slugForProduct: string = null;
  public slugForCategory: string = null;
  public slugForContent: string = null;
  public slugForSubContent: string = null;

  public page = new Page();
  public data: any;

  public token: any;
  public json: any;

  public listing: any = [];

  public categoryContents: Content[];

  public currentProduct: any; // TODO: Determine Type from usage.

  public sideBarInfo: any;
  public allSidebarChildren: any;

  public categoryTitle: string;
  public categoryDescription: string;
  public productCategories: Category[];
  public title: string;
  public postTitle: string;
  public postDescription: string;

  public contentType: ContentType;

  public childCategories: any;

  public lockedSlideContent: any;
  public lockedProductContent: any;

  public selectedCategory: Category;

  public subCategoryPosts: SubCategoryPost[];
  public subcategoryLockedContent: any;
  public subCategoryTitle: any;
  public subCategoryDescr: any;
  public subCategoryPostBody: any;
  public subPostId: any;
  public subPostTitle: any;
  public subPostDescription: any;
  public subpostLockedContent: any;

  public postBody: any;
  public postsInSubcategory: any = [];

  public userTags: string[] = [];
  public screenWidth: number;
  public productGroupTitle: string;

  public NoCategoriesText: string;
  public baseUrl: string;

  public showLockedContent: boolean;
  public islockedProduct: boolean;
  public displayComments = false;
  public loading: boolean;
  public showChildCategoriesMenu: boolean;
  public lockedSlide: boolean;
  public disabled: boolean;
  public hasContents = true;
  public isSubcategoryLocked: boolean;
  public isSubcategory: boolean;
  public subpostLocked: boolean;

  public productHasNoCategories: boolean;
  public lockedCategory: boolean;

  public commentDisabled: boolean;
  public disablePrevBtn = true;
  public disableNextBtn = false;

  public removeActiveClass = false;
  public isContentDisplayed = true;

  public commentList: PostComment[];
  public isPostCommentEntered = false;
  public postComment: PostComment = new PostComment();
  public isUpdateComment = false;
  public isAddComment = false;
  public replyCommentFlag = false;
  public currentSelectedContent: Content | SubCategoryPost;
  public currentUserId: string;
  public commentTextReply: string;
  public totalCommentCount = 0;

  public slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 4,
  };

  public totalCommentsCount = 0;
  productGroups: any;
  productDetails: Product;

  constructor(
    public alertController: AlertController,
    private dataServ: SidebarDataService,
    private toastServ: ToastService,
    private storage: Storage,
    private groupServ: ProductGroupsService,
    private http: HttpClient,
    private router: Router,
    private ionLoader: LoaderService,
    private commentsService: PostCommentService,
    private activatedRoute: ActivatedRoute,
    private storageServ: StorageService,
    private loaderService: LoaderService,
    private platform: Platform,
    private titleService: Title,
    private userDataService: UsersService,
    private productService: ProductService
  ) {
    // Checking if url already has category, sub-category and/or post value
    this.setupPageSlugs();
    this.setupUserData();

    this.productGroups = this.storageServ.getObject('product-groups');

    platform.ready().then(() => {
      this.screenWidth = platform.width();
      this.page.offset = 1;
    });

    this.loaderService.isLoading.subscribe((v) => (this.loading = v));
  }

  ngOnInit() {
    this.storage.get('productDetails').then((product) => {
      this.islockedProduct = product.locked;
      this.lockedProductContent = product.lockedPageContent || '';
    });

    this.getProductCategories(this.slugForProduct);
  }

  getProductCategories(productSlug: string) {
    this.groupServ
      .getCategoriesAndContents(productSlug)
      .subscribe((response: any) => {
        if (response) {
          this.productCategories = response.data;
          this.productDetails = response.product;

          this.title = this.productDetails.title;
          this.productGroupTitle = this.productDetails.groupId.title;
          this.titleService.setTitle(
            [
              this.title,
              this.productGroupTitle,
              this.APPLICATION_TITLE
            ].join(TITLE_SEPARATOR)
          );



          this.productHasNoCategories = this.productCategories.length === 0;
          if (!this.productHasNoCategories) {
            this.selectedCategory =
              this.productCategories.find(
                ({ slug }) => slug === this.slugForCategory
              ) || this.productCategories[0];
            this.selectCategory(this.selectedCategory); // TODO: 404 if Category is not there.
          }
        }
      });
  }

  public selectCategory(selectedCategory: Category) {
    this.selectedCategory = selectedCategory;
    this.lockedCategory = selectedCategory.locked;
    this.hasContents = selectedCategory.contents.length > 0;
    this.slugForCategory = selectedCategory.slug || null;
    this.lockedSlideContent =
      selectedCategory.lockedPageContent || this.DEFAULT_LOCK_CONTENT;

    if (!selectedCategory.locked && this.hasContents) {
      this.categoryContents = selectedCategory.contents;
      const content =
        this.categoryContents.find(
          ({ slug }) => slug === this.slugForContent
        ) || this.categoryContents[0];
      this.renderContent(content); // TODO: 404 if Content is not there.
    } else {
      this.setCurrentContentUrlPath(this.slugForCategory);
    }
  }

  private renderContent(categoryContent: Content) {
    this.currentSelectedContent = categoryContent;
    this.contentType = categoryContent.contentType;
    this.slugForContent = categoryContent.slug || null;

    if (this.isTypeForSubCategory(this.contentType)) {
      if (categoryContent.posts.length > 0) {
        const subCategoryPost =
          categoryContent.posts.find(
            ({ slug }) => slug === this.slugForSubContent
          ) || categoryContent.posts[0];

        this.slugForSubContent = subCategoryPost.slug;

        // set default post to url if not already assigned, refer setCurrentContentUrlPath method (Rishi)
        if (this.slugForContent !== null) {
          this.setCurrentContentUrlPath(
            this.slugForCategory,
            this.slugForContent,
            this.slugForSubContent
          );
        }

        this.confirmRender(subCategoryPost, categoryContent.slug);
      } else {
        this.resetRenderPostData();
        this.setCurrentContentUrlPath(
          this.slugForCategory,
          this.slugForContent
        );
      }
    } else {
      this.confirmRender(categoryContent);
      this.setCurrentContentUrlPath(this.slugForCategory, this.slugForContent);
    }
  }

  private confirmRender(
    selectedContent: Content | SubCategoryPost,
    parentSlug: string = null
  ) {
    this.hasContents = true;
    this.disabled = false;
    this.isContentDisplayed = true;
    this.postTitle = this.subPostTitle = selectedContent.title;
    this.postDescription = this.subPostDescription =
      selectedContent.description;
    this.postBody = this.subCategoryPostBody = selectedContent.body;

    this.slugForContent =
      this.isTypeForSubContent(selectedContent.contentType) && parentSlug
        ? parentSlug
        : selectedContent.slug;

    this.setCommentsForContent(selectedContent, parentSlug);
  }

  private setCommentsForContent(
    content: Content | SubCategoryPost,
    parentSlug: string = null
  ) {
    this.commentDisabled = content.commentDisabled;

    if (!this.commentDisabled) {
      this.page.offset = 1;
      if (parentSlug) {
        this.getCommentsByPostSlug(
          this.page.offset,
          parentSlug,
          content.slug
        );
      } else {
        this.getCommentsByPostSlug(this.page.offset, this.slugForContent);
      }
    }
  }

  private resetRenderPostData() {
    this.disabled = true;
    this.isContentDisplayed = false;
    this.slugForContent = '';
    this.postTitle = this.subPostTitle = '';
    this.postDescription = this.subPostDescription = '';
    this.postBody = this.subCategoryPostBody = '';
  }

  getCategoryContents(categoryId) {
    this.groupServ.getCategoryContents(categoryId).subscribe(
      (res: any) => {
        this.categoryContents = res.data.datToSend;
        if (this.categoryContents.length === 0) {
          this.hasContents = !true;
        }
      },
      (error) => {}
    );
  }

  initiateContentDisplay(content: Content) {
    this.renderContent(content);
  }

  initiateSubContentDisplay(post: SubCategoryPost, content: Content) {
    this.isSubcategory = false;
    this.commentDisabled = post.commentDisabled;

    this.subPostTitle = post.title;
    this.subPostDescription = post.description;
    this.subCategoryPostBody = post.body;
    this.slugForSubContent = post.slug;

    this.setCurrentContentUrlPath(
      this.slugForCategory,
      this.slugForContent,
      this.slugForSubContent
    );

    if (this.slugForContent && !this.commentDisabled) {
      this.page.offset = 1;
      this.getCommentsByPostSlug(
        this.page.offset,
        this.slugForContent,
        this.slugForSubContent
      );
    }

    if (post.locked) {
      this.subpostLocked = true;
      this.subpostLockedContent = post.lockedPageContent;
    }
  }

  setEditCommentData(
    comment: PostComment,
    commentIndex,
    childIndex?,
    childChildIndex?
  ) {
    this.setDoReplyFlags(commentIndex, childIndex, childChildIndex);
    this.isUpdateComment = true;
    this.isAddComment = false;
    this.postComment.depth = comment.depth;
    this.postComment.parentId = comment.parentId;
    this.postComment.id = comment._id;
    this.postComment.postId = comment.postId;
    this.commentTextReply = comment.commentText;
    comment.doReply = true;
  }

  editComment(comment: PostComment) {
    this.postComment.commentText = this.commentTextReply;
    this.commentsService.updateComment(comment._id, this.postComment).subscribe(
      (response: any) => {
        if (response) {
          this.postComment.commentText = '';
          this.commentList = [];
          this.toastServ.presentToast(response.message, 'success');
          this.getCommentsByPostSlug(
            this.page.offset,
            this.slugForContent,
            this.slugForSubContent ? this.slugForSubContent : null,
            null,
            null,
            true
          );
          this.isPostCommentEntered = false;
          this.postComment = new PostComment();
          this.isUpdateComment = false;
        }
      },
      (error) => {
        this.postComment.commentText = '';
      }
    );
  }

  postNewComment(comment: PostComment) {
    if (this.postComment.commentText && this.slugForContent) {
      // set parentId, depth, postId..

      // Make peace that it is SubCategory Slug not SubCategory POST Slug
      if (this.isTypeForSubCategory(this.contentType)) {
        this.postComment.subcategorySlug = this.slugForContent || null;
        this.postComment.postSlug = this.slugForSubContent;
      } else {
        this.postComment.postSlug = this.slugForContent;
      }

      if (this.postComment.depth == null) {
        this.postComment.depth = 0;
      }

      // call post new comment api
      this.commentsService.postNewComment(this.postComment).subscribe(
        (response: any) => {
          if (response) {
            this.postComment.commentText = '';
            this.commentList = [];
            this.toastServ.presentToast(response.message, 'success');

            this.getCommentsByPostSlug(
              this.page.offset,
              this.slugForContent,
              this.slugForSubContent ? this.slugForSubContent : null
            );

            this.isPostCommentEntered = false;

            this.postComment = new PostComment();
          }
        },
        (error) => {}
      );
    }
  }

  getCommentsByPostSlug(
    page,
    contentSlug,
    subContentSlug = null,
    isFirstLoad: boolean = null,
    event = null,
    appendArr = null
  ) {
    this.commentsService.getComments(page, contentSlug, subContentSlug).subscribe(
      (response: any) => {
        if (isFirstLoad) {
          event.target.complete();
        }
        if (response) {
          this.page.totalPages = response.meta.pages;
          if (this.page.offset === 1) {
            this.listing = response.data;
            this.commentList = response.data;
            this.totalCommentsCount = response.meta.total;
            console.log('listing before else');
          } else {
            if (this.listing) {
              this.listing = [...this.listing, ...response.data];
              // this.listing = this.listing.filter((element, i) => i === this.listing.indexOf(element._id))
              this.commentList = this.listing;
            }
            // this.commentList= [...this.commentList,...response.data]
          }

          this.totalCommentCount = 0;
          // this.commentList = response.data;
          this.commentList.forEach((element) => {
            element.doReply = false;
            this.totalCommentCount++;
            if (element.children.length) {
              element.children.forEach((child) => {
                child.doReply = false;
                this.totalCommentCount++;
                if (child.children.length) {
                  child.children.forEach((child1) => {
                    child1.doReply = false;
                    this.totalCommentCount++;
                  });
                }
              });
            }
          });

          //
        }
      },
      (error) => {}
    );
  }

  markFlag(commentId) {
    this.commentsService.markInAppropriate(commentId).subscribe(
      (response: any) => {
        if (response) {
          this.postComment.commentText = '';
          this.commentList = [];
          this.toastServ.presentToast(response.message, 'success');
          this.getCommentsByPostSlug(
            this.page.offset,
            this.slugForContent,
            this.slugForSubContent ? this.slugForSubContent : null
          );
          this.isPostCommentEntered = false;
          this.postComment = new PostComment();
        }
      },
      (error) => {}
    );
  }

  // for commenting on any post
  setCommentFlag() {
    this.isPostCommentEntered = !!this.postComment.commentText;
  }

  setDoReplyFlags(commentIndex, childIndex?, childChildIndex?) {
    this.commentTextReply = '';
    this.commentList.forEach((element) => {
      element.doReply = false;
      if (element.children.length) {
        element.children.forEach((child) => {
          child.doReply = false;
          if (child.children.length) {
            child.children.forEach((child1) => {
              child1.doReply = false;
            });
          }
        });
      }
    });
    if (childIndex === undefined) {
      this.commentList = this.commentList.map((c) => {
        c.doReply = false;
        return c;
      });

      this.commentList[commentIndex].doReply = true;
    } else if (childChildIndex === undefined) {
      this.commentList = this.commentList.map((c) => {
        c.doReply = false;
        return c;
      });
      this.commentList[commentIndex].children = this.commentList[
        commentIndex
      ].children.map((c) => {
        c.doReply = false;
        return c;
      });

      this.commentList[commentIndex].children[childIndex].doReply = true;
    } else {
      this.commentList = this.commentList.map((c) => {
        c.doReply = false;
        return c;
      });
      this.commentList[commentIndex].children = this.commentList[
        commentIndex
      ].children.map((c) => {
        c.doReply = false;
        return c;
      });
      this.commentList[commentIndex].children[
        childIndex
      ].children = this.commentList[commentIndex].children[
        childIndex
      ].children.map((c) => {
        c.doReply = false;
        return c;
      });
      this.commentList[commentIndex].children[childIndex].children[
        childChildIndex
      ].doReply = true;
    }

    const inter = setInterval(() => {
      let element = document.getElementById('cmt-Reply');
      if (element !== undefined) {
        // element = element.children;
        if (element.children.length !== 0) {
          element = element.children as any;
          element[0].focus();
          clearInterval(inter);
        }
      }
    }, 10);
  }

  changeReplyFlag(i, j?, k?) {
    // if(this.listing){
    //   this.commentList=this.listing
    // }
    if (j === undefined) {
      this.commentList[i].doReply = false;
    } else if (k === undefined) {
      this.commentList[i].children[j].doReply = false;
    } else {
      this.commentList[i].children[j].children[k].doReply = false;
    }
  }

  replyInComment(comment: PostComment) {
    this.isUpdateComment = false;
    this.isAddComment = true;
    this.postComment.parentId = comment._id;
    this.postComment.depth = comment.depth + 1;
    this.postComment.commentText = this.commentTextReply;
    this.postComment.subContentSlug = this.slugForSubContent || null;
    this.postNewComment(this.postComment);
  }

  async openConfirmationDialog(comment) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-popup',
      message: '<strong>Are you sure you want to delete this comment?</strong>',
      buttons: [
        {
          text: 'Delete',
          cssClass: 'delete-button',
          handler: () => {
            this.deleteComment(comment);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'ghost-button',
          handler: (blah) => {},
        },
      ],
    });

    await alert.present();
  }

  deleteComment(comment: PostComment) {
    this.commentsService.deleteComment(comment._id).subscribe(
      (response: any) => {
        if (response) {
          this.postComment.commentText = '';
          this.commentList = [];
          this.toastServ.presentToast(response.message, 'success');
          this.getCommentsByPostSlug(
            this.page.offset,
            this.slugForContent,
            this.slugForSubContent ? this.slugForSubContent : null
          );
          this.isPostCommentEntered = false;
          this.postComment = new PostComment();
        }
      },
      (error) => {}
    );
  }

  async loadPostCommentsInfinitely(event) {
    if (this.page.totalPages > this.page.offset) {
      this.page.offset++;
      await this.getCommentsByPostSlug(
        this.page.offset,
        this.slugForContent,
        this.slugForSubContent ? this.slugForSubContent : null,
        true,
        event
      );
    } else {
      event.target.complete();
    }
  }

  private setupUserData() {
    this.token = this.storageServ.get('token');
    this.currentUserId = this.storageServ.get('userId');
    this.userTags = JSON.parse(this.storageServ.get('tags'));
  }

  private setupPageSlugs() {
    this.slugForProductGroup = this.activatedRoute.snapshot.paramMap.get(
      'product-group'
    );
    this.slugForProduct = this.activatedRoute.snapshot.paramMap.get('product');
    this.slugForCategory = this.activatedRoute.snapshot.paramMap.get(
      'category'
    );
    this.slugForContent = this.activatedRoute.snapshot.paramMap.get('content');
    this.slugForSubContent = this.activatedRoute.snapshot.paramMap.get(
      'sub-content'
    );
  }

  // Method to changed url according to the current category, sub-category and post by first updating the variables respectively
  // .. and then checking if any of those variables are empty
  private setCurrentContentUrlPath(...urls: any) {
    const { category, subCategory, content } = urls;

    this.slugForCategory = category ?? this.slugForCategory;
    this.slugForSubContent = subCategory ?? this.slugForSubContent;
    this.slugForContent = content ?? this.slugForContent;

    window.history.pushState(
      {},
      null,
      [
        ...['product-groups', this.slugForProductGroup, this.slugForProduct],
        ...urls,
      ].join('/')
    );
  }

  isTypeForSubContent(type: ContentType) {
    return type === ContentType.SubCategoryPost || type === undefined;
  }

  isTypeForPost(type: ContentType) {
    return type === ContentType.Post;
  }

  isTypeForSubCategory(type: ContentType) {
    return type === ContentType.SubCategory;
  }

  isContentAPost(content: Content) {
    return content.contentType === ContentType.Post;
  }

  isContentASubcategory(content: Content) {
    return content.contentType === ContentType.SubCategory;
  }

  isEnterPressed(comment: PostComment, event) {
    if (event.which === 13 && this.commentTextReply !== '') {
      this.isUpdateComment
        ? this.editComment(comment)
        : this.replyInComment(comment);
    }
  }

  slideChanged() {
    const prom1 = this.categoryTabSlider.isBeginning();
    const prom2 = this.categoryTabSlider.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? (this.disablePrevBtn = true) : (this.disablePrevBtn = false);
      data[1] ? (this.disableNextBtn = true) : (this.disableNextBtn = false);
    });
  }

  public slideNext(): void {
    this.categoryTabSlider.slideNext();
  }

  public slidePrev(): void {
    this.categoryTabSlider.slidePrev();
  }

  ionViewWillEnter() {}
  checkScreen() {}
}
