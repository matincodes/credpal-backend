import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

export const registry = new OpenAPIRegistry()

// Define Security Scheme
registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
})


export function generateOpenAPIDocument() {
    const generator = new OpenApiGeneratorV3(registry.definitions)
    return generator.generateDocument({
        openapi: '3.0.0',
        info: {
            title: 'CredPal Backend API',
            version: '1.0.0',
            description: 'API documentation for CredPal Backend to manage Subscription and Payment services.'
        },
        servers: [
            {
                url: '/api/v1',
                description: 'Main API Server'
            }
        ], 
    })
}