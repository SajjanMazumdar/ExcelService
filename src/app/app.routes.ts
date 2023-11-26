import { Routes } from '@angular/router';
import { ExcelServiceModule } from './excel-service/excel-service.module';
import { ListComponent } from './excel-service/list/list.component';

export const routes: Routes = [
    {
        path: 'excel',
        loadChildren: () => import('./excel-service/excel-service.module').then(child => child.ExcelServiceModule)
    },
    {
        path: 'list',
        component: ListComponent
    }
];
