// import { Component, NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './auth/auth.guard';
// // import { DashboardComponent } from './dashboard1/dashboard.component';
// import { environment as env } from '../environments/environment';
// import { UnderMaintenanceComponent } from './under-maintenance/under-maintenance.component';
// import { DashboardComponent } from './dashboard1/dashboard.component';

// // const routes: Routes = [
// //   {
// //     path: "dashboard",
// //     component: DashboardComponent,
// //     canActivate: [AuthGuard]
// //   },
// //   {
// //     path: 'order',
// //     loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
// //     canActivate: [AuthGuard]
// //   },
// //   {
// //     path: 'branding',
// //     loadChildren: () => import('./branding/branding.module').then(m => m.BrandingModule),
// //     canActivate: [AuthGuard]
// //   },
// //   {
// //     path: "",
// //     pathMatch: "full",
// //     children: [],
// //     canActivate: [AuthGuard]
// //   }
// // ];

// const routes: Routes = []

// // routes.push({
// //   path: "dashboard",
// //   component: DashboardComponent,
// //   canActivate: [AuthGuard]
// // });

// if (env.dashboard_module) {
//   routes.push({
//     path: 'dashboard',
//     loadChildren: () => import('./dashboard/dashboard.module').then(child => child.DashboardModule),
//     canActivate: [AuthGuard]
//   });

// } else {
//   routes.push({
//     path: "dashboard",
//     component: DashboardComponent,
//     canActivate: [AuthGuard]
//   });
// }

// if (env.order_module) {
//   routes.push({
//     path: 'order',
//     loadChildren: () => import('./order/order.module').then(child => child.OrderModule),
//     canActivate: [AuthGuard]
//   });
// }

// if (env.branding_module) {
//   routes.push({
//     path: 'branding',
//     loadChildren: () => import('./branding/branding.module').then(child => child.BrandingModule),
//     canActivate: [AuthGuard]
//   });
// }

// if (env.event_module) {
//   routes.push({
//     path: 'event',
//     loadChildren: () => import('./event/event.module').then(child => child.EventModule),
//     canActivate: [AuthGuard]
//   });
// }

// if (env.scheme_module) {
//   routes.push({
//     path: 'scheme',
//     loadChildren: () => import('./scheme/scheme.module').then(child => child.SchemeModule),
//     canActivate: [AuthGuard]
//   });
// }

// if (env.compliance_module) {
//   routes.push({
//     path: 'compliance',
//     loadChildren: () => import('./compliance/compliance.module').then(child => child.ComplianceModule),
//     canActivate: [AuthGuard]
//   });
// }

// if (env.compliance_module || env.incentive_module) {
//   routes.push({
//     path: 'master',
//     loadChildren: () => import('./master/master.module').then(child => child.MasterModule),
//     canActivate: [AuthGuard]
//   });
// }

// if (env.incentive_module) {
//   routes.push({
//     path: 'report',
//     loadChildren: () => import('./report/report.module').then(child => child.ReportModule),
//     canActivate: [AuthGuard]
//   });
// }

// routes.push({
//   path: "",
//   pathMatch: "full",
//   children: [],
//   canActivate: [AuthGuard]
// });

// routes.push({
//   path: 'undermaintenance',
//   component: UnderMaintenanceComponent
// })

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
