import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/authentication/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/authentication/signup/signup.module').then(
        (m) => m.SignupPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'portfolio',
    loadChildren: () =>
      import('./pages/portfolio/portfolio.module').then(
        (m) => m.PortfolioPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ordor',
    loadChildren: () =>
      import('./pages/ordor/ordor.module').then((m) => m.OrdorPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./pages/notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgetpassword',
    loadChildren: () =>
      import('./pages/profile/forgetpassword/forgetpassword.module').then(
        (m) => m.ForgetpasswordPageModule
      ),
      canActivate: [AuthGuard],
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path :'edit-profile',
    loadChildren: () => import('./pages/profile/edit-profile/edit-profile.module').then(m =>m.EditProfilePageModule)
  },
  { path: 'buy/:symbol', loadChildren: () => import('./pages/home/buy/buy.module').then(m => m.BuyPageModule) },
  { path: 'sell/:symbol', loadChildren: () => import('./pages/home/sell/sell.module').then(m => m.SellPageModule) },
  { path: 'intraday/:symbol', loadChildren: () => import('./pages/home/intraday/intraday.module').then(m => m.IntradayPageModule) },
  {
    path: 'add-account',
    loadChildren: () => import('./pages/profile/add-account/add-account.module').then( m => m.AddAccountPageModule)
  },
  
  {
    path: 'transaction/:symbol',
    loadChildren: () => import('./pages/home/transaction/transaction.module').then( m => m.TransactionPageModule)
  },
  {
    path: 'profondeur/:symbol',
    loadChildren: () => import('./pages/home/profondeur/profondeur.module').then( m => m.ProfondeurPageModule)
  },
  {
    path: 'guide',
    loadChildren: () => import('./pages/guide/guide.module').then( m => m.GuidePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reglementation',
    loadChildren: () => import('./pages/reglementation/reglementation.module').then( m => m.ReglementationPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then( m => m.HistoryPageModule),
    canActivate: [AuthGuard],
  },  {
    path: 'releve',
    loadChildren: () => import('./pages/releve/releve.module').then( m => m.RelevePageModule)
  },




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
