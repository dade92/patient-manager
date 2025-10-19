package webapp.adapter

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aPatientOperation
import domain.model.OperationBuilder.aPatientOperationInfo
import domain.model.OperationBuilder.anOperationId
import domain.model.OperationBuilder.anOperationNote
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
        val info = PatientOperationInfoResponse(emptyList())
        val patientOperation = aPatientOperation(
            id = anOperationId(OPERATION_ID),
            patientId = aPatientId(PATIENT_ID),
            type = OperationType.DIAGNOSTIC,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = listOf(ASSET_1, ASSET_2),
            additionalNotes = listOf(
                anOperationNote(FIRST_NOTE, LocalDateTime.of(2025, 3, 4, 5, 6, 7)),
                anOperationNote(SECOND_NOTE, LocalDateTime.of(2025, 3, 5, 6, 7, 8))
            ),
            creationDateTime = LocalDateTime.of(2025, 1, 2, 3, 4, 5),
            lastUpdate = LocalDateTime.of(2025, 2, 3, 4, 5, 6),
            estimatedCost = aMoney(BigDecimal(AMOUNT), CURRENCY),
            info = PATIENT_OPERATION_INFO
        )
        val expected = OperationResponse(
            id = OPERATION_ID,
            patientId = PATIENT_ID,
            type = OperationType.DIAGNOSTIC,
            description = DESCRIPTION,
            executor = EXECUTOR,
            assets = listOf(ASSET_1, ASSET_2),
            additionalNotes = listOf(
                OperationNoteResponse(FIRST_NOTE, "04/03/2025 05:06"),
                OperationNoteResponse(SECOND_NOTE, "05/03/2025 06:07")
            ),
            createdAt = "02/01/2025 03:04",
            updatedAt = "03/02/2025 04:05",
            estimatedCost = MoneyDto(BigDecimal(AMOUNT), CURRENCY),
            patientOperationInfo = info
        )

        every { patientOperationInfoAdapter.adapt(PATIENT_OPERATION_INFO) } returns info

        val actual = adapter.adapt(patientOperation)

        assertEquals(expected, actual)
    }

    companion object {
        private const val OPERATION_ID = "OP-123"
        private const val PATIENT_ID = "PAT-456"
        private const val DESCRIPTION = "Routine check-up"
        private const val EXECUTOR = "Dr. Smith"
        private const val ASSET_1 = "X-Ray"
        private const val ASSET_2 = "Blood Test"
        private const val AMOUNT = "150.00"
        private const val CURRENCY = "EUR"
        private const val FIRST_NOTE = "First note"
        private const val SECOND_NOTE = "Second note"

        private val PATIENT_OPERATION_INFO = aPatientOperationInfo()
    }
}
