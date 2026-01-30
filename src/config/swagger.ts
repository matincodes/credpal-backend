import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './swagger.registry.js'; // <--- Import from new file

// Import Module Documentations (Side-effects)
import '../modules/auth/auth.docs.js';
import '../modules/users/users.docs.js';
import '../modules/subscriptions/subscriptions.docs.js';

export const generateOpenAPIDocs = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'SubDub API (CredPal Backend Assessment)',
      version: '1.0.0',
      description: 'API Documentation for the Subscription Management System',
    },
    servers: [
      { url: 'http://localhost:3000/api/v1', description: 'Local Server' },
    ],
    
    security: [{ bearerAuth: [] }],
  });
};