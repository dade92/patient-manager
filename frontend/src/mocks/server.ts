import {createServer, Model, Response} from 'miragejs';
import {Patient} from '../types/patient';
import {Operation} from '../types/operation';
import {mockPatients, mockOperations} from './mockData';

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
      this.get('/operation/patient/:patientId', (schema, request) => {
        const allOperations = schema.all('operation');
        const operations = (allOperations.models as any[])
          .filter(operation => operation.attrs.patientId === request.params.patientId)
          .map(operation => operation.attrs as Operation);
        return { operations };
      });

      // Get operation by ID
      this.get('/operation/:id', (schema, request) => {
        const operation = (schema.all('operation').models as any[])
          .find(op => op.attrs.id === request.params.id);

        if (!operation) {
          return new Response(404, {}, { message: 'Operation not found' });
        }

        return operation.attrs;
      });

      // Create new operation
      this.post('/operation', (schema, request) => {
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

      // Upload asset to operation
      this.post('/operation/:id/assets', (schema, request) => {
        const operationId = request.params.id;
        const operation = (schema.all('operation').models as any[])
          .find(op => op.attrs.id === operationId);

        if (!operation) {
          return new Response(404, {}, { message: 'Operation not found' });
        }

        // Simulate file upload - in a real implementation, you'd handle the FormData
        // For now, we'll just add a mock filename to the assets array
        const mockFileName = `uploaded_file_${Date.now()}.pdf`;
        const updatedAssets = [...(operation.attrs.assets || []), mockFileName];

        // Update the operation with the new asset
        operation.update({
          assets: updatedAssets,
          updatedAt: new Date().toISOString()
        });

        return new Response(200, {}, operation.attrs);
      });

      // Add note to operation
      this.post('/operation/:id/notes', (schema, request) => {
        const operationId = request.params.id;
        const operation = (schema.all('operation').models as any[])
          .find(op => op.attrs.id === operationId);

        if (!operation) {
          return new Response(404, {}, { message: 'Operation not found' });
        }

        // Parse the request body to get the note content
        const attrs = JSON.parse(request.requestBody);

        if (!attrs.content || attrs.content.trim() === '') {
          return new Response(400, {}, { message: 'Note content cannot be empty' });
        }

        // Create a new note with the content and current timestamp
        const newNote = {
          content: attrs.content,
          createdAt: new Date().toISOString()
        };

        // Add the new note to the operation's additionalNotes array
        const updatedNotes = [...(operation.attrs.additionalNotes || []), newNote];

        // Update the operation with the new note
        operation.update({
          additionalNotes: updatedNotes,
          updatedAt: new Date().toISOString()
        });

        return new Response(200, {}, operation.attrs);
      });

      // Create invoice
      this.post('/invoice', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);

        // Validate required fields
        if (!attrs.operationId || !attrs.patientId || !attrs.amount) {
          return new Response(400, {}, { message: 'Missing required fields' });
        }

        // Validate amount
        if (!attrs.amount.amount || attrs.amount.amount <= 0) {
          return new Response(400, {}, { message: 'Invalid amount' });
        }

        // Validate that operation exists
        const operation = (schema.all('operation').models as any[])
          .find(op => op.attrs.id === attrs.operationId);

        if (!operation) {
          return new Response(404, {}, { message: 'Operation not found' });
        }

        // Validate that patient exists
        const patient = schema.findBy('patient', { id: attrs.patientId });
        if (!patient) {
          return new Response(404, {}, { message: 'Patient not found' });
        }

        // Create mock invoice
        const invoice = {
          id: `INV-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`,
          operationId: attrs.operationId,
          amount: {
            amount: attrs.amount.amount,
            currency: attrs.amount.currency || 'EUR'
          },
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB'),
          updatedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB')
        };

        return new Response(201, {}, invoice);
      });

      // Get invoices by patient ID
      this.get('/invoice/patient/:patientId', (schema, request) => {
        const patientId = request.params.patientId;

        // Validate that patient exists
        const patient = schema.findBy('patient', { id: patientId });
        if (!patient) {
          return new Response(404, {}, { message: 'Patient not found' });
        }

        // Get all operations for this patient first
        const patientOperations = (schema.all('operation').models as any[])
          .filter(operation => operation.attrs.patientId === patientId)
          .map(op => op.attrs.id);

        // Create mock invoices for this patient
        const mockInvoices = [
          {
            id: `INV-001-2025`,
            operationId: patientOperations[0] || 'OP-1001',
            amount: {
              amount: 150.00,
              currency: 'USD'
            },
            status: 'PAID',
            createdAt: '15/06/2025 10:00:00',
            updatedAt: '16/06/2025 09:15:00'
          },
          {
            id: `INV-002-2025`,
            operationId: patientOperations[1] || 'OP-1002',
            amount: {
              amount: 85.00,
              currency: 'EUR'
            },
            status: 'PENDING',
            createdAt: '18/06/2025 15:00:00',
            updatedAt: '18/06/2025 15:00:00'
          },
          {
            id: `INV-003-2025`,
            operationId: patientOperations[0] || 'OP-1001',
            amount: {
              amount: 320.50,
              currency: 'USD'
            },
            status: 'CANCELLED',
            createdAt: '20/06/2025 09:30:00',
            updatedAt: '21/06/2025 14:45:00'
          }
        ].filter((_, index) => index < patientOperations.length + 1); // Adjust number of invoices based on operations

        return { invoices: mockInvoices };
      });

      // Update invoice status
      this.post('/invoice/:invoiceId/status', (schema, request) => {
        const invoiceId = request.params.invoiceId;
        const attrs = JSON.parse(request.requestBody);

        // Validate required fields
        if (!attrs.status) {
          return new Response(400, {}, { message: 'Status is required' });
        }

        // Validate status value
        const validStatuses = ['PENDING', 'PAID', 'CANCELLED'];
        if (!validStatuses.includes(attrs.status)) {
          return new Response(400, {}, { message: 'Invalid status value' });
        }

        // For mock purposes, we'll create a mock updated invoice
        // In a real implementation, you'd find and update the actual invoice
        const updatedInvoice = {
          id: invoiceId,
          operationId: 'OP-1001', // Mock operation ID
          amount: {
            amount: 150.00,
            currency: 'EUR'
          },
          status: attrs.status,
          createdAt: '15/06/2025 10:00:00',
          updatedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB')
        };

        return new Response(200, {}, updatedInvoice);
      });
    },
  });
}
