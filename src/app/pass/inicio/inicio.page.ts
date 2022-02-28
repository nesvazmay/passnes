import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { PRUEBA_KEY, DARK_KEY } from '../../guards/intro.guard';
//import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  pass:string=""


  constructor(
    public alertController: AlertController,
    private toastC: ToastController,
    private statusBar: StatusBar,
    private router: Router
  ) {}

  ngOnInit() {
    //this.checarDarkmode();
    //this.hola();
  }

  /*ionViewDidEnter() {  
    SplashScreen.show({
      autoHide: true
    });
  }*/

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

///////////////////  CHECAR MODO OSCURO  ////////////////////////////////////////////////////////

  async checarDarkmode() {
    const a = await Storage.get({key: DARK_KEY});
    if (a.value === 'true') {
      document.body.classList.toggle( 'dark' );
    }
  }

///////////////////  METODO DE ENTRADA  ////////////////////////////////////////////////////////
  
  async entrar(pass) {
    const passs = await Storage.get({key: PRUEBA_KEY});
    if (pass==passs.value) {
      this.router.navigateByUrl('/acceso');
      this.pass = "" // para limpiar contraseña.
      //window.location.href="/acceso";
    } 
    else {
        this.wrongPass();
      }
    }

///////////////////  ALERTA TOAST  ////////////////////////////////////////////////////////

  async wrongPass() {
    const toast = await this.toastC.create({
      color: 'dark',
      cssClass: 'alertaAgregar',
      message: 'Contraseña incorrecta',
      position: 'top',
      duration: 2000,
      animated: true,
      mode: 'ios'
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
  }

} 
