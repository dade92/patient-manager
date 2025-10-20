export const mockPatients = [
    {
        id: "11111111-1111-1111-1111",
        name: "John Doe",
        email: "john.doe@example.com",
        phoneNumber: "+1234567890",
        address: "123 Main St",
        cityOfResidence: "New York",
        nationality: "American",
        birthDate: "1990-05-15",
        taxCode: "TAX1234567890",
        medicalHistory: "Chronic back pain since 2023. Allergic to penicillin."
    },
    {
        id: "22222222-2222-2222-2222",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phoneNumber: "+1987654321",
        address: "456 Oak Avenue",
        cityOfResidence: "Boston",
        nationality: "Canadian",
        birthDate: "1988-09-23",
        taxCode: "TAX0987654321",
        medicalHistory: "Asthma since childhood. No known allergies."
    },
    {
        id: "33333333-3333-3333-3333",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        phoneNumber: "+1122334455",
        address: "789 Pine Road",
        cityOfResidence: "Chicago",
        nationality: "British",
        birthDate: "1995-12-10",
        taxCode: "TAX1122334455",
        medicalHistory: "Type 2 diabetes diagnosed in 2024. Seasonal allergies."
    }
];

export const mockOperations = [
    {
        id: 'OP-1001',
        patientId: '11111111-1111-1111-1111',
        type: 'CONSULTATION',
        description: 'Initial consultation for back pain',
        executor: 'Dr. Smith',
        assets: ['consultation_notes.pdf', 'patient_form.pdf'],
        additionalNotes: [
            {
                content: 'Patient reports lower back pain for 2 weeks',
                createdAt: '2025-06-01T10:15:00'
            }
        ],
        createdAt: '2025-06-01T10:00:00',
        updatedAt: '2025-06-01T10:30:00',
        estimatedCost: { amount: 50.00, currency: 'EUR' },
        patientOperationInfo: { details: [] }
    },
    {
        id: 'OP-1002',
        patientId: '11111111-1111-1111-1111',
        type: 'DIAGNOSTIC',
        description: 'X-Ray examination of lower back',
        executor: 'Dr. Johnson',
        assets: ['xray_lumbar_spine.jpg', 'radiology_report.pdf'],
        additionalNotes: [
            {
                content: 'X-ray shows normal bone structure',
                createdAt: '2025-06-15T14:30:00'
            }
        ],
        createdAt: '2025-06-15T14:00:00',
        updatedAt: '2025-06-15T14:45:00',
        estimatedCost: { amount: 120.00, currency: 'EUR' },
        patientOperationInfo: { details: [] }
    }
];
