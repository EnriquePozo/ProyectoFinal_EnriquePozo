const capsula = document.querySelector('.capsula');
const linkiniciar = document.querySelector('.link-iniciar');
const linkregistrar = document.querySelector('.link-registrar');
const btnPopup= document.querySelector('.btnLogin-popup');
const iconoCerrar= document.querySelector('.cerrar');
const servicio= document.querySelector('.serv');
const btnOut= document.querySelector('.btnLogout')

linkregistrar.addEventListener('click', ()=>{
    capsula.classList.add('activo');
});

linkiniciar.addEventListener('click', ()=>{
    capsula.classList.remove('activo');
});

btnPopup.addEventListener('click', ()=>{
    capsula.classList.add('activarpopup');
})

iconoCerrar.addEventListener('click', ()=>{
    capsula.classList.remove('activarpopup');
})

btnOut.addEventListener('click', ()=>{
    servicio.classList.add('desactivado'); 
    btnPopup.classList.remove('desactivalogin');
    btnOut.classList.add('desactivalogout');
    window.location.href='index.html';
})

function Ingresar(){
    const email = document.querySelector('#lemail').value
    const password = document.querySelector('#lpassword').value
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    const validarUsuario = usuarios.find(user => user.email === email || user.password === password)

    if(!validarUsuario){
        //return alert('Datos incorrectos!')
        Swal.fire({
            position: 'top-center',
            icon: 'error',
            title: 'Datos incorrectos!',
            showConfirmButton: false,
            timer: 1500
          })
        return ''
    }

    //alert(`Bienvenido(a) ${validarUsuario.usuario}`);
    let bienvenida=`Bienvenido(a) ${validarUsuario.usuario}`;
    Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: bienvenida,         //'Datos incorrectos!',
        showConfirmButton: false,
        timer: 1500
      })

    sessionStorage.clear();
    const uActual={usuario:validarUsuario.usuario, email:validarUsuario.email, password:validarUsuario.password};
    sessionStorage.setItem('usuarioActual',JSON.stringify(uActual));
    servicio.classList.remove('desactivado'); 
    btnPopup.classList.add('desactivalogin');
    btnOut.classList.remove('desactivalogout');   

    document.getElementById("lemail").value="";
    document.getElementById("lpassword").value="";
    iconoCerrar.click();
}

function Registrar(){
    const usuario = document.querySelector('#rusuario').value
    const email = document.querySelector('#remail').value
    const password = document.querySelector('#rpassword').value
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    const siUsuarioRegistrado = usuarios.find(user => user.email === email || user.usuario === usuario)
    if(siUsuarioRegistrado){
        //return alert('El usuario ya se encuentra registrado')
        Swal.fire({
            position: 'top-center',
            icon: 'warning',
            title: 'El usuario ya se encuentra registrado',
            showConfirmButton: false,
            timer: 1500
          })
        return ''
    }

    usuarios.push({usuario: usuario, email: email, password: password})
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    //alert('Registro exitoso')
    Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500
      })
    document.getElementById("rusuario").value="";
    document.getElementById("remail").value="";
    document.getElementById("rpassword").value="";
    linkiniciar.click();
    iconoCerrar.click();

}

function Revisar(){
    const cargardefault = (sessionStorage.length>0) ? true : false
    if(!cargardefault)
    {
        servicio.classList.remove('desactivado'); 
        btnPopup.classList.add('desactivalogin');
        btnOut.classList.remove('desactivalogout'); 
    }
}