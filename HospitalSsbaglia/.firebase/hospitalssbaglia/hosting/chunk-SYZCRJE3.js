import{b as N,c as i,d as w,e as k,h as A,i as F,j as R,k as I,o as j,p as q,q as U}from"./chunk-EIZJPDRZ.js";import{d as _,e as M,g as O,u as P}from"./chunk-KCUKJPLM.js";import{i as S}from"./chunk-UHVFW63S.js";import{$a as C,Ea as c,Fa as u,Qa as v,Sa as g,Ua as t,Va as e,Wa as o,_a as f,ab as r,ca as h,cb as E,fa as x,ib as y}from"./chunk-GG3ZMLSG.js";function B(m,l){if(m&1&&(t(0,"div",22),r(1),e()),m&2){let z=C();c(),E(" ",z.mensajeError," ")}}var re=(()=>{let l=class l{constructor(d,n){this.authService=d,this.router=n,this.mensajeError="",this.fb=h(j)}ngOnInit(){this.form=this.fb.group({nombre:["",[i.required,i.minLength(3)]],apellido:["",[i.required,i.minLength(3)]],dni:["",[i.required,i.pattern(/^\d{7,8}$/)]],edad:["",[i.required,i.min(1)]],obraSocial:[""],especialidad:[""],mail:["",[i.required,i.email]],clave:["",[i.required,i.minLength(6)]],imagenes:[null,i.required]})}registrar(){if(this.form.invalid)return;let{nombre:d,apellido:n,dni:a,edad:s,obraSocial:p,especialidad:D,mail:L,clave:T,imagenes:V}=this.form.value,G=new O(d,n,a,s,p||null,D||null,T,L,V,this.generateUserCode(),null,null);this.authService.registrar(G).then(()=>{this.router.navigateByUrl("/login")}).catch(b=>{b.code==="auth/email-already-in-use"?this.mensajeError="El correo electr\xF3nico ya est\xE1 en uso. Por favor, use otro correo.":this.mensajeError="Hubo un problema al registrar el usuario. Int\xE9ntalo de nuevo.",console.error("Error al registrar usuario:",b)})}hasError(){return this.form.markAllAsTouched(),this.form.invalid}generateUserCode(){return"some-unique-code"}onFileChange(d){let n=d.target.files;if(n.length>0){let a=Array.from(n).map(s=>s);this.form.patchValue({imagenes:a})}}};l.\u0275fac=function(n){return new(n||l)(u(P),u(_))},l.\u0275cmp=x({type:l,selectors:[["app-registro"]],standalone:!0,features:[y],decls:44,vars:2,consts:[[1,"registro-container"],[3,"ngSubmit","formGroup"],[1,"form-group"],["for","nombre"],["id","nombre","formControlName","nombre","type","text"],["for","apellido"],["id","apellido","formControlName","apellido","type","text"],["for","dni"],["id","dni","formControlName","dni","type","text"],["for","edad"],["id","edad","formControlName","edad","type","number"],["for","obraSocial"],["id","obraSocial","formControlName","obraSocial","type","text"],["for","mail"],["id","mail","formControlName","mail","type","email"],["for","clave"],["id","clave","formControlName","clave","type","password"],["for","imagenes"],["id","imagenes","type","file","multiple","",1,"buttonSeleccionarArchivo",3,"change"],["type","submit"],["routerLink","/registro-especialista",1,"btn","botonRegistroEspecialista"],["class","error-message",4,"ngIf"],[1,"error-message"]],template:function(n,a){n&1&&(t(0,"div",0)(1,"h2"),r(2,"Registro"),e(),t(3,"form",1),f("ngSubmit",function(){return a.registrar()}),t(4,"div",2)(5,"label",3),r(6,"Nombre"),e(),o(7,"input",4),e(),t(8,"div",2)(9,"label",5),r(10,"Apellido"),e(),o(11,"input",6),e(),t(12,"div",2)(13,"label",7),r(14,"DNI"),e(),o(15,"input",8),e(),t(16,"div",2)(17,"label",9),r(18,"Edad"),e(),o(19,"input",10),e(),t(20,"div",2)(21,"label",11),r(22,"Obra Social"),e(),o(23,"input",12),e(),t(24,"div",2)(25,"label",13),r(26,"Correo Electr\xF3nico"),e(),o(27,"input",14),e(),t(28,"div",2)(29,"label",15),r(30,"Contrase\xF1a"),e(),o(31,"input",16),e(),t(32,"div",2)(33,"label",17),r(34,"Im\xE1genes de Perfil"),e(),t(35,"input",18),f("change",function(p){return a.onFileChange(p)}),e()(),t(36,"button",19),r(37,"Registrar"),e(),o(38,"br")(39,"br"),t(40,"div")(41,"button",20),r(42,"Registrarse como especialista"),e()()(),v(43,B,2,1,"div",21),e()),n&2&&(c(3),g("formGroup",a.form),c(40),g("ngIf",a.mensajeError))},dependencies:[q,A,N,F,w,k,U,R,I,S,M],styles:['form[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;background-image:url("./media/medicalutn1-NOQABUCO.jpg");box-shadow:0 2px 4px #0000001a}form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:15px}label[_ngcontent-%COMP%]{display:block;margin-bottom:5px;font-weight:700}input[type=text][_ngcontent-%COMP%], input[type=email][_ngcontent-%COMP%], input[type=password][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], input[type=file][_ngcontent-%COMP%]{width:calc(100% - 20px);padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box}input[type=file][_ngcontent-%COMP%]{padding:3px}button[type=submit][_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}button[type=submit][_ngcontent-%COMP%]:hover{background-color:#45a049}button[type=submit][_ngcontent-%COMP%]:disabled{background-color:#ccc;cursor:not-allowed}button[type=submit][_ngcontent-%COMP%]:disabled:hover{background-color:#ccc}button[type=button][_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#f44336;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}.buttonSeleccionarArchivo[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}.botonRegistroEspecialista[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#007bff;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}']});let m=l;return m})();export{re as a};
