import { Routes } from '@angular/router';
import { VendorComponent } from './vendor/vendor.component';

export const rootRouterConfig: Routes = [
    { path: 'vendor', component: VendorComponent, pathMatch:'full' },
];
