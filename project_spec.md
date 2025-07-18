PROJECT: Sitio Web Corporativo Antko

GOAL: Desarrollar un sitio web en Deno Fresh con una página central para la empresa Antko y tres páginas diferenciadas para sus submarcas. Incluir login de administrador con panel tipo CMS para la gestión de productos compartidos entre las marcas.

CONSTRAINTS:
- Usar Deno Fresh como framework base
- Cada submarca debe tener su propio estilo visual
- Implementar CMS simple accesible solo para administradores
- CRUD de productos centralizado pero con control de visibilidad por submarca
- Escribir pruebas básicas para rutas de CMS y lógica de visibilidad de productos

DELIVERABLES:
1. Página principal de Antko con navegación a submarcas
2. Tres páginas diferenciadas para:
   - Antko Soluciones en Agua
   - Antko Wattersolutions
   - Antko Acuafitting
3. Sistema de login/logout de administradores
4. Panel tipo CMS con:
   - CRUD de productos
   - Switch para definir visibilidad de cada producto en una o más submarcas
5. Estilos diferenciados por submarca
6. Middleware de protección de rutas del panel CMS
7. Estructura de datos de producto con atributos:
   - Nombre, descripción, imagen, categoría, submarcas visibles (flags)
8. Tests básicos para:
   - Autenticación
   - Permisos de acceso
   - Operaciones CRUD
   - Visibilidad condicional por página
