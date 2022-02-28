import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController, AlertController, Platform } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DARK_KEY } from '../../guards/intro.guard';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.page.html',
  styleUrls: ['./acceso.page.scss'],
})

export class AccesoPage implements OnInit {

baseDatos: SQLiteObject;
DMactivado: any = ""; 
site: string = "";
pass: string = "";
select: string = "";
info: any = [];
readonly dbNombre: string = "db.db";
readonly tabla: string = "passwords";


  ngOnInit(){
  }

darkmode: boolean
statusDark: boolean = false

  constructor(
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public sqlite:SQLite,
    public modalController: ModalController,
    private statusBar: StatusBar,
    public platform: Platform,
    public loadingController: LoadingController,
    private router: Router
    ) {
      this.initializeApp();
     }

     initializeApp() {
      this.platform.ready().then(() => {
        //this.ChecarStatubar();
        this.cargar();
        this.inicializarDarkmode();
      });
    }

    async inicializarDarkmode() {
      const a = await Storage.get({key: DARK_KEY});
      if (a.value === 'true') {
        this.darkmode = true
      } if (a.value === 'false') {
        this.darkmode = false
      }
    }

  /*  async ChecarStatubar() {
      const a = await Storage.get({key: DARK_KEY});
      if (a.value === 'true') {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#1f1f1f');
      } else {
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#ffffff');
      }
    }*/

/////////////////  ACTIVAR/DESACTIVAR MODO OSCURO  /////////////////////////////////////////////////////////////////////////////////

  async activar() {
    this.darkmode = !this.darkmode;
    document.body.classList.toggle( 'dark' );
    let a = await Storage.get({key: DARK_KEY});
    if (a.value === 'true') {
      this.activarDM();
    } else {
      this.desactivarDM();
    }
  }

  async activarDM() {
    await Storage.set({key: DARK_KEY, value: 'false'});
      //document.body.classList.toggle( 'dark' );
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      let a = '¡Se desactivó el modo oscuro!'
      this.alertaToast(a);
  }

  async desactivarDM() {
    await Storage.set({key: DARK_KEY, value: 'true'});
      //document.body.classList.toggle( 'dark' );
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#1f1f1f');
      let a:string = '¡Se activó el modo oscuro!'
      this.alertaToast(a);
  }

/////////////////////  COMPONENTE DE ACTUALIZAR AL DESLIZAR HACIA ABAJO (REFRESHER)  ///////////////////////////////////////////////////////////

  doRefresh(event) { 
    setTimeout(() => {
      this.cargar();
      event.target.complete();
    }, 800);
  }

/////////////////////////////  CARGA DE DATOS    /////////////////////////////////////////////////////////////////////////

  getRows(){
    this.baseDatos.executeSql("SELECT * FROM " + this.tabla, [])
    .then((res) => {
      this.info = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          this.info.push(res.rows.item(i));
        }
      }
    })
    .catch(e => {
      alert("Error " + JSON.stringify(e))
    });
  }

  cargar () {
    this.sqlite.create({
      name: this.dbNombre,
      location: 'default'
    })
    .then((db: SQLiteObject) => { 
      this.baseDatos = db;
      this.baseDatos.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tabla + '(pid INTEGER PRIMARY KEY, sitio TEXT(25), pass2 TEXT(25), icos TEXT(24))', [])
      this.baseDatos.executeSql("SELECT * FROM " + this.tabla, [])
      .then((res) => {
        this.info = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.info.push(res.rows.item(i));
          }
        }
      })
    });
  }

///////////////  BORRAR CONTRASEÑA  //////////////////////////////////////////////////////////////

  borrarFila(item) {
    this.baseDatos.executeSql("DELETE FROM " + this.tabla + " WHERE pid=" +item.pid, [])
    .then((res) => {
      let a:string = 'Contraseña eliminada :('
      this.alertaToast(a);
      this.getRows();
    })
    .catch(e => {
      alert("Error " + JSON.stringify(e))
    });
  }

//////////////  AGREGAR NUEVA CONTRASEÑA CON ALERT  /////////////////////////////////////////////////////

async agregar(){
  console.log("Modificar");
  let alerta = await this.alertCtrl.create({
    mode: "md",
    cssClass: 'alertaAgregar',
    header: 'Ingresa los datos de tu contraseña:',
    inputs: [
      {
        name: 'sitio',
        cssClass: 'alertaAgregar',
        placeholder: 'Sitio/plataforma'
      }, 
      {
        name: 'pass',
        cssClass: 'alertaAgregar',
        placeholder: 'Contraseña'
      }
    ],
    buttons: [
      { 
        text: 'Cancelar',
        cssClass: 'alertaAgregar',
        handler: data => {}
      },
      { 
        text: 'Guardar',
        cssClass: 'alertaAgregar',
        handler: (data) => {
            if(!data.pass.length && !data.sitio.length) {
              let a:string = 'No has ingresado ningún dato'
              this.alertaToast(a);
              return false;
            } if(!data.sitio.length) {
              let a:string = 'No has ingresado el sitio'
              this.alertaToast(a);
              return false;
            } if(!data.pass.length) {
              let a: string = 'No has ingresado la contraseña'
              this.alertaToast(a);
              return false;
            } else {
            this.baseDatos.executeSql('INSERT INTO ' + this.tabla + ' (sitio, pass2, icos) VALUES("' + data.sitio + '", "' + data.pass + '", "eye-off-outline")', []);
            let a:string = '¡Contraseña agregada!'
            this.alertaToast(a);
            this.getRows();
            alerta.dismiss();
          }
        }
      }
    ]
  });
  alerta.present();
}

///////////////////  MODAL QUE ABRE CHIP DE CONTRASEÑA  ////////////////////////////////////////////////////////////

  async modal(item) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      mode: "ios",
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      componentProps: {
        'pidModal': item.pid,
        'sitioModal': item.sitio,
        'passModal' : item.pass2,
        'icosModal' : item.icos
      }
    });
  await modal.present();
  modal.onDidDismiss().then( res => this.cargar())
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////  MENSAJE TOAST DE ALERTA ///////////////////////////////////////////////////////////////////

  async alertaToast(a) {
    const toast = await this.toastController.create({
      color: 'dark',
      cssClass: 'toast',
      message: a,
      position: 'top',
      duration: 2000,
      animated: true,
      mode: 'ios'
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
  }
}