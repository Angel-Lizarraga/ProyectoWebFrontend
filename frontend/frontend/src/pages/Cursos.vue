<template>
  <v-container>
    <h1 class="text-left mb-4">Gestión de Cursos</h1>

    <!--Barra de búsqueda-->
    <v-row class="mb-4" justify="start" align="center">
      <v-col cols="8" md="6">
        <v-text-field
          v-model="claveBusqueda"
          label="Buscar por Clave de Curso"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2" md="2">
        <v-btn color="primary" @click="buscarCurso" block>Buscar</v-btn>
      </v-col>
      <v-col cols="2" md="2">
        <v-btn color="grey" @click="restablecerBusqueda" block>Restablecer</v-btn>
      </v-col>
    </v-row>

    <!--Botón para Crear Curso-->
    <v-row class="mb-4" justify="start" align="center">
      <v-col cols="2" md="2">
        <v-btn icon small color="green" @click="dialogCrear = true" title="Crear Curso">
          <v-icon>mdi-book-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!--Tabla de Cursos-->
    <v-row justify="start">
      <v-col cols="12" md="10">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Créditos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(curso, index) in cursos" :key="index">
                <td>{{ curso.clave }}</td>
                <td>{{ curso.nombre }}</td>
                <td>{{ curso.creditos }}</td>
                <td>
                  <v-btn icon small @click="verProfesores(curso.clave)" title="Ver Profesores">
                    <v-icon>mdi-account-tie</v-icon>
                  </v-btn>
                  <v-btn icon small @click="verEstudiantes(curso.clave)" title="Ver Estudiantes">
                    <v-icon>mdi-account-group</v-icon>
                  </v-btn>
                  <v-btn icon small @click="editarCurso(curso.clave)" title="Editar">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small color="red" @click="confirmarEliminar(curso.clave)" title="Eliminar">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!--Mostrar tabla de Profes-->
    <v-row v-if="mostrarTabla === 'profesores'">
      <v-col cols="12" md="10">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="profesores.length === 0">
            <td colspan="2">No hay profesores disponibles.</td>
          </tr>
              <tr v-for="(profesor, index) in profesores" :key="index">
                <td>{{ profesor.matEmpleado }}</td> 
                <td>{{ profesor.nombre }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!--Mostrar tabla de Estudiantes-->
    <v-row v-if="mostrarTabla === 'estudiantes'">
      <v-col cols="12" md="10">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="estudiantes.length === 0">
            <td colspan="2">No hay estudiantes disponibles.</td>
          </tr>
              <tr v-for="(estudiante, index) in estudiantes" :key="index">
                <td>{{ estudiante.matricula }}</td>
                <td>{{ estudiante.nombre }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!--Dialogo de Confirmación de Eliminación-->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el curso con clave "{{ claveCursoSeleccionado }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn text color="red" @click="eliminarCursoConfirmado">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialogo de Edición del Curso-->
    <v-dialog v-model="dialogEditar" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Editar Curso</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="cursoEditado.nombre"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="cursoEditado.creditos"
                  label="Créditos"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogEditar = false">Cancelar</v-btn>
          <v-btn text color="green" @click="guardarEdicionCurso">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialogo de Crear Curso-->
    <v-dialog v-model="dialogCrear" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Crear Curso</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoCurso.clave"
                  label="Clave del Curso"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoCurso.nombre"
                  label="Nombre del Curso"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoCurso.creditos"
                  label="Créditos"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogCrear = false">Cancelar</v-btn>
          <v-btn text color="green" @click="guardarCurso">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Snackbar para indicar si se llena correctamente o no-->
    <v-snackbar v-model="snackbarVisible" :timeout="3000" color="green" top>
      {{ snackbarMessage }}
    </v-snackbar>

  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      cursos: [],
      claveBusqueda: "",
      mostrarTabla: null,
      profesores: [],
      estudiantes: [],
      dialogEliminar: false,
      claveCursoSeleccionado: null,
      dialogEditar: false,
      cursoEditado: { clave: "", nombre: "", creditos: 0 },
      nuevoCurso: { clave: "", nombre: "", creditos: 0 },
      dialogCrear: false,
      snackbarMessage: "",
      snackbarVisible: false,
    };
  },
  created() {
    this.fetchCursos();
  },
  methods: {
    async fetchCursos() {
      try {
        const response = await axios.get("http://localhost:4000/cursos");
        this.cursos = response.data;
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    },
    async buscarCurso() {
      if (this.claveBusqueda) {
        try {
          const response = await axios.get(
            `http://localhost:4000/cursos/${this.claveBusqueda}`
          );
          if (response.status === 200 && response.data) {
            this.cursos = [response.data];
          } else {
            this.cursos = [];
            alert("Curso no encontrado.");
          }
        } catch (error) {
          console.error("Error al buscar curso:", error);
          alert("No se encontró el curso.");
        }
      } else {
        alert("Por favor ingresa una clave para buscar.");
      }
    },
    restablecerBusqueda() {
      this.claveBusqueda = "";
      this.fetchCursos();
    },
    verProfesores(claveCurso) {
      this.mostrarTabla = "profesores";
      this.fetchProfesores(claveCurso);
    },
    async fetchProfesores(claveCurso) {
      try {
        const response = await axios.get(
          `http://localhost:4000/cursos/${claveCurso}/profesores`
        );
        this.profesores = response.data;
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
      }
    },
    verEstudiantes(claveCurso) {
      this.mostrarTabla = "estudiantes";
      this.fetchEstudiantes(claveCurso);
    },
    async fetchEstudiantes(claveCurso) {
      try {
        const response = await axios.get(
          `http://localhost:4000/cursos/${claveCurso}/estudiantes`
        );
        this.estudiantes = response.data;
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
      }
    },
    editarCurso(claveCurso) {
      const curso = this.cursos.find(c => c.clave === claveCurso);
      if (curso) {
        this.cursoEditado = { ...curso };
        this.dialogEditar = true;
      }
    },
    async guardarEdicionCurso() {
      try {
        const response = await axios.put(
          `http://localhost:4000/cursos/${this.cursoEditado.clave}`,
          this.cursoEditado
        );
        const index = this.cursos.findIndex(c => c.clave === this.cursoEditado.clave);
        if (index !== -1) {
          this.cursos[index] = { ...this.cursoEditado };
        }
        this.snackbarMessage = "Curso actualizado correctamente";
        this.snackbarVisible = true;
        this.dialogEditar = false;
      } catch (error) {
        console.error("Error al guardar la edición:", error);
      }
    },
    confirmarEliminar(claveCurso) {
      this.claveCursoSeleccionado = claveCurso;
      this.dialogEliminar = true;
    },
    async eliminarCursoConfirmado() {
      try {
        await axios.delete(
          `http://localhost:4000/cursos/${this.claveCursoSeleccionado}`
        );
        this.cursos = this.cursos.filter(c => c.clave !== this.claveCursoSeleccionado);
        this.snackbarMessage = "Curso eliminado correctamente";
        this.snackbarVisible = true;
        this.dialogEliminar = false;
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
      }
    },
    async guardarCurso() {
      try {
        const response = await axios.post("http://localhost:4000/cursos", this.nuevoCurso);
        this.cursos.push(response.data);
        this.snackbarMessage = "Curso creado correctamente";
        this.snackbarVisible = true;
        this.dialogCrear = false;
      } catch (error) {
        console.error("Error al crear el curso:", error);
      }
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background-color: #660095;
}
th,
td {
  padding: 12px;
  text-align: left;
  border: 1px solid #f7ed2e;
}
h1 {
  font-family: "Roboto", sans-serif;
}
.v-btn {
  margin-right: 4px;
}
.mt-4 {
  margin-top: 20px;
}
</style>