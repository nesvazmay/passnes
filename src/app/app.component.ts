import { Component } from '@angular/core';
//import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { DARK_KEY } from '../app/guards/intro.guard';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private statusBar: StatusBar,
    private platform: Platform,
    public sqlite:SQLite
  ) {
    this.initializeApp();
  }

 
  initializeApp() {
    this.platform.ready().then(() => {
    this.hola();
    this.checarDarkmode();
  });
  }

  async hola() {
    const a = await Storage.get({key: DARK_KEY});
    if (a.value === 'true') {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#1f1f1f');
    } else {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
    }
  }  
  
  async checarDarkmode() {
    const a = await Storage.get({key: DARK_KEY});
    if (a.value === 'true') {
      document.body.classList.toggle( 'dark' );
    }
  }
}
 