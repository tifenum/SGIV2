import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit {
  stock: any;
  transferType: any;
  selectedAccount: any;
  quantity: any;
  stockSymbol: any;
  stockData: any;
  validity: any;
  balance: any;
  cost: number = 0;
  accounts: any[] = []; // Add accounts property

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private productService: ProductService,
    private accountsService: AccountsService,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private router : Router,
    private toastController: ToastController
  ) {
    this.route.paramMap.subscribe(params => {
      if (params.has('symbol')) {
        const symbol = params.get('symbol');
        this.stock = history.state.stockData;
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.stockSymbol = params.get('symbol');
      this.stockData = this.productService.getStockBySymbol(this.stockSymbol);
      this.quantity = 0;
      this.validity = 1;
      this.stock = 0;
      this.balance = '';
    });
    this.getAccounts();
  }
  
  async getAccounts() {
    try {
      const accountsObservable = await this.accountsService.getAccounts();
      accountsObservable.subscribe(
        response => {
          this.accounts = response.accounts; // Assign fetched accounts to accounts property
          console.log('Accounts:', this.accounts);
        },
        error => {
          console.error('Error fetching accounts:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async buy(stock: any, quantity: number) {
    if (!this.selectedAccount) {
      this.presentToast('No account selected', 'danger');
      return;
    }
    const totalCost = stock.price * quantity;
    if (this.balance < totalCost) {
      this.presentToast('Insufficient balance', 'danger');
      return;
    }

    const payload = {
      accountId: this.selectedAccount,
      stockData: stock,
      quantity
    };

    try {
      const response = await this.accountsService.buyStock(payload);
      const orderData = {
        date: new Date(),
        symbol: stock.symbol,
        price: stock.price,
        quantityOrdered: quantity,
        status: 'Completed',  // Or any other status based on your logic
        orderType: 'Bought'      // This can be dynamic if you support multiple order types
      };
      
      this.authService.addUserHistory(orderData);
      const operationdata = {
        symbol: stock.symbol,
        price: stock.price,
        quantityOrdered: quantity,
        change: stock.change,
        owner: this.selectedAccount,
        date: new Date(),
      };
      this.authService.addUserOperation(operationdata)
      const mess = `${stock.symbol} bought successfully`;
      this.presentToast('Stock purchased successfully!', 'success');
      await this.notificationService.addNotification(mess, 'green'); // Add green color for buy notifications
      console.log('Stock purchased successfully:', response);
      this.balance -= totalCost; // Update balance locally
      
      const profondeurData = {
        symbol: stock.symbol,
        sold: 0,
        buy: stock.price, // Assuming buy is not applicable in sell context
        qteA: quantity, // Assuming qteA is not applicable in sell context
        qteV: 0
      };
      this.productService.addProfondeur(stock.symbol, profondeurData).subscribe(
        res => {
          console.log('Profondeur data saved:', res);
        },
        err => {
          console.error('Error saving profondeur data:', err);
        }
      );
      window.location.reload()
    } catch (error) {
      console.error('Error buying stock:', error);
      this.presentToast('Error buying stock', 'danger');
      window.location.reload()
    }
      
    
}


  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  incrementQuantity() {
    this.quantity++;
    this.updateCost();
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateCost();
    }
  }

  incrementValidity() {
    this.validity++;
  }

  decrementValidity() {
    if (this.validity > 1) {
      this.validity--;
  }
}

updateCost() {
  if (this.stockData && this.stockData.price) {
    this.cost = this.quantity * this.stockData.price;
  }
}

onAccountChange(accountId: string) {
  const selectedAccount = this.accounts.find(account => account._id === accountId);
  if (selectedAccount) {
    this.balance = selectedAccount.solde;
  }
}

navigateBack(){
  this.router.navigate(['/home'])
}
}
