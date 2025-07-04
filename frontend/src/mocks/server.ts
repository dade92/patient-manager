import { createServer, Model, Response, Registry } from 'miragejs';
import Schema from 'miragejs/orm/schema';
import { Patient } from '../types/patient';
import { Operation } from '../types/operation';
import { mockPatients } from './mockData';

// Sample operations data for the mock server
const mockOperations = [
  {
    id: 'OP-1001',
    patientId: '1',
    type: 'CONSULTATION',
    description: 'Initial consultation for back pain',
    executor: 'Dr. Smith',
    assets: [],
    additionalNotes: [],
    createdAt: '2025-06-01T10:00:00',
    updatedAt: '2025-06-01T10:30:00'
  },
  {
    id: 'OP-1002',
    patientId: '1',
    type: 'DIAGNOSTIC',
    description: 'X-Ray examination of lower back',
    executor: 'Dr. Johnson',
    assets: [],
    additionalNotes: [],
    createdAt: '2025-06-15T14:00:00',
    updatedAt: '2025-06-15T14:45:00'
  }
];

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      patient: Model,
      operation: Model
    },

    seeds(server) {
      mockPatients.forEach(patient => {
        server.create('patient', patient);
      });
      mockOperations.forEach(operation => {
        server.create('operation', operation);
      });
    },

    routes() {
      this.namespace = 'api';

      this.get('/patient/:id', (schema, request) => {
        const patient = schema.findBy('patient', { id: request.params.id });
        if (!patient) {
          return new Response(404);
        }
        return patient.attrs;
      });

      this.get('/patient/search', (schema, request) => {
        const nameParam = request.queryParams.name;
        const searchTerm = Array.isArray(nameParam) ? nameParam[0] : nameParam;
        const name = (searchTerm || '').toLowerCase();

        const patients = (schema.all('patient').models as any[])
          .filter(patient => patient.attrs.name.toLowerCase().includes(name))
          .map(patient => patient.attrs as Patient);

        return { patients };
      });

      this.post('/patient', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const patient = schema.create('patient', {
          ...attrs,
          id: `PAT-${Math.floor(Math.random() * 10000)}`
        });

        return patient.attrs;
      });

      // Get operations by patient ID
      this.get('/operations/patient/:patientId', (schema, request) => {
        const allOperations = schema.all('operation');
        const operations = (allOperations.models as any[])
          .filter(operation => operation.attrs.patientId === request.params.patientId)
          .map(operation => operation.attrs as Operation);
        return { operations };
      });

      // Create new operation
      this.post('/operations', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        // Validate that patient exists
        const patient = schema.findBy('patient', { id: attrs.patientId });
        if (!patient) {
          return new Response(404, {}, { message: 'Patient not found' });
        }

        const operation = schema.create('operation', {
          ...attrs,
          id: `OP-${Math.floor(Math.random() * 10000)}`,
          assets: [],
          additionalNotes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        return new Response(201, {}, operation.attrs);
      });
    },
  });
}
