import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InstallBannerComponent } from './components/install-banner/install-banner.component';
import { IonicModule } from '@ionic/angular';
import { ModalInstallIosComponent } from './components/modal-install-ios/modal-install-ios.component';
import { NgxIonicImageViewerModule } from '@ngx-ionic/image-viewer';

@NgModule({
  imports: [CommonModule, IonicModule, NgxIonicImageViewerModule],
  declarations: [InstallBannerComponent, ModalInstallIosComponent],
  exports: [InstallBannerComponent, ModalInstallIosComponent],
})
export class SharedModule {}
