import{s as C}from"./chunk-QWB637DO.js";import{e as v,f as h}from"./chunk-6EJ7X627.js";import{d as y}from"./chunk-J4KM255L.js";import{i as g}from"./chunk-NCUWAZGR.js";import{Ga as s,Ha as c,Ua as u,Wa as l,Ya as t,Za as e,cb as p,fa as d,fb as n,hb as b,nb as f}from"./chunk-GBDBB4LJ.js";function S(o,a){o&1&&(t(0,"div")(1,"div")(2,"button",5),n(3,"Home Admin"),e()(),t(4,"div")(5,"button",6),n(6,"Turnos Admin"),e()(),t(7,"div")(8,"button",7),n(9,"Historia Clinica Admin"),e()(),t(10,"div")(11,"button",8),n(12,"Mi Perfil"),e()()())}function _(o,a){o&1&&(t(0,"div")(1,"div")(2,"button",9),n(3,"Turnos Especialista"),e()(),t(4,"div")(5,"button",10),n(6,"Historia Clinica Especialistas"),e()(),t(7,"div")(8,"button",8),n(9,"Mi Perfil"),e()()())}function k(o,a){o&1&&(t(0,"div")(1,"div")(2,"button",11),n(3,"Turnos"),e()(),t(4,"div")(5,"button",12),n(6,"Solicitar Turno"),e()(),t(7,"div")(8,"button",8),n(9,"Mi Perfil"),e()()())}var F=(()=>{let a=class a{constructor(i,m){this.router=i,this.authService=m,this.username="",this.nombreUsuario="",this.user=null}ngOnInit(){this.authService.usuarioActual().then(i=>{i&&(this.user=i,this.nombreUsuario=i.nombre)}).catch(i=>{console.error("Error al obtener el usuario actual:",i)})}cerrarSesion(){this.authService.logout().then(()=>{console.log("Sesi\xF3n cerrada correctamente"),this.router.navigateByUrl("/login")}).catch(i=>{console.error("Error al cerrar sesi\xF3n:",i)})}};a.\u0275fac=function(m){return new(m||a)(c(v),c(y))},a.\u0275cmp=d({type:a,selectors:[["app-home"]],standalone:!0,features:[f],decls:10,vars:4,consts:[[1,"home-container"],[1,"container"],[1,"header"],[1,"btn","btn-logout",2,"margin-top","-1rem",3,"click"],[4,"ngIf"],["routerLink","/homeAdmin",1,"btn","btn-primary"],["routerLink","/turnosAdministrador",1,"btn","btn-primary"],["routerLink","/historiaClinicaAdmin",1,"btn","btn-primary"],["routerLink","/miPerfil",1,"btn","btn-primary"],["routerLink","/turnosEspecialista",1,"btn","btn-primary"],["routerLink","/historiaClinicaEspecialista",1,"btn","btn-primary"],["routerLink","/turnos",1,"btn","btn-primary"],["routerLink","/solicitarTurno",1,"btn","btn-primary"]],template:function(m,r){m&1&&(t(0,"div",0)(1,"div",1)(2,"div",2)(3,"h1"),n(4),e(),t(5,"button",3),p("click",function(){return r.cerrarSesion()}),n(6,"Cerrar sesi\xF3n"),e()(),u(7,S,13,0,"div",4)(8,_,10,0,"div",4)(9,k,10,0,"div",4),e()()),m&2&&(s(4),b("Bienvenido ",r.nombreUsuario,""),s(3),l("ngIf",r.user&&r.user.esAdmin),s(),l("ngIf",r.user&&!r.user.esAdmin&&r.user.aprobado===!0),s(),l("ngIf",r.user&&!r.user.esAdmin&&r.user.aprobado===!1))},dependencies:[g,C,h],styles:['.home-container[_ngcontent-%COMP%]{background-image:url("./media/padreehijo-AX4HF6BX.jpg");background-size:cover;background-position:center;color:#fff;height:100vh;display:flex;justify-content:center;align-items:center;text-align:center}.container[_ngcontent-%COMP%]{background-color:#000000b3;padding:40px;border-radius:15px}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}h1[_ngcontent-%COMP%]{font-size:3rem}.btn[_ngcontent-%COMP%]{display:inline-block;padding:15px 30px;font-size:1.5rem;margin-bottom:20px}.btn-primary[_ngcontent-%COMP%]{background-color:#007bff}.btn-primary[_ngcontent-%COMP%]:hover{background-color:#0056b3}.btn-logout[_ngcontent-%COMP%]{position:absolute;top:20px;right:20px;padding:10px 20px;font-size:1.2rem}.btn-logout[_ngcontent-%COMP%]:hover{background-color:#c82333}']});let o=a;return o})();export{F as a};
