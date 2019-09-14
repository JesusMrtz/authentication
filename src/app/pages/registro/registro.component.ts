import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordar = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }
  }

  onSubmit(form: NgForm) {

    if (form.invalid) { return ; }

    Swal.fire(
      {
        allowOutsideClick: false,
        type: 'info',
        text: ' Espere por favor..'
      }
    );

    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(respuesta => {
      Swal.close();

      if (this.recordar) {
        localStorage.setItem('email', this.usuario.email);
      }

      this.router.navigateByUrl('/home');
    }, (error) => {
      Swal.fire(
        {
          type: 'error',
          title: 'Error al autenticar',
          text: error.error.error.message
        }
      );
    });
  }
}
