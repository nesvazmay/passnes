import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ToastController, Platform } from '@ionic/angular';
import { PRUEBA_KEY, INTRO_KEY } from '../guards/intro.guard';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';



@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})

export class IntroPage implements OnInit {

  pass: any

  @ViewChild(IonSlides) slides: IonSlides;

  constructor(
    private router: Router,
    private toastC: ToastController,
    private statusBar: StatusBar,
    private platform: Platform,
    ) {
      this.initializeApp();
    }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#000000');
  });
  }

  async guardarPass(pass) {
    if(pass.length==4) {
      await Storage.set({key: PRUEBA_KEY, value: pass});
      await Storage.set({key: INTRO_KEY, value: 'true'})
      .then(() => {
      this.pinCreado();
      this.router.navigateByUrl('/bienvenido', { replaceUrl:true });
    })
    .catch(e =>{
      alert("Error" + JSON.stringify(e))
    });
    } else {
      this.pinWrong();
      return;
    }
  }
  
  async pinCreado () {
    const toast = await this.toastC.create({
      color: 'dark',
      cssClass: 'toast',
      message: '¡Tu PIN se ha creado!',
      position: 'top',
      duration: 2000,
      animated: true,
      mode: 'ios'
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
  } 
  
  async pinWrong () {
    const toast = await this.toastC.create({
      color: 'dark',
      cssClass: 'toast',
      message: 'El pin NO es de 4 digitos',
      position: 'top',
      duration: 2000,
      animated: true,
      mode: 'ios'
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
  } 

  next() {
    this.slides.slideNext();
  }

  async start() {
    await Storage.set({key: INTRO_KEY, value: 'true'});
    this.router.navigateByUrl('/inicio', { replaceUrl:true });
  }

}
