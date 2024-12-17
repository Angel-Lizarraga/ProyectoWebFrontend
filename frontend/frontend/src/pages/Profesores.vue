<template>
  <v-container>
    <h1 class="text-left mb-4">Gestión de Profesores</h1>

    <!--Barra de búsqueda-->
    <v-row class="mb-4" justify="start" align="center">
      <v-col cols="8" md="6">
        <v-text-field
          v-model="matEmpleadoBusqueda"
          label="Buscar por Matrícula de Empleado"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2" md="2">
        <v-btn color="primary" @click="buscarProfesor" block>Buscar</v-btn>
      </v-col>
      <v-col cols="2" md="2">
        <v-btn color="grey" @click="restablecerBusqueda" block>Restablecer</v-btn>
      </v-col>
    </v-row>

    <!--Botón para Crear Profesor-->
    <v-row class="mb-4" justify="start" align="center">
      <v-col cols="2" md="2">
        <v-btn icon small color="green" @click="dialogCrear = true" title="Crear Profesor">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!--Tabla de Profesores-->
    <v-row justify="start">
      <v-col cols="12" md="10">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Matrícula de Empleado</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(profesor, index) in profesores" :key="index">
                <td>{{ profesor.matEmpleado }}</td>
                <td>{{ profesor.nombre }}</td>
                <td>
                  <v-btn icon small @click="verCursos(profesor.matEmpleado)" title="Ver Cursos">
                    <v-icon>mdi-book-open-variant</v-icon>
                  </v-btn>
                  <v-btn icon small @click="verEstudiantes(profesor.matEmpleado)" title="Ver Estudiantes">
                    <v-icon>mdi-account-group</v-icon>
                  </v-btn>
                  <v-btn icon small @click="editarProfesor(profesor.matEmpleado)" title="Editar">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small @click="inscribirCursoProfesor(profesor.matEmpleado)" title="Asignar Curso">
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                  <v-btn icon small @click="confirmarDesinscribirProfesor(profesor.matEmpleado)" title="Desasignar Curso">
                    <v-icon>mdi-minus-box</v-icon>
                  </v-btn>
                  <v-btn icon small color="red" @click="confirmarEliminar(profesor.matEmpleado)" title="Eliminar">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!--Mostrar tabla de estudiantes-->
    <v-row v-if="mostrarTabla === 'estudiantes'">
  <v-col cols="12" md="10">
    <v-simple-table class="mt-4">
      <template v-slot:default>
        <thead>
          <tr>
            <th>Matrícula del Estudiante</th>
            <th>Nombre del Estudiante</th>
            <th>Curso</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(estudiante, index) in estudiantes" :key="index">
            <td>{{ estudiante.matricula }}</td>
            <td>{{ estudiante.nombre }}</td>
            <td>{{ estudiante.curso }}</td>
          </tr>
          <tr v-if="estudiantes.length === 0">
            <td colspan="3" class="text-center">No hay estudiantes para este profesor.</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-col>
