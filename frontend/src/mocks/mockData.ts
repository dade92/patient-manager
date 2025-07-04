export const mockPatients = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "+1234567890",
        address: "123 Main St",
        cityOfResidence: "New York",
        nationality: "American",
        birthDate: "1990-05-15"
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phoneNumber: "+1987654321",
        address: "456 Oak Avenue",
        cityOfResidence: "Boston",
        nationality: "Canadian",
        birthDate: "1988-09-23"
    },
    {
        id: "3",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        phoneNumber: "+1122334455",
        address: "789 Pine Road",
        cityOfResidence: "Chicago",
        nationality: "British",
        birthDate: "1995-12-10"
    }
];

export const mockOperations = [
    {
        id: 'OP-1001',
        patientId: '1',
        type: 'CONSULTATION',
        description: 'Initial consultation for back pain',
        executor: 'Dr. Smith',
        assets: [
            'report1.pdf',
            'report2.pdf'
        ],
        additionalNotes: [
            {
                content: 'Patient reports pain in lower back for the past 2 weeks.',
                createdAt: '2025-06-01T10:15:00',
            },
            {
                content: 'Recommended rest and prescribed anti-inflammatory medication.',
                createdAt: '2025-06-01T10:20:00',
            }
        ],
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
