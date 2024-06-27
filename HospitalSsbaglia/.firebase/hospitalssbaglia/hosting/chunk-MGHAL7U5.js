import{a as Y}from"./chunk-QOMEHSRK.js";import{a as Z}from"./chunk-ZQLAYJMF.js";import{b as j,c,d as V,e as G,h as D,i as L,j as U,k as z,l as B,m as Q,n as $,o as H,p as J,r as K,s as W,t as X}from"./chunk-QWB637DO.js";import{e as F}from"./chunk-6EJ7X627.js";import{a as k,d as w}from"./chunk-J4KM255L.js";import{h as A,i as q}from"./chunk-NCUWAZGR.js";import{$a as M,Ga as o,Ha as S,Ua as p,Wa as m,Ya as l,Za as t,_a as g,ca as I,cb as b,db as u,fa as O,fb as d,gb as R,nb as P,pa as T,qa as N}from"./chunk-GBDBB4LJ.js";function te(e,r){e&1&&(l(0,"small",22),d(1,"El nombre es requerido."),t())}function ie(e,r){e&1&&(l(0,"small",22),d(1,"El nombre debe tener al menos 3 caracteres."),t())}function ne(e,r){if(e&1&&(l(0,"div",22),p(1,te,2,0,"small",3)(2,ie,2,0,"small",3),t()),e&2){let n,i,a=u();o(),m("ngIf",(n=a.form.get("nombre"))==null||n.errors==null?null:n.errors.required),o(),m("ngIf",(i=a.form.get("nombre"))==null||i.errors==null?null:i.errors.minlength)}}function le(e,r){e&1&&(l(0,"small",22),d(1,"El apellido es requerido."),t())}function re(e,r){e&1&&(l(0,"small",22),d(1,"El apellido debe tener al menos 3 caracteres."),t())}function ae(e,r){if(e&1&&(l(0,"div",22),p(1,le,2,0,"small",3)(2,re,2,0,"small",3),t()),e&2){let n,i,a=u();o(),m("ngIf",(n=a.form.get("apellido"))==null||n.errors==null?null:n.errors.required),o(),m("ngIf",(i=a.form.get("apellido"))==null||i.errors==null?null:i.errors.minlength)}}function oe(e,r){e&1&&(l(0,"small",22),d(1,"El DNI es requerido."),t())}function me(e,r){e&1&&(l(0,"small",22),d(1,"El DNI debe tener 7 u 8 d\xEDgitos."),t())}function se(e,r){if(e&1&&(l(0,"div",22),p(1,oe,2,0,"small",3)(2,me,2,0,"small",3),t()),e&2){let n,i,a=u();o(),m("ngIf",(n=a.form.get("dni"))==null||n.errors==null?null:n.errors.required),o(),m("ngIf",(i=a.form.get("dni"))==null||i.errors==null?null:i.errors.pattern)}}function de(e,r){e&1&&(l(0,"small",22),d(1,"La edad es requerida."),t())}function pe(e,r){e&1&&(l(0,"small",22),d(1,"La edad debe ser mayor a 0."),t())}function ce(e,r){if(e&1&&(l(0,"div",22),p(1,de,2,0,"small",3)(2,pe,2,0,"small",3),t()),e&2){let n,i,a=u();o(),m("ngIf",(n=a.form.get("edad"))==null||n.errors==null?null:n.errors.required),o(),m("ngIf",(i=a.form.get("edad"))==null||i.errors==null?null:i.errors.min)}}function ue(e,r){if(e&1&&(l(0,"option",29),d(1),t()),e&2){let n=r.$implicit;m("value",n),o(),R(n)}}function _e(e,r){e&1&&g(0,"input",30)}function ge(e,r){e&1&&(l(0,"small",22),d(1,"La especialidad es requerida."),t())}function fe(e,r){if(e&1&&(l(0,"div",22),p(1,ge,2,0,"small",3),t()),e&2){let n,i=u().index,a=u();o(),m("ngIf",(n=a.especialidadesArray.at(i).get("especialidad").errors)==null?null:n.required)}}function ve(e,r){if(e&1){let n=M();l(0,"div",23)(1,"select",24),p(2,ue,2,2,"option",25),l(3,"option",26),d(4,"Otra"),t()(),p(5,_e,1,0,"input",27),l(6,"button",28),b("click",function(){let a=T(n).index,s=u();return N(s.eliminarEspecialidad(a))}),d(7,"Quitar"),t(),p(8,fe,2,1,"div",3),t()}if(e&2){let n=r.index,i=u();m("formGroupName",n),o(2),m("ngForOf",i.especialidades),o(3),m("ngIf",i.especialidadesArray.at(n).get("especialidad").value==="Otra"),o(3),m("ngIf",i.especialidadesArray.at(n).get("especialidad").invalid&&i.especialidadesArray.at(n).get("especialidad").touched)}}function Ee(e,r){e&1&&(l(0,"small",22),d(1,"El correo electr\xF3nico es requerido."),t())}function xe(e,r){e&1&&(l(0,"small",22),d(1,"El correo electr\xF3nico no es v\xE1lido."),t())}function Ce(e,r){if(e&1&&(l(0,"div",22),p(1,Ee,2,0,"small",3)(2,xe,2,0,"small",3),t()),e&2){let n,i,a=u();o(),m("ngIf",(n=a.form.get("mail"))==null||n.errors==null?null:n.errors.required),o(),m("ngIf",(i=a.form.get("mail"))==null||i.errors==null?null:i.errors.email)}}function he(e,r){e&1&&(l(0,"small",22),d(1,"La contrase\xF1a es requerida."),t())}function be(e,r){e&1&&(l(0,"small",22),d(1,"La contrase\xF1a debe tener al menos 6 caracteres."),t())}function ye(e,r){if(e&1&&(l(0,"div",22),p(1,he,2,0,"small",3)(2,be,2,0,"small",3),t()),e&2){let n,i,a=u();o(),m("ngIf",(n=a.form.get("clave"))==null||n.errors==null?null:n.errors.required),o(),m("ngIf",(i=a.form.get("clave"))==null||i.errors==null?null:i.errors.minlength)}}function Se(e,r){e&1&&(l(0,"small",22),d(1,"Por favor, selecciona al menos una imagen."),t())}function Re(e,r){if(e&1&&(l(0,"div",22),p(1,Se,2,0,"small",3),t()),e&2){let n,i=u();o(),m("ngIf",(n=i.form.get("imagenes"))==null||n.errors==null?null:n.errors.required)}}function Ie(e,r){if(e&1&&(l(0,"div",22),d(1),t()),e&2){let n=u();o(),R(n.mensajeError)}}function Oe(e,r){if(e&1&&(l(0,"div",22),d(1),t()),e&2){let n=u();o(),R(n.mensajeError)}}var Ge=(()=>{let r=class r{constructor(i,a,s){this.authService=i,this.router=a,this.loadingService=s,this.mensajeError="",this.especialidades=["Cardiolog\xEDa","Dermatolog\xEDa","Neurolog\xEDa","Pediatr\xEDa"],this.captchaVerified=!1,this.fb=I(K)}ngOnInit(){this.form=this.fb.group({nombre:["",[c.required,c.minLength(3)]],apellido:["",[c.required,c.minLength(3)]],dni:["",[c.required,c.pattern(/^\d{7,8}$/)]],edad:["",[c.required,c.min(1)]],especialidades:this.fb.array([this.createEspecialidadGroup()]),mail:["",[c.required,c.email]],clave:["",[c.required,c.minLength(6)]],imagenes:[null,c.required]})}createEspecialidadGroup(){return this.fb.group({especialidad:["",c.required],otraEspecialidad:[""]})}get especialidadesArray(){return this.form.get("especialidades")}agregarEspecialidad(){this.especialidadesArray.push(this.createEspecialidadGroup())}eliminarEspecialidad(i){this.especialidadesArray.removeAt(i)}registrar(){if(this.form.invalid){this.form.markAllAsTouched();return}if(!this.captchaVerified){this.mensajeError="Por favor, resuelve el captcha primero.";return}this.loadingService.show(),setTimeout(()=>this.loadingService.hide(),6e3);let{nombre:i,apellido:a,dni:s,edad:_,especialidades:f,mail:E,clave:x,imagenes:v}=this.form.value,C=f.map(y=>y.especialidad==="Otra"?y.otraEspecialidad:y.especialidad),h=Array.isArray(v)?v:[v],ee=new k("",i,a,s,_,null,C,x,E,h,this.generateUserCode(),null,!1);this.authService.registrarEspecialista(ee).then(()=>{this.router.navigateByUrl("/login")}).catch(y=>{this.mensajeError="Hubo un problema al registrar el usuario. Int\xE9ntalo de nuevo.",console.error("Error al registrar usuario:",y)})}generateUserCode(){return"some-unique-code"}onFileChange(i){let a=i.target.files;if(a.length>0){let s=Array.from(a).map(_=>_);this.form.patchValue({imagenes:s})}}onCaptchaResolved(i){this.captchaVerified=i,this.mensajeError=i?"":"Captcha incorrecto. Por favor, int\xE9ntalo de nuevo."}};r.\u0275fac=function(a){return new(a||r)(S(w),S(F),S(Z))},r.\u0275cmp=O({type:r,selectors:[["app-registro-especialista"]],standalone:!0,features:[P],decls:52,vars:11,consts:[[3,"ngSubmit","formGroup"],["for","nombre"],["id","nombre","formControlName","nombre","type","text"],["class","error",4,"ngIf"],["for","apellido"],["id","apellido","formControlName","apellido","type","text"],["for","dni"],["id","dni","formControlName","dni","type","text"],["for","edad"],["id","edad","formControlName","edad","type","number"],["formArrayName","especialidades"],["for","especialidades"],["class","especialidad-item",3,"formGroupName",4,"ngFor","ngForOf"],["type","button",3,"click"],["for","mail"],["id","mail","formControlName","mail","type","email"],["for","clave"],["id","clave","formControlName","clave","type","password"],["for","imagenes"],["id","imagenes","type","file","multiple","",1,"buttonSeleccionarArchivo",3,"change"],[3,"captchaResolved"],["type","submit"],[1,"error"],[1,"especialidad-item",3,"formGroupName"],["formControlName","especialidad"],[3,"value",4,"ngFor","ngForOf"],["value","Otra"],["formControlName","otraEspecialidad","type","text",4,"ngIf"],["type","button",1,"btn-quitar",3,"click"],[3,"value"],["formControlName","otraEspecialidad","type","text"]],template:function(a,s){if(a&1&&(l(0,"form",0),b("ngSubmit",function(){return s.registrar()}),l(1,"div")(2,"label",1),d(3,"Nombre:"),t(),g(4,"input",2),p(5,ne,3,2,"div",3),t(),l(6,"div")(7,"label",4),d(8,"Apellido:"),t(),g(9,"input",5),p(10,ae,3,2,"div",3),t(),l(11,"div")(12,"label",6),d(13,"DNI:"),t(),g(14,"input",7),p(15,se,3,2,"div",3),t(),l(16,"div")(17,"label",8),d(18,"Edad:"),t(),g(19,"input",9),p(20,ce,3,2,"div",3),t(),l(21,"div",10)(22,"label",11),d(23,"Especialidades:"),t(),p(24,ve,9,4,"div",12),l(25,"button",13),b("click",function(){return s.agregarEspecialidad()}),d(26,"Agregar Especialidad"),t()(),l(27,"div")(28,"label",14),d(29,"Correo Electr\xF3nico:"),t(),g(30,"input",15),p(31,Ce,3,2,"div",3),t(),l(32,"div")(33,"label",16),d(34,"Contrase\xF1a:"),t(),g(35,"input",17),p(36,ye,3,2,"div",3),t(),l(37,"div")(38,"label",18),d(39,"Im\xE1genes de Perfil:"),t(),l(40,"input",19),b("change",function(f){return s.onFileChange(f)}),t(),p(41,Re,2,1,"div",3),t(),g(42,"br"),l(43,"app-captcha",20),b("captchaResolved",function(f){return s.onCaptchaResolved(f)}),t(),g(44,"br"),p(45,Ie,2,1,"div",3),g(46,"br")(47,"br")(48,"br"),l(49,"button",21),d(50,"Registrar"),t(),p(51,Oe,2,1,"div",3),t()),a&2){let _,f,E,x,v,C,h;m("formGroup",s.form),o(5),m("ngIf",((_=s.form.get("nombre"))==null?null:_.invalid)&&((_=s.form.get("nombre"))==null?null:_.touched)),o(5),m("ngIf",((f=s.form.get("apellido"))==null?null:f.invalid)&&((f=s.form.get("apellido"))==null?null:f.touched)),o(5),m("ngIf",((E=s.form.get("dni"))==null?null:E.invalid)&&((E=s.form.get("dni"))==null?null:E.touched)),o(5),m("ngIf",((x=s.form.get("edad"))==null?null:x.invalid)&&((x=s.form.get("edad"))==null?null:x.touched)),o(4),m("ngForOf",s.especialidadesArray.controls),o(7),m("ngIf",((v=s.form.get("mail"))==null?null:v.invalid)&&((v=s.form.get("mail"))==null?null:v.touched)),o(5),m("ngIf",((C=s.form.get("clave"))==null?null:C.invalid)&&((C=s.form.get("clave"))==null?null:C.touched)),o(5),m("ngIf",((h=s.form.get("imagenes"))==null?null:h.invalid)&&((h=s.form.get("imagenes"))==null?null:h.touched)),o(4),m("ngIf",s.mensajeError),o(6),m("ngIf",s.mensajeError)}},dependencies:[W,D,H,J,j,L,$,V,G,X,U,Q,z,B,q,A,Y],styles:['form[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;background-image:url("./media/medicalutn1-NOQABUCO.jpg");box-shadow:0 2px 4px #0000001a}form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:15px}label[_ngcontent-%COMP%]{display:block;margin-bottom:5px;font-weight:700}input[type=text][_ngcontent-%COMP%], input[type=email][_ngcontent-%COMP%], input[type=password][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], select[_ngcontent-%COMP%]{width:calc(100% - 20px);padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box}input[type=file][_ngcontent-%COMP%]{padding:3px}button[type=submit][_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}button[type=submit][_ngcontent-%COMP%]:hover{background-color:#45a049}.buttonSeleccionarArchivo[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}.form-floating[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{color:#495057;font-size:18px}.form-floating[_ngcontent-%COMP%]{margin-bottom:1rem}.estado-registro[_ngcontent-%COMP%], .checkbox[_ngcontent-%COMP%]{margin-top:1rem}.form-signin[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:block;margin-left:auto;margin-right:auto;margin-bottom:1rem;width:100px}a[_ngcontent-%COMP%]{color:#007bff;text-decoration:none}a[_ngcontent-%COMP%]:hover{text-decoration:underline}.error[_ngcontent-%COMP%]{color:red}.exito[_ngcontent-%COMP%]{color:green}.error-message[_ngcontent-%COMP%]{color:red}']});let e=r;return e})();export{Ge as a};
