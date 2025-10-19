package webapp.adapter

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.aPatientOperationInfo
import domain.model.OperationBuilder.anOperationNote
import domain.model.OperationId
import domain.model.OperationType
import domain.model.PatientBuilder.aPatientId
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDateTime

class PatientOperationResponseAdapterTest {

    private val patientOperationInfoAdapter = mockk<PatientOperationInfoAdapter>()
    private val adapter = PatientOperationResponseAdapter(patientOperationInfoAdapter)

    @Test
    fun adapt() {
        val info = PatientOperationInfoDto(emptyList())
        val patientOperationInfo = aPatientOperationInfo()

        val patientOperation = aPatientOperation(
            id = OperationId("OP-789"),
            patientId = aPatientId("PAT-123"),
            type = OperationType.DIAGNOSTIC,
            description = "Test operation",
            executor = "Dr. Smith",
            assets = listOf("xray.jpg", "scan.png"),
            additionalNotes = listOf(
                anOperationNote("First note", LocalDateTime.of(2025, 3, 4, 5, 6, 7)),
                anOperationNote("Second note", LocalDateTime.of(2025, 3, 5, 6, 7, 8))
            ),
            creationDateTime = LocalDateTime.of(2025, 1, 2, 3, 4, 5),
            lastUpdate = LocalDateTime.of(2025, 2, 3, 4, 5, 6),
            estimatedCost = aMoney(BigDecimal("250.00"), "EUR"),
            info = patientOperationInfo
        )

        every { patientOperationInfoAdapter.adapt(patientOperationInfo) } returns info

        val expected = OperationResponse(
            id = "OP-789",
            patientId = "PAT-123",
            type = OperationType.DIAGNOSTIC,
            description = "Test operation",
            executor = "Dr. Smith",
            assets = listOf("xray.jpg", "scan.png"),
            additionalNotes = listOf(
                OperationNoteResponse("First note", "04/03/2025 05:06"),
                OperationNoteResponse("Second note", "05/03/2025 06:07")
            ),
            createdAt = "02/01/2025 03:04",
            updatedAt = "03/02/2025 04:05",
            estimatedCost = MoneyDto(BigDecimal("250.00"), "EUR"),
            patientOperationInfo = info
        )

        val actual = adapter.adapt(patientOperation)

        assertEquals(expected, actual)
    }
}
