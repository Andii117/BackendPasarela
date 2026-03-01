### Backend API Payment-Checkout

Este proyecto es la API robusta encargada de gestionar el inventario, el registro de clientes y el procesamiento de pagos integrando la pasarela de pagos en modo Sandbox.

### Tecnologías y Herramientas

Framework: NestJS (TypeScript)

ORM: Prisma

Base de Datos: PostgreSQL

Patrones de Diseño: Arquitectura Hexagonal, Repository Pattern, Railway Oriented Programming (ROP).

Testing: Vitest (con compatibilidad de sintaxis Jest para cumplimiento de requisitos).

### Arquitectura del Software

Para cumplir con los principios de ingeniería de software y escalabilidad, el proyecto implementa Arquitectura Hexagonal (Ports & Adapters):

Domain (Core): Contiene las entidades de negocio (Product, Transaction, User) y las interfaces (Ports) que definen cómo el mundo exterior interactúa con el núcleo.

Application (Use Cases): Implementa la lógica de negocio siguiendo Railway Oriented Programming (ROP), asegurando un flujo de datos predecible y un manejo de errores elegante mediante el encadenamiento de operaciones.

Infrastructure (Adapters): Contiene las implementaciones técnicas:

Persistence: Adaptadores de Prisma para PostgreSQL.

External Services: Integración con la API de la pasarela.

Entry Points: Controladores REST de NestJS.

### Modelo de Datos (Entity Relationship)

El diseño de la base de datos se centra en la trazabilidad completa de la compra:

Products: Maestro de artículos con control de stock.

Users: Información del cliente (tokenizada/segura) incluyendo documentos y contacto.

Transactions: Registro histórico que vincula al usuario con el producto, almacenando el ID externo de la pasarela y el estado (PENDING, APPROVED, DECLINED).

### erDiagram

```prisma
  USERS {
      string id PK
      string email UK
      string documentNumber UK
  }
  TRANSACTIONS {
      string id PK
      string reference UK
      string external_transaction_id
      string status
  }
  PRODUCTS {
      string id PK
      int stock
      float price
  }
```

### Calidad y Testing

Se ha priorizado la cobertura de código para asegurar la estabilidad de las transacciones financieras.

Cobertura alcanzada: 96%

Herramienta: Vitest / Coverage-v8.

Comando de ejecución:

```bash
 npm run test:cov
```

Los tests unitarios cubren la lógica de los Casos de Uso (Application Layer) y los Servicios de infraestructura, garantizando que el stock se actualice solo tras transacciones exitosas.

### Uso de AI Assistant

Se utilizó AI CLI Assist y Gemini 3 Flash para:

Generación de esquemas iniciales de Prisma a partir de requerimientos de negocio.

Refactorización de lógica de controladores hacia servicios de aplicación siguiendo ROP.

Creación de mocks complejos para las pruebas unitarias de la integración con la API externa.

### Instalación y Ejecución

Clonar el repositorio: g
it clone ... (Recordar: No usar la palabra prohibida en el nombre del repo).

Variables de entorno: Configurar .env con DATABASE_URL y las API Keys de Sandbox proporcionadas.

Instalar dependencias:

```bash
npm install

npx prisma migrate dev

npm run start:dev
```

### Ejecución del dockerfile

En cosola escribir el comando:

```bash
docker run -d --name backend_container -p 3000:3000 -e DATABASE_URL="postgresql://wompi_user:wompi_pass@host.docker.internal:5432/wompi_db?schema=public" -e WOMPI_PUBLIC_KEY="pub_test_vqyfdl6B3yg6HBohdCuaFhyIkAtOb6Ag" -e WOMPI_PRIVATE_KEY="prv_test_IkhF461kL7cQkTNSpeQkDILMdYIngeh4" -e WOMPI_EVENTS_ID="test_events_hCTyBJTzd8wKxn6Te57baRgg3aBF1jAr" -e WOMPI_INTEGRITY_SECRET="test_integrity_fUNiorHNTA4t1qczJsMGysJSRIYCaybF" payment-back-test
```
