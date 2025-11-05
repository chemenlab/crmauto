#!/bin/bash

# Fix unused parameters by adding underscore prefix

# app.ts
sed -i "s/(req, res)/(\_req, res)/g" src/app.ts

# auth.controller.ts
sed -i "s/^const refreshSchema/\/\/ const refreshSchema/g" src/controllers/auth.controller.ts
sed -i "s/^export async function logout(req: Request/export async function logout(\_req: Request/g" src/controllers/auth.controller.ts

# auth.middleware.ts
sed -i "s/, res: Response/, \_res: Response/g" src/middlewares/auth.middleware.ts

# error.middleware.ts  
sed -i "s/(req: Request/(\_req: Request/g" src/middlewares/error.middleware.ts
sed -i "s/, next: NextFunction/, \_next: NextFunction/g" src/middlewares/error.middleware.ts

# cities and categories routes
sed -i "s/async (req: Request/async (\_req: Request/g" src/routes/cities.routes.ts
sed -i "s/async (req: Request/async (\_req: Request/g" src/routes/categories.routes.ts

# services.service.ts
sed -i "s/openNow,/\/\/ openNow,/g" src/services/services.service.ts

echo "Fixed TypeScript files"
