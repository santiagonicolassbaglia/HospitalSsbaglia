import{e as k}from"./chunk-6EJ7X627.js";import{d as w}from"./chunk-J4KM255L.js";import{h as M,j as O,k as P,l as A}from"./chunk-NCUWAZGR.js";import{$a as v,Ga as l,Ha as h,Ua as C,Wa as b,Ya as i,Za as n,cb as m,db as _,fa as x,fb as r,gb as u,nb as E,ob as f,pa as p,pb as S,qa as g,qb as y}from"./chunk-GBDBB4LJ.js";import{h as d}from"./chunk-DEPBX7UX.js";function U(s,o){if(s&1){let c=v();i(0,"tr")(1,"td"),r(2),n(),i(3,"td"),r(4),n(),i(5,"td"),r(6),f(7,"date"),n(),i(8,"td")(9,"input",6),m("change",function(){let t=p(c).$implicit,a=_();return g(a.cambiarAdmin(t))}),n()(),i(10,"td")(11,"button",7),m("click",function(){let t=p(c).$implicit,a=_();return g(a.eliminarUsuario(t))}),r(12,"Eliminar"),n()()()}if(s&2){let c=o.$implicit;l(2),u(c.nombre),l(2),u(c.mail),l(2),u(y(7,4,c.lastLogin,"dd/MM/yyyy HH:mm")),l(3),b("checked",c.esAdmin)}}var V=(()=>{let o=class o{constructor(e,t){this.router=e,this.authService=t}ngOnInit(){this.usuarios$=this.authService.getAllUsers()}cambiarEstadoAdmin(e,t){return d(this,null,function*(){try{yield this.authService.cambiarEstadoAdmin(e,t),console.log(`Estado de admin cambiado para usuario con ID ${e}`),this.usuarios$=this.authService.getAllUsers()}catch(a){console.error("Error al cambiar estado de admin:",a)}})}cerrarSesion(){this.authService.logout().then(()=>{console.log("Sesi\xF3n cerrada correctamente"),this.router.navigateByUrl("/login")}).catch(e=>{console.error("Error al cerrar sesi\xF3n:",e)})}eliminarUsuario(e){return d(this,null,function*(){try{yield this.authService.eliminarUsuario(e.uid),console.log(`Usuario con UID ${e.uid} eliminado`)}catch(t){console.error("Error al eliminar el usuario:",t)}})}cambiarAdmin(e){return d(this,null,function*(){try{e.esAdmin=!e.esAdmin,yield this.authService.cambiarEstadoAdmin(e.mail,e.esAdmin),console.log(`Estado de admin cambiado para usuario con email ${e.mail}`)}catch(t){console.error("Error al cambiar estado de admin:",t)}})}};o.\u0275fac=function(t){return new(t||o)(h(k),h(w))},o.\u0275cmp=x({type:o,selectors:[["app-lista-usuarios-ingresados"]],standalone:!0,features:[E],decls:23,vars:3,consts:[[1,"home-container"],[1,"header"],[1,"btn-logout",3,"click"],[1,"table-container"],[1,"table"],[4,"ngFor","ngForOf"],["type","checkbox",3,"change","checked"],[3,"click"]],template:function(t,a){t&1&&(i(0,"div",0)(1,"div",1)(2,"h1"),r(3,"Administraci\xF3n de Usuarios"),n(),i(4,"button",2),m("click",function(){return a.cerrarSesion()}),r(5,"Cerrar sesi\xF3n"),n()(),i(6,"div",3)(7,"table",4)(8,"thead")(9,"tr")(10,"th"),r(11,"Nombre"),n(),i(12,"th"),r(13,"Email"),n(),i(14,"th"),r(15,"\xDAltimo inicio de sesi\xF3n"),n(),i(16,"th"),r(17,"Es Admin"),n(),i(18,"th"),r(19,"Acciones"),n()()(),i(20,"tbody"),C(21,U,13,7,"tr",5),f(22,"async"),n()()()()),t&2&&(l(21),b("ngForOf",S(22,1,a.usuarios$)))},dependencies:[A,M,O,P],styles:[".home-container[_ngcontent-%COMP%]{padding:20px;background-color:#f2f2f2;border-radius:8px;box-shadow:0 0 10px #0000001a}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:24px;color:#333}.btn-logout[_ngcontent-%COMP%]{background-color:#ff4d4d;color:#fff;border:none;padding:10px 20px;cursor:pointer;border-radius:4px;transition:background-color .3s ease}.btn-logout[_ngcontent-%COMP%]:hover{background-color:#f33}.table-container[_ngcontent-%COMP%]{overflow-x:auto}.table[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;margin-top:20px}.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border:1px solid #ddd;padding:10px}.table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{background-color:#f2f2f2;font-weight:700;text-align:left;color:#333}.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{color:#666}"]});let s=o;return s})();export{V as a};
