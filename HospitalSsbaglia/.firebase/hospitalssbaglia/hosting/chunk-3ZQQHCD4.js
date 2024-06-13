import{A as D,O as L,a as y,b as M,g as S,k as P,l as i,m as N,n as F,q as A,r as I,s as R,t as V,u as w,v as q,w as j,x as k,y as T,z as U}from"./chunk-EHPRMDRE.js";import{Ba as c,Ca as h,Oa as f,Qa as u,Ta as t,Ua as e,Va as s,Wa as b,Xa as E,Ya as n,Za as _,_a as x,ca as C,db as O,fa as v}from"./chunk-7PBKTP3G.js";function K(o,l){if(o&1&&(t(0,"option",21),n(1),e()),o&2){let g=l.$implicit;u("value",g),c(),_(g)}}function W(o,l){o&1&&(t(0,"div")(1,"label",22),n(2,"Otra Especialidad:"),e(),s(3,"input",23),e())}function X(o,l){if(o&1&&(t(0,"div"),n(1),e()),o&2){let g=E();c(),x(" ",g.mensajeError," ")}}var me=(()=>{let l=class l{constructor(d,r){this.authService=d,this.router=r,this.mensajeError="",this.especialidades=["Cardiolog\xEDa","Dermatolog\xEDa","Neurolog\xEDa","Pediatr\xEDa"],this.fb=C(k)}ngOnInit(){this.form=this.fb.group({nombre:["",[i.required,i.minLength(3)]],apellido:["",[i.required,i.minLength(3)]],dni:["",[i.required,i.pattern(/^\d{7,8}$/)]],edad:["",[i.required,i.min(1)]],especialidad:["",i.required],otraEspecialidad:[""],mail:["",[i.required,i.email]],clave:["",[i.required,i.minLength(6)]],imagen:[null,i.required]})}registrar(){if(this.hasError())return;let{nombre:d,apellido:r,dni:a,edad:m,especialidad:p,otraEspecialidad:z,mail:G,clave:B,imagen:$}=this.form.value,H=p==="Otra"?z:p,Q=new D(d,r,a,m,null,H||null,B,G,[$],this.generateUserCode(),null);this.authService.registrar(Q).then(()=>{this.router.navigateByUrl("/login")}).catch(J=>{this.mensajeError="Hubo un problema al registrar el usuario. Int\xE9ntalo de nuevo.",console.error("Error al registrar usuario:",J)})}hasError(){return this.form.markAllAsTouched(),this.form.invalid}generateUserCode(){return"some-unique-code"}onEspecialidadChange(d){d.target.value==="Otra"?this.form.get("otraEspecialidad")?.setValidators([i.required]):this.form.get("otraEspecialidad")?.clearValidators(),this.form.get("otraEspecialidad")?.updateValueAndValidity()}onFileChange(d){let r=d.target.files;if(r.length>0){let a=Array.from(r).map(m=>URL.createObjectURL(m));this.form.patchValue({imagen:a})}}};l.\u0275fac=function(r){return new(r||l)(h(L),h(S))},l.\u0275cmp=v({type:l,selectors:[["app-registro-especialista"]],standalone:!0,features:[O],decls:40,vars:4,consts:[[3,"ngSubmit","formGroup"],["for","nombre"],["id","nombre","formControlName","nombre","type","text"],["for","apellido"],["id","apellido","formControlName","apellido","type","text"],["for","dni"],["id","dni","formControlName","dni","type","text"],["for","edad"],["id","edad","formControlName","edad","type","number"],["for","especialidad"],["id","especialidad","formControlName","especialidad",3,"change"],[3,"value",4,"ngFor","ngForOf"],["value","Otra"],[4,"ngIf"],["for","mail"],["id","mail","formControlName","mail","type","email"],["for","clave"],["id","clave","formControlName","clave","type","password"],["for","imagen"],["id","imagen","type","file","multiple","",1,"buttonSeleccionarArchivo",3,"change"],["type","submit"],[3,"value"],["for","otraEspecialidad"],["id","otraEspecialidad","formControlName","otraEspecialidad","type","text"]],template:function(r,a){if(r&1&&(t(0,"form",0),b("ngSubmit",function(){return a.registrar()}),t(1,"div")(2,"label",1),n(3,"Nombre:"),e(),s(4,"input",2),e(),t(5,"div")(6,"label",3),n(7,"Apellido:"),e(),s(8,"input",4),e(),t(9,"div")(10,"label",5),n(11,"DNI:"),e(),s(12,"input",6),e(),t(13,"div")(14,"label",7),n(15,"Edad:"),e(),s(16,"input",8),e(),t(17,"div")(18,"label",9),n(19,"Especialidad:"),e(),t(20,"select",10),b("change",function(p){return a.onEspecialidadChange(p)}),f(21,K,2,2,"option",11),t(22,"option",12),n(23,"Otra"),e()(),f(24,W,4,0,"div",13),e(),t(25,"div")(26,"label",14),n(27,"Mail:"),e(),s(28,"input",15),e(),t(29,"div")(30,"label",16),n(31,"Contrase\xF1a:"),e(),s(32,"input",17),e(),t(33,"div")(34,"label",18),n(35,"Imagen de Perfil:"),e(),t(36,"input",19),b("change",function(p){return a.onFileChange(p)}),e()(),t(37,"button",20),n(38,"Registrar"),e(),f(39,X,2,1,"div",13),e()),r&2){let m;u("formGroup",a.form),c(21),u("ngForOf",a.especialidades),c(3),u("ngIf",((m=a.form.get("especialidad"))==null?null:m.value)==="Otra"),c(15),u("ngIf",a.mensajeError)}},dependencies:[T,A,q,j,P,I,w,N,F,U,R,V,M,y],styles:['form[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:10px;background-image:url("./media/medicalutn1-NOQABUCO.jpg");box-shadow:0 2px 4px #0000001a}form[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{margin-bottom:15px}label[_ngcontent-%COMP%]{display:block;margin-bottom:5px;font-weight:700}input[type=text][_ngcontent-%COMP%], input[type=email][_ngcontent-%COMP%], input[type=password][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], select[_ngcontent-%COMP%]{width:calc(100% - 20px);padding:10px;border:1px solid #ccc;border-radius:5px;box-sizing:border-box}input[type=file][_ngcontent-%COMP%]{padding:3px}button[type=submit][_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}button[type=submit][_ngcontent-%COMP%]:hover{background-color:#45a049}.buttonSeleccionarArchivo[_ngcontent-%COMP%]{width:100%;padding:10px;background-color:#4caf50;color:#fff;border:none;border-radius:5px;font-size:16px;cursor:pointer}.form-floating[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{color:#495057;font-size:18px}.form-floating[_ngcontent-%COMP%]{margin-bottom:1rem}.estado-registro[_ngcontent-%COMP%], .checkbox[_ngcontent-%COMP%]{margin-top:1rem}.form-signin[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:block;margin-left:auto;margin-right:auto;margin-bottom:1rem;width:100px}a[_ngcontent-%COMP%]{color:#007bff;text-decoration:none}a[_ngcontent-%COMP%]:hover{text-decoration:underline}.error[_ngcontent-%COMP%]{color:red}.exito[_ngcontent-%COMP%]{color:green}']});let o=l;return o})();export{me as a};