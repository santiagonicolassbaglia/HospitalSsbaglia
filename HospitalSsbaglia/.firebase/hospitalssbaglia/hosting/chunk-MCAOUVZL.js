import{A as U,O as z,b as _,g as M,h as O,k as P,l as r,m as N,n as w,q as A,r as k,s as F,t as R,x as I,y as j,z as q}from"./chunk-EHPRMDRE.js";import{Ba as c,Ca as g,Oa as C,Qa as f,Ta as t,Ua as e,Va as o,Wa as b,Xa as E,Ya as i,_a as y,ca as x,db as S,fa as v}from"./chunk-7PBKTP3G.js";function G(d,l){if(d&1&&(t(0,"div",22),i(1),e()),d&2){let D=E();c(),y(" ",D.mensajeError," ")}}var re=(()=>{let l=class l{constructor(m,n){this.authService=m,this.router=n,this.mensajeError="",this.fb=x(I)}ngOnInit(){this.form=this.fb.group({nombre:["",[r.required,r.minLength(3)]],apellido:["",[r.required,r.minLength(3)]],dni:["",[r.required,r.pattern(/^\d{7,8}$/)]],edad:["",[r.required,r.min(1)]],obraSocial:[""],mail:["",[r.required,r.email]],clave:["",[r.required,r.minLength(6)]],imagenes:[[],r.required]})}registrar(){if(this.hasError())return;let{nombre:m,apellido:n,dni:a,edad:s,obraSocial:p,mail:L,clave:T,imagenes:u}=this.form.value,V=new U(m,n,a,s,p||null,null,T,L,Array.isArray(u)?u:[u],this.generateUserCode(),null);this.authService.registrar(V).then(()=>{this.router.navigateByUrl("/login")}).catch(h=>{h.code==="auth/email-already-in-use"?this.mensajeError="El correo electr\xF3nico ya est\xE1 en uso. Por favor, use otro correo.":this.mensajeError="Hubo un problema al registrar el usuario. Int\xE9ntalo de nuevo.",console.error("Error al registrar usuario:",h)})}hasError(){return this.form.markAllAsTouched(),this.form.invalid}generateUserCode(){return"some-unique-code"}onFileChange(m){let n=m.target.files;if(n.length>0){let a=Array.from(n).map(s=>s);this.form.patchValue({imagenes:a})}}};l.\u0275fac=function(n){return new(n||l)(g(z),g(M))},l.\u0275cmp=v({type:l,selectors:[["app-registro"]],standalone:!0,features:[S],decls:44,vars:2,consts:[[1,"registro-container"],[3,"ngSubmit","formGroup"],[1,"form-group"],["for","nombre"],["id","nombre","formControlName","nombre","type","text"],["for","apellido"],["id","apellido","formControlName","apellido","type","text"],["for","dni"],["id","dni","formControlName","dni","type","text"],["for","edad"],["id","edad","formControlName","edad","type","number"],["for","obraSocial"],["id","obraSocial","formControlName","obraSocial","type","text"],["for","mail"],["id","mail","formControlName","mail","type","email"],["for","clave"],["id","clave","formControlName","clave","type","password"],["for","imagenes"],["id","imagenes","type","file","multiple","",1,"buttonSeleccionarArchivo",3,"change"],["type","submit"],["routerLink","/registro-especialista",1,"btn","botonRegistroEspecialista"],["class","error-message",4,"ngIf"],[1,"error-message"]],template:function(n,a){n&1&&(t(0,"div",0)(1,"h2"),i(2,"Registro"),e(),t(3,"form",1),b("ngSubmit",function(){return a.registrar()}),t(4,"div",2)(5,"label",3),i(6,"Nombre"),e(),o(7,"input",4),e(),t(8,"div",2)(9,"label",5),i(10,"Apellido"),e(),o(11,"input",6),e(),t(12,"div",2)(13,"label",7),i(14,"DNI"),e(),o(15,"input",8),e(),t(16,"div",2)(17,"label",9),i(18,"Edad"),e(),o(19,"input",10),e(),t(20,"div",2)(21,"label",11),i(22,"Obra Social"),e(),o(23,"input",12),e(),t(24,"div",2)(25,"label",13),i(26,"Correo Electr\xF3nico"),e(),o(27,"input",14),e(),t(28,"div",2)(29,"label",15),i(30,"Contrase\xF1a"),e(),o(31,"input",16),e(),t(32,"div",2)(33,"label",17),i(34,"Im\xE1genes de Perfil"),e(),t(35,"input",18),b("change",function(p){return a.onFileChange(p)}),e()(),t(36,"button",19),i(37,"Registrar"),e(),o(38,"br")(39,"br"),t(40,"div")(41,"button",20),i(42,"Registrarse como especialista"),e()()(),C(43,G,2,1,"div",21),e()),n&2&&(c(3),f("formGroup",a.form),c(40),f("ngIf",a.mensajeError))},dependencies:[j,A,P,k,N,w,q,F,R,_,O],styles:['form[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;background-image:url("./media/medicalutn1-NOQABUCO.jpg");box-shadow:0 2px 4px #0000001a}form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:15px}label[_ngcontent-%COMP%]{display:block;margin-bottom:5px;font-weight:700}input[type=text][_ngcontent-%COMP%], input[type=email][_ngcontent-%COMP%], input[type=password][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], input[type=file][_ngcontent-%COMP%]{width:calc(100% - 20px);padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box}input[type=file][_ngcontent-%COMP%]{padding:3px}button[type=submit][_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}button[type=submit][_ngcontent-%COMP%]:hover{background-color:#45a049}button[type=submit][_ngcontent-%COMP%]:disabled{background-color:#ccc;cursor:not-allowed}button[type=submit][_ngcontent-%COMP%]:disabled:hover{background-color:#ccc}button[type=button][_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#f44336;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}.buttonSeleccionarArchivo[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}.botonRegistroEspecialista[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#007bff;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}']});let d=l;return d})();export{re as a};