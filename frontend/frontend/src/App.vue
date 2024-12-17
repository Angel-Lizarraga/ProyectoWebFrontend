<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Proyecto Gestión CRUD</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <div id="app-loader" style="display: none;">
        <Loader />
      </div>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Loader from './components/Loader.vue';

export default {
  components: { Loader },
  data() {
    return {
      navItems: [
        { title: 'Inicio', to: '/' },
        { title: 'Estudiantes', to: '/estudiantes' },
        { title: 'Cursos', to: '/cursos' },
        { title: 'Profesores', to: '/profesores' },
      ],
    };
  },
};
</script>