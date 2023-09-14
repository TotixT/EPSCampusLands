Endpoints

1. Obtener todos los pacientes de manera alfabética
URL: /EndPoint_1
Método: GET
Descripción: Devuelve una lista de todos los pacientes ordenados alfabéticamente por nombre.
Respuesta exitosa: Devuelve un arreglo de objetos JSON con la información de los pacientes.

2. Obtener las citas de una fecha en específico
URL: /EndPoint_2/:fecha
Método: GET
Descripción: Devuelve las citas programadas para una fecha específica, ordenadas alfabéticamente por el nombre de los pacientes.
Parámetros de URL: fecha (formato: "YYYY-MM-DD")
Respuesta exitosa: Devuelve un arreglo de objetos JSON con la información de las citas, incluyendo el nombre del médico.

3. Obtener todos los médicos de una especialidad en específico
URL: /EndPoint_3/:especialidad
Método: GET
Descripción: Devuelve una lista de todos los médicos que tienen una especialidad específica.
Parámetros de URL: especialidad (ID de la especialidad)
Respuesta exitosa: Devuelve un arreglo de objetos JSON con la información de los médicos y su especialidad.

4. Encontrar la próxima cita para un paciente en específico
URL: /EndPoint_4/:usuario_id
Método: GET
Descripción: Busca la próxima cita programada para un paciente en específico y devuelve detalles sobre la cita y la información del paciente.
Parámetros de URL: usuario_id (ID del paciente)
Respuesta exitosa: Devuelve un objeto JSON con detalles sobre la próxima cita y la información del paciente.
Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar esta API o agregar nuevas características, crea un fork del repositorio, realiza tus cambios y envía un pull request. Estaré encantado de revisar y fusionar tus contribuciones.

Licencia
Este proyecto está bajo la licencia MIT. Puedes consultar el archivo LICENSE para obtener más detalles.