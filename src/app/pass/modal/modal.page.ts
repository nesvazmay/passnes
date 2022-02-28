import { Component, Input, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ModalController, ToastController, AlertController, Platform } from '@ionic/angular';

@Component({ 
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

baseDatos: SQLiteObject;
DMactivado: any = "";
site: string = "";
pass: string = "";
info: any = [];
select: string = "";
readonly dbNombre: string = "db.db";
readonly tabla: string = "passwords";
  
@Input() pidModal: string;
@Input() sitioModal: string;
@Input() passModal: string;
@Input() icosModal: string;
  
    constructor(
      public sqlite: SQLite,
      public modalController: ModalController,
      public toastController: ToastController,
      public alertCtrl: AlertController,
      public platform: Platform
    ) { 
      //this.initializeApp(); 
    }

  /*  initializeApp() {
      this.platform.ready().then(() => {
        this.cargar();
      });
    }*/
  
    ngOnInit() {
      this.cargar();
    }

    // Estilo de popover de select de logo
    customPopoverOptions: any = {
      header: 'Logo',
      subHeader: 'Selecciona la plataforma de tu contraseña',
    }; 

    // Cerrar modal
    async dismiss() {
      this.modalController.dismiss({
        'dismissed': true
      });
    }
   
////////////////////  CARGA DE DATOS  ///////////////////////////////////////////////////////////////////

    cargar() {
      this.sqlite.create({
        name: this.dbNombre,
        location: 'default'
      })
      .then((db: SQLiteObject) => { 
        this.baseDatos = db;
        this.baseDatos.executeSql('CREATE TABLE IF NOT EXISTS ' + this.tabla + '(pid INTEGER PRIMARY KEY, sitio TEXT(25), pass2 TEXT(25), icos TEXT(24))', [])
        this.baseDatos.executeSql("SELECT * FROM " + this.tabla + " WHERE pid=" +this.pidModal, [])
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
  
    getRows(){
      this.baseDatos.executeSql("SELECT * FROM " + this.tabla  + " WHERE pid=" +this.pidModal, [])
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
  
////////////////////  BORRADO DE PASS  ///////////////////////////////////////////////////////////////////


    borrarFila(item) {
      this.baseDatos.executeSql("DELETE FROM " + this.tabla + " WHERE pid=" +this.pidModal, [])
      .then((res) => {
        this.getRows();
        this.passBorrada();
        this.dismiss();
      })
      .catch(e => {
        alert("Error " + JSON.stringify(e))
      });
    }

    async seguro(item){
      let alerta = await this.alertCtrl.create({
        mode: "md",
        cssClass: 'alertaBorrar',
        header: '¿Seguro que deseas borrar esta contraseña?',
        buttons: [
          { 
            text: 'Cancelar',
            cssClass: 'alertaAgregar',
            handler: data => {}
          },
          { 
            text: 'Eliminar',
            cssClass: 'alertaAgregar',
            handler: data => {
              let navTransition = alerta.dismiss();
              navTransition.then(()=>{
                this.borrarFila(item);
              });
            }
          }
        ]
      });
      alerta.present();
    }

    



////////////////////  EDITAR LOGO Y PASS ///////////////////////////////////////////////////////////////////
  
    editarLogo(){
      this.baseDatos.executeSql('UPDATE ' + this.tabla + ' SET icos="' + this.select + '"  WHERE pid=' +this.pidModal , [])
      .then(() => { 
        this.getRows();
      })
      .catch(e =>{
        alert("Error" + JSON.stringify(e))
      });
    }

    async modificar(item){
      console.log("Modificar");
      let alerta = await this.alertCtrl.create({
        mode: "md",
        cssClass: 'alertaBorrar',
        header: 'Inserta la nueva contraseña',
        inputs: [
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
            text: 'Actualizar',
            cssClass: 'alertaAgregar',
            handler: data => {
              if (!data.pass.length) {
                this.faltaPass();
                return false;
              } else {
              let navTransition = alerta.dismiss();
              navTransition.then(()=>{
              this.baseDatos.executeSql('UPDATE ' + this.tabla + ' SET pass2="' + data.pass + '"  WHERE pid=' +item.pid , [])});
              this.passActualizada();
              this.cargar();
              }
            }
          }
        ]
      });
      alerta.present();
    }
  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////  MENSAJE TOAST DE ALERTA ///////////////////////////////////////////////////////////////////
  
async passBorrada() {
  const toast = await this.toastController.create({
    color: 'dark',
    cssClass: 'toast',
    message: 'Se eliminó la contraseña',
    position: 'top',
    duration: 2000,
    animated: true,
    mode: 'ios'
  });
  await toast.present();
  const { role } = await toast.onDidDismiss();
}

async passActualizada() {
  const toast = await this.toastController.create({
    color: 'dark',
    cssClass: 'toast',
    message: 'Se actualizó la contraseña',
    position: 'top',
    duration: 2000,
    animated: true,
    mode: 'ios'
  });
  await toast.present();
  const { role } = await toast.onDidDismiss();
}

async faltaPass() {
  const toast = await this.toastController.create({
    color: 'dark',
    cssClass: 'toast',
    message: 'No ingresaste una contraseña',
    position: 'top',
    duration: 2000,
    animated: true,
    mode: 'ios'
  });
  await toast.present();
  const { role } = await toast.onDidDismiss();
}

}
   