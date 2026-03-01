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

### Documentación de API

La colección de Postman se encuentra disponible en:
La carpeta docs del proyecto

### npm run test:cov

------------------------------------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------------------|---------|----------|---------|---------|-------------------
All files | 99.06 | 80.51 | 95.55 | 98.92 |  
 src | 90.47 | 75 | 66.66 | 86.66 |  
 app.controller.ts | 100 | 75 | 100 | 100 | 6  
 app.service.ts | 100 | 100 | 100 | 100 |  
 prisma.service.ts | 75 | 100 | 33.33 | 66.66 | 14-18  
 src/products/application | 100 | 81.25 | 100 | 100 |  
 product.service.ts | 100 | 100 | 100 | 100 |  
 transaction.service.ts | 100 | 83.33 | 100 | 100 | 18  
 user.service.ts | 100 | 75 | 100 | 100 | 9  
 src/products/domain | 100 | 91.66 | 100 | 100 |  
 product.entity.ts | 100 | 100 | 100 | 100 |  
 transaction.entity.ts | 100 | 100 | 100 | 100 |  
 transactions.api.domain.ts | 100 | 91.66 | 100 | 100 | 12  
 src/products/infrastructure/controllers | 100 | 78.12 | 100 | 100 |  
 product.controller.ts | 100 | 80 | 100 | 100 | 14,24  
 transaction.controller.ts | 100 | 75 | 100 | 100 | 15-18  
 user.controller.ts | 100 | 78.57 | 100 | 100 | 8-11,18  
 src/products/infrastructure/dto | 100 | 100 | 100 | 100 |  
 product.dto.ts | 100 | 100 | 100 | 100 |  
 request.transaction.dto.ts | 100 | 100 | 100 | 100 |  
 transaction.dto.ts | 100 | 100 | 100 | 100 |  
 user.dto.ts | 100 | 100 | 100 | 100 |  
 src/products/infrastructure/repositories | 100 | 76.92 | 100 | 100 |  
 product.repository.ts | 100 | 80 | 100 | 100 | 7  
 transaction.repository.ts | 100 | 75 | 100 | 100 | 7  
 user.repository.ts | 100 | 75 | 100 | 100 | 9  
------------------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 16 passed, 16 total
Tests: 71 passed, 71 total
Snapshots: 0 total
Time: 16.887 s
Ran all test suites.
