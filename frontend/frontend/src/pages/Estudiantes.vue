<template>
  <v-container>
    <h1 class="text-left mb-4">Gestión de Estudiantes</h1>

        <!--Barra de búsqueda-->
        <v-row class="mb-4" justify="start" align="center">
      <v-col cols="8" md="6">
        <v-text-field
          v-model="matriculaBusqueda"
          label="Buscar por Matrícula"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2" md="2">
        <v-btn color="primary" @click="buscarEstudiante" block>Buscar</v-btn>
      </v-col>
      <v-col cols="2" md="2">
        <v-btn color="grey" @click="restablecerBusqueda" block>Restablecer</v-btn>
      </v-col>
    </v-row>

    <!--Botón para Crear Estudiante-->
    <v-row class="mb-4" justify="start" align="center">
      <v-col cols="2" md="2">
        <v-btn icon small color="green" @click="dialogCrear = true" title="Crear Estudiante">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!--Fila de Estudiantes-->
    <v-row justify="start">
      <v-col cols="12" md="10">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre</th>
                <th>Semestre</th>
                <th>Créditos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(estudiante, index) in estudiantes" :key="index">
                <td>{{ estudiante.matricula }}</td>
                <td>{{ estudiante.nombre }}</td>
                <td>{{ estudiante.semestre }}</td>
                <td>{{ estudiante.creditos }}</td>
                <td>
                  <v-btn icon small @click="verCursos(estudiante.matricula)" title="Ver Cursos">
                    <v-icon>mdi-book-open-variant</v-icon>
                  </v-btn>
                  <v-btn icon small @click="verProfesores(estudiante.matricula)" title="Ver Profesores">
                    <v-icon>mdi-human-male-board</v-icon>
                  </v-btn>
                  <v-btn icon small @click="editarEstudiante(estudiante.matricula)" title="Editar">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small @click="inscribirCurso(estudiante.matricula)" title="Inscribir a Curso">
                    <v-icon>mdi-plus-box</v-icon>
                  </v-btn>
                  <v-btn icon small @click="confirmarDesinscribir(estudiante.matricula)" title="Desinscribir de Curso">
                    <v-icon>mdi-minus-box</v-icon>
                  </v-btn>
                  <v-btn icon small color="red" @click="confirmarEliminar(estudiante.matricula)" title="Eliminar">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!-- Mostrar tabla de cursos o profesores-->
    <v-row v-if="mostrarTabla">
      <v-col cols="12" md="10">
        <!-- Tabla de Cursos -->
        <v-simple-table v-if="mostrarTabla === 'cursos'" class="mt-4">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="cursos.length === 0">
            <td colspan="2">No hay cursos disponibles.</td>
          </tr>
          <tr v-for="(curso, index) in cursos" :key="index">
            <td>{{ curso.clave }}</td>
            <td>{{ curso.nombre }}</td>
          </tr>
            </tbody>
          </template>
        </v-simple-table>

        <!-- Tabla de Profesores -->
        <v-simple-table v-if="mostrarTabla === 'profesores'" class="mt-4">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Curso</th>
              </tr>
            </thead>
            <tbody>

          <tr v-if="profesores.length === 0">
            <td colspan="2">No hay profesores disponibles.</td>
          </tr>
          <tr v-for="(item, index) in profesores" :key="index">
            <td>{{ item.profesor.nombre }}</td>
            <td>{{ item.curso.nombre }}</td>
          </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <!--Diálogo de Confirmación de Eliminacion-->
    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar al estudiante con matrícula "{{ matriculaSeleccionada }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn text color="red" @click="eliminarEstudianteConfirmado">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Edición -->
    <v-dialog v-model="dialogEditar" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Editar Estudiante</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="estudianteEditado.nombre"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="estudianteEditado.semestre"
                  label="Semestre"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="estudianteEditado.creditos"
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
          <v-btn text color="green" @click="guardarEdicion">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-if >

    </v-if>
    <!--Alertas de Edición-->
    <v-alert closable="true" :text="mensaje" v-model="edicionExitosa" color="success" icon="$success">
    </v-alert>

    <!--Diálogo de Crear Estudiante-->
    <v-dialog v-model="dialogCrear" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Crear Estudiante</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoEstudiante.matricula"
                  label="Matrícula"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoEstudiante.nombre"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoEstudiante.semestre"
                  label="Semestre"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nuevoEstudiante.creditos"
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
          <v-btn text color="green" @click="guardarEstudiante">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para lo mismo que lo otro-->
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
      estudiantes: [],
      cursos: [],
      profesores: [],
      mostrarTabla: null,
      dialogEliminar: false,
      matriculaSeleccionada: null,
      dialogEditar: false,
      estudianteEditado: { matricula: null, nombre: "", semestre: null, creditos: null },
      matriculaBusqueda: "",
      nuevoEstudiante: {
        matricula: "",
        nombre: "",
        semestre: null,
        creditos: null,
      },
      dialogCrear: false,
      snackbarMessage: "",
      snackbarVisible: false,
      edicionExitosa: false,
      edicionFallida: false,
      mensaje:""
    };
  },
  created() {
    this.fetchEstudiantes();
  },
  methods: {
    async fetchEstudiantes() {
      try {
        const response = await axios.get("http://localhost:4000/estudiantes");
        this.estudiantes = response.data;
      } catch (error) {
        console.error("Error fetching estudiantes:", error);
      }
    },
    async buscarEstudiante() {
  if (this.matriculaBusqueda) {
    try {
      const response = await axios.get(
        `http://localhost:4000/estudiantes/${this.matriculaBusqueda}`
      );
      
      if (response.status === 200 && response.data) {
        this.estudiantes = [response.data]; // solo el estudiante encontrado
      } else {
        this.estudiantes = [];
        alert("Estudiante no encontrado.");
      }
    } catch (error) {
      console.error("Error al buscar estudiante:", error);
      alert("No se encontró un estudiante con la matrícula proporcionada.");
    }
  } else {
    alert("Por favor ingresa una matrícula para buscar.");
  }
},
restablecerBusqueda() {
  this.matriculaBusqueda = "";
  this.fetchEstudiantes();
},
verCursos(matricula) {
      this.mostrarTabla = 'cursos';
      this.fetchCursos(matricula);
    },
    async fetchCursos(matricula) {
      try {
        const response = await axios.get(`http://localhost:4000/estudiantes/${matricula}/cursos`);
        this.cursos = response.data;
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    },
    verProfesores(matricula) {
      this.mostrarTabla = 'profesores';
      this.fetchProfesores(matricula);
    },
    async fetchProfesores(matricula) {
      try {
        const response = await axios.get(`http://localhost:4000/estudiantes/${matricula}/profesores`);
        this.profesores = response.data;
      } catch (error) {
        console.error("Error al obtener los profesores:", error);
      }
    },
    editarEstudiante(matricula) {
      const estudiante = this.estudiantes.find((e) => e.matricula === matricula);
      if (estudiante) {
        this.estudianteEditado = { ...estudiante };
        this.dialogEditar = true;
      }
    },
    async guardarEdicion() {
      try {
        // Enviar los datos actualizados al back
        const response = await axios.put(`http://localhost:4000/estudiantes/${this.estudianteEditado.matricula}`, {
          nombre: this.estudianteEditado.nombre,
          semestre: this.estudianteEditado.semestre,
          creditos: this.estudianteEditado.creditos,
        });
        const index = this.estudiantes.findIndex((e) => e.matricula === this.estudianteEditado.matricula);
        if (index !== -1) {
          this.estudiantes[index] = { ...this.estudianteEditado };
          this.edicionExitosa = true;
        }
        //alert(`¡Edición exitosa!`);
        this.edicionExitosa = true;
        this.mensaje = "edicion exitosa"
        this.dialogEditar = false;
      } catch (error) {
        this.edicionExitosa= true;
        this.mensaje = "edicion cancelada"
        //alert(`Error al guardar los cambios: ${error.response?.data?.error || error.message}`);
      }
    },
    async inscribirCurso(matricula) {
      const claveCurso = prompt('Por favor ingresa la clave del curso para inscribir al estudiante:');
      if (claveCurso) {
        try {
          const response = await axios.patch(`http://localhost:4000/estudiantes/${matricula}/inscribir`, { clave: claveCurso });
          alert(`¡Inscripción exitosa! ${response.data.message}`);
          this.fetchEstudiantes();
        } catch (error) {
          alert(`Error al inscribir al estudiante: ${error.response?.data?.error || error.message}`);
        }
      } else {
        alert("No se proporcionó una clave válida.");
      }
    },
    confirmarDesinscribir(matricula) {
      const claveCurso = prompt('Por favor ingresa la clave del curso para desinscribir al estudiante:');
      if (claveCurso) {
        const confirmar = confirm(`¿Estás seguro de que deseas desinscribir al estudiante con matrícula ${matricula} del curso con clave ${claveCurso}?`);
        if (confirmar) {
          this.desinscribirCurso(matricula, claveCurso);
        }
      } else {
        console.log("No se proporcionó una clave válida.");
      }
    },
    async desinscribirCurso(matricula, claveCurso) {
      try {
        const response = await axios.patch(`http://localhost:4000/estudiantes/${matricula}/desinscribir`, {
          clave: claveCurso,
        });
        alert(`¡Desinscripción exitosa! ${response.data.message}`);
        this.fetchEstudiantes();
      } catch (error) {
        alert(`Error al desinscribir al estudiante: ${error.response?.data?.error || error.message}`);
        console.error("Error al desinscribir al estudiante:", error);
      }
    },
    confirmarEliminar(matricula) {
      this.matriculaSeleccionada = matricula;
      this.dialogEliminar = true;
    },
    async eliminarEstudianteConfirmado() {
      try {
        await axios.delete(`http://localhost:4000/estudiantes/${this.matriculaSeleccionada}`);
        this.estudiantes = this.estudiantes.filter(
          (estudiante) => estudiante.matricula !== this.matriculaSeleccionada
        );
        this.dialogEliminar = false;
        this.matriculaSeleccionada = null;
        console.log(`Estudiante con matrícula ${this.matriculaSeleccionada} eliminado`);
      } catch (error) {
        console.error("Error al eliminar al estudiante:", error);
      }
    },
    async guardarEstudiante() {
      if (!this.nuevoEstudiante.matricula || !this.nuevoEstudiante.nombre || !this.nuevoEstudiante.semestre || !this.nuevoEstudiante.creditos) {
        this.snackbarMessage = "Por favor complete todos los campos.";
        this.snackbarVisible = true;
        return;
      }

      try {
        const response = await axios.post("http://localhost:4000/estudiantes", {
          matricula: this.nuevoEstudiante.matricula,
          nombre: this.nuevoEstudiante.nombre,
          semestre: this.nuevoEstudiante.semestre,
          creditos: this.nuevoEstudiante.creditos,
        });
        this.estudiantes.push(response.data);
        this.snackbarMessage = `¡Estudiante ${this.nuevoEstudiante.nombre} creado exitosamente!`;
        this.snackbarVisible = true;
        this.dialogCrear = false;
        this.nuevoEstudiante = {
          matricula: "",
          nombre: "",
          semestre: null,
          creditos: null,
        };
      } catch (error) {
        this.snackbarMessage = `Error al crear el estudiante: ${error.response?.data?.error || error.message}`;
        this.snackbarVisible = true;
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
