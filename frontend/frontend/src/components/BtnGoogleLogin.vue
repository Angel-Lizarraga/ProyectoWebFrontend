<template>
    <div ref="googleLoginBtn" class="btn_google"></div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const googleLoginBtn = ref(null);
  
  onMounted(() => {

      window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_APP_ID_CLIENT_GOOGLE,
          callback: onSuccess,
          context: 'signin',
          prompt: 'select_account',
          auto_select: false,
          referrerPolicy: {
              policy: 'strict-origin-when-cross-origin'
          }
      });
      window.google.accounts.id.renderButton(
          googleLoginBtn.value, {
          text: 'signin_with',  // También puede ser 'signup_with' | 'continue_with' | 'signin'
          size: 'large',        // Tamaño del botón: 'small' | 'medium' | 'large'
          width: '366',         // Ancho máximo 400
          theme: 'filled_black', // Tema: 'filled_black' | 'filled_blue' | 'outline'
          logo_alignment: 'center'  // Alineación del logo
      });
  })
  function onSuccess(response) {
      console.log(response.credential);
      const token = response.credential;
      localStorage.setItem('google_token', token);
      enviarTokenAlBackend(token);
  }
  function enviarTokenAlBackend(token) {
      fetch('http://localhost:4000/verify', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => response.json())
      .then(data => {
          console.log('Respuesta del backend:', data);
          alert(data.message);
      })
      .catch(error => {
          console.error('Error al enviar el token al backend:', error);
      });
  }
  </script>
  