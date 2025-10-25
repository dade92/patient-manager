package webapp.adapter

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aDetail
import domain.model.OperationBuilder.aPatientOperationInfo
import domain.model.ToothType
import domain.model.ToothType.DECIDUOUS
import domain.model.ToothType.PERMANENT
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigDecimal

class PatientOperationInfoAdapterTest {

    private val adapter = PatientOperationInfoAdapter()

    @Test
    fun `from domain to response`() {
        val patientOperationInfo = aPatientOperationInfo(
            details = listOf(
                aDetail(
                    toothNumber = 1,
                    estimatedCost = aMoney(BigDecimal(AMOUNT_1), CURRENCY_1),
                    toothType = PERMANENT
                ),
                aDetail(
                    toothNumber = 2,
                    estimatedCost = aMoney(BigDecimal(AMOUNT_2), CURRENCY_2),
                    toothType = DECIDUOUS
                )
            )
        )

        val expected = PatientOperationInfoJson(
            details = listOf(
                DetailResponse(
                    toothNumber = 1,
                    estimatedCost = MoneyDto(BigDecimal(AMOUNT_1), CURRENCY_1),
                    toothType = "PERMANENT"
                ),
                DetailResponse(
                    toothNumber = 2,
                    estimatedCost = MoneyDto(BigDecimal(AMOUNT_2), CURRENCY_2),
                    toothType = "DECIDUOUS"
                )
            )
        )

        val actual = adapter.adapt(patientOperationInfo)

        assertEquals(expected, actual)
    }

    @Test
    fun `from response to domain`() {
        val response = PatientOperationInfoJson(
            details = listOf(
                DetailResponse(
                    toothNumber = 1,
                    estimatedCost = MoneyDto(BigDecimal(AMOUNT_1), CURRENCY_1),
                    toothType = "PERMANENT"
                ),
                DetailResponse(
                    toothNumber = 2,
                    estimatedCost = MoneyDto(BigDecimal(AMOUNT_2), CURRENCY_2),
                    toothType = "DECIDUOUS"
                )
            )
        )

        val expected = aPatientOperationInfo(
            details = listOf(
                aDetail(
                    toothNumber = 1,
                    estimatedCost = aMoney(BigDecimal(AMOUNT_1), CURRENCY_1),
                    toothType = PERMANENT
                ),
                aDetail(
                    toothNumber = 2,
                    estimatedCost = aMoney(BigDecimal(AMOUNT_2), CURRENCY_2),
                    toothType = DECIDUOUS
                )
            )
        )

        val actual = adapter.adapt(response)

        assertEquals(expected, actual)
    }

    companion object {
        private const val AMOUNT_1 = "100.00"
        private const val CURRENCY_1 = "EUR"
        private const val AMOUNT_2 = "150.50"
        private const val CURRENCY_2 = "USD"
    }
}
