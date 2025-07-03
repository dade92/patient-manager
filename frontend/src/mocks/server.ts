import { createServer, Model, Response } from 'miragejs';
import { Patient } from '../types/patient';
import { mockPatients } from './mockData';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      patient: Model
    },

    seeds(server) {
      mockPatients.forEach(patient => {
        server.create('patient', patient);
      });
    },

    routes() {
      this.namespace = 'api';

      // Get patient by ID
      this.get('/patient/:id', (schema, request) => {
        let id = request.params.id;
        let patient = schema.find('patient', id);
        return patient || new Response(404);
      });

      // Search patients
      this.get('/patient/search', (schema, request) => {
        const nameParam = request.queryParams.name;
        const searchTerm = Array.isArray(nameParam) ? nameParam[0] : nameParam;
        const name = (searchTerm || '').toLowerCase();

        const patients = (schema.all('patient').models as unknown as { attrs: Patient }[])
          .filter(patient => patient.attrs.name.toLowerCase().includes(name))
          .map(patient => patient.attrs);

        return { patients };
      });

      // Create new patient
      this.post('/patient', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const patient = schema.create('patient', {
          ...attrs,
          id: `PAT-${Math.floor(Math.random() * 10000)}`
        });

        return patient.attrs;
      });
    },
  });
}