</v-row>


    <!--Mostrar tabla de cursos-->
    <v-row v-if="mostrarTabla === 'cursos'">
      <v-col cols="12" md="10">
        <v-simple-table class="mt-4">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Curso</th>
              </tr>
            </thead>
            <tbody>
          <tr v-if="cursos.length === 0">
            <td colspan="1" class="text-center">No hay cursos disponibles</td>
          </tr>
          <tr v-for="(curso, index) in cursos" :key="index">
            <td>{{ curso.nombre }}</td>
          </tr>
        </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!-- Diálogo de Confirmación -->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al profesor con matrícula de empleado "{{ matEmpleadoSeleccionado }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn text color="red" @click="eliminarProfesorConfirmado">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Diálogo de Edición-->
    <v-dialog v-model="dialogEditar" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Editar Profesor</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="profesorEditado.nombre"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogEditar = false">Cancelar</v-btn>
          <v-btn text color="green" @click="guardarEdicion">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Diálogo de Crear Profesor-->
    <v-dialog v-model="dialogCrear" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Crear Profesor</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoProfesor.matEmpleado"
                  label="Matrícula de Empleado"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoProfesor.nombre"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogCrear = false">Cancelar</v-btn>
          <v-btn text color="green" @click="guardarProfesor">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mostrar mensajes -->
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
      profesores: [],
      estudiantes: [],
      cursos: [],
      mostrarTabla: null,
      dialogEliminar: false,
      matEmpleadoSeleccionado: null,
      dialogEditar: false,
      profesorEditado: { matEmpleado: null, nombre: "" },
      matEmpleadoBusqueda: "",
      nuevoProfesor: {
        matEmpleado: "",
        nombre: "",
      },
      dialogCrear: false,
      snackbarMessage: "",
      snackbarVisible: false,
    };
  },
  created() {
    this.fetchProfesores();
  },
  methods: {
    async fetchProfesores() {
      try {
        const response = await axios.get("http://localhost:4000/profesores");
        this.profesores = response.data;
      } catch (error) {
        console.error("Error fetching profesores:", error);
      }
    },
    async buscarProfesor() {
      if (this.matEmpleadoBusqueda) {
        try {
          const response = await axios.get(
            `http://localhost:4000/profesores/${this.matEmpleadoBusqueda}`
          );

          if (response.status === 200 && response.data) {
            this.profesores = [response.data];
          } else {
            this.profesores = [];
            alert("Profesor no encontrado.");
          }
        } catch (error) {
          console.error("Error al buscar profesor:", error);
          alert("No se encontró un profesor con la matrícula proporcionada.");
        }
      } else {
        alert("Por favor ingresa una matrícula para buscar.");
      }
    },
    restablecerBusqueda() {
      this.matEmpleadoBusqueda = "";
      this.fetchProfesores();
    },
    async fetchCursos(matEmpleado) {
      try {
        const response = await axios.get(
          `http://localhost:4000/profesores/${matEmpleado}/cursos`
        );
        this.cursos = response.data;
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    },
    verEstudiantes(matEmpleado) {
  this.mostrarTabla = 'estudiantes';
  this.fetchEstudiantes(matEmpleado);
},
async fetchEstudiantes(matEmpleado) {
    try {
      const response = await axios.get(
        `http://localhost:4000/profesores/${matEmpleado}/estudiantes`
      );
      this.estudiantes = response.data.map(item => ({
        ...item.estudiante,
        curso: item.curso ? item.curso.clave : 'Sin curso',
      }));
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    }
  },
    verCursos(matEmpleado) {
      this.mostrarTabla = "cursos";
      this.fetchCursos(matEmpleado);
    },
    editarProfesor(matEmpleado) {
      const profesor = this.profesores.find(
        (p) => p.matEmpleado === matEmpleado
      );
      if (profesor) {
        this.profesorEditado = { ...profesor };
        this.dialogEditar = true;
      }
    },
    async guardarEdicion() {
      try {
        const response = await axios.put(
          `http://localhost:4000/profesores/${this.profesorEditado.matEmpleado}`,
          { nombre: this.profesorEditado.nombre }
        );
        const index = this.profesores.findIndex(
          (p) => p.matEmpleado === this.profesorEditado.matEmpleado
        );
        if (index !== -1) {
          this.profesores[index] = { ...this.profesorEditado };
        }
        this.snackbarMessage = "¡Edición exitosa!";
        this.snackbarVisible = true;
        this.dialogEditar = false;
      } catch (error) {
        alert(
          `Error al guardar los cambios: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    },
    async guardarProfesor() {
      try {
        const response = await axios.post(
          "http://localhost:4000/profesores",
          this.nuevoProfesor
        );
        this.profesores.push(response.data);
        this.snackbarMessage = "¡Profesor creado exitosamente!";
        this.snackbarVisible = true;
        this.dialogCrear = false;
        this.nuevoProfesor = { matEmpleado: "", nombre: "" };
      } catch (error) {
        alert(
          `Error al guardar el profesor: ${
            error.response?.data?.error || error.message
          }`
        );
      }
    },
    async eliminarProfesorConfirmado() {
      try {
        await axios.delete(
          `http://localhost:4000/profesores/${this.matEmpleadoSeleccionado}`
        );
        this.profesores = this.profesores.filter(
          (profesor) => profesor.matEmpleado !== this.matEmpleadoSeleccionado
        );
        this.snackbarMessage = "Profesor eliminado exitosamente.";
        this.snackbarVisible = true;
        this.dialogEliminar = false;
      } catch (error) {
        alert(`Error al eliminar el profesor: ${error.response?.data?.error || error.message}`);
      }
    },
    confirmarEliminar(matEmpleado) {
      this.matEmpleadoSeleccionado = matEmpleado;
      this.dialogEliminar = true;
    },
    async inscribirCursoProfesor(matEmpleado) {
  const claveCurso = prompt('Por favor ingresa la clave del curso para inscribir al profesor:');
  if (claveCurso) {
    try {
      const response = await axios.patch(`http://localhost:4000/profesores/${matEmpleado}/inscribir`, { clave: claveCurso });
      alert(`¡Inscripción exitosa! ${response.data.message}`);
      this.fetchProfesores();
    } catch (error) {
      alert(`Error al inscribir al profesor: ${error.response?.data?.error || error.message}`);
    }
  } else {
    alert("No se proporcionó una clave válida.");
  }
},
confirmarDesinscribirProfesor(matEmpleado) {
  const claveCurso = prompt('Por favor ingresa la clave del curso para desinscribir al profesor:');
  if (claveCurso) {
    const confirmar = confirm(`¿Estás seguro de que deseas desinscribir al profesor con matrícula ${matEmpleado} del curso con clave ${claveCurso}?`);
    if (confirmar) {
      this.desinscribirCursoProfesor(matEmpleado, claveCurso);
    }
  } else {
    console.log("No se proporcionó una clave válida.");
  }
},
async desinscribirCursoProfesor(matEmpleado, claveCurso) {
  try {
    const response = await axios.patch(`http://localhost:4000/profesores/${matEmpleado}/desinscribir`, { clave: claveCurso });
    alert(`¡Desinscripción exitosa! ${response.data.message}`);
    this.fetchProfesores();
  } catch (error) {
    alert(`Error al desinscribir al profesor: ${error.response?.data?.error || error.message}`);
    console.error("Error al desinscribir al profesor:", error);
  }
},
  },
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