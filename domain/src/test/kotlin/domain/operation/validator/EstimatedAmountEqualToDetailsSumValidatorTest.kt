package domain.operation.validator

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aCreateOperationRequest
import domain.model.OperationBuilder.aDetail
import domain.model.OperationBuilder.aPatientOperationInfo
import domain.model.PatientOperationInfo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal

class EstimatedAmountEqualToDetailsSumValidatorTest {

    private val validator = EstimatedAmountEqualToDetailsSumValidator()

    @Test
    fun `validate passes when amount equals sum of details costs`() {
        val detail1 = aDetail(toothNumber = 1, estimatedCost = aMoney(amount = BigDecimal("10.33")))
        val detail2 = aDetail(toothNumber = 2, estimatedCost = aMoney(amount = BigDecimal("20.44")))
        val details = listOf(detail1, detail2)

        val request = aCreateOperationRequest(
            estimatedCost = aMoney(amount = BigDecimal("30.77")),
            patientOperationInfo = aPatientOperationInfo(details = details)
        )

        assertDoesNotThrow {
            validator.validate(request)
        }
    }

    @Test
    fun `validate throws exception when amount differs from sum of details costs`() {
        val detail1 = aDetail(toothNumber = 1, estimatedCost = aMoney(amount = BigDecimal("10.50")))
        val detail2 = aDetail(toothNumber = 2, estimatedCost = aMoney(amount = BigDecimal("20.00")))
        val details = listOf(detail1, detail2)

        val request = aCreateOperationRequest(
            estimatedCost = aMoney(amount = BigDecimal("35.00")),
            patientOperationInfo = aPatientOperationInfo(details = details)
        )

        val exception = assertThrows<IllegalArgumentException> {
            validator.validate(request)
        }

        assert(exception.message == "Estimated amount does not equal to sum of details estimated costs")
    }

    @Test
    fun `validate with empty details list does not throw exception`() {
        val emptyDetails = emptyList<PatientOperationInfo.Detail>()
        val nonZeroAmount = BigDecimal("10.00")

        val request = aCreateOperationRequest(
            estimatedCost = aMoney(amount = nonZeroAmount),
            patientOperationInfo = aPatientOperationInfo(details = emptyDetails)
        )

        assertDoesNotThrow {
            validator.validate(request)
        }
    }
}