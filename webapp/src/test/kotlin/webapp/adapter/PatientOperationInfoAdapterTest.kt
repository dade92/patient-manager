package webapp.adapter

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationBuilder.aDetail
import domain.model.OperationBuilder.aPatientOperationInfo
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import webapp.controller.MoneyDto
import webapp.controller.OperationController
import java.math.BigDecimal

class PatientOperationInfoAdapterTest {

    private val adapter = PatientOperationInfoAdapter()

    @Test
    fun `should convert from domain to dto`() {
        val patientOperationInfo = aPatientOperationInfo(
            details = listOf(
                aDetail(toothNumber = 1, estimatedCost = aMoney(BigDecimal("100.00"), "EUR")),
                aDetail(toothNumber = 2, estimatedCost = aMoney(BigDecimal("150.50"), "USD"))
            )
        )

        val expected = OperationController.PatientOperationInfoDto(
            details = listOf(
                OperationController.DetailDto(
                    toothNumber = 1,
                    estimatedCost = MoneyDto(BigDecimal("100.00"), "EUR")
                ),
                OperationController.DetailDto(
                    toothNumber = 2,
                    estimatedCost = MoneyDto(BigDecimal("150.50"), "USD")
                )
            )
        )

        assertEquals(expected, adapter.adapt(patientOperationInfo))
    }

    @Test
    fun `should convert from dto to domain`() {
        val dto = OperationController.PatientOperationInfoDto(
            details = listOf(
                OperationController.DetailDto(
                    toothNumber = 1,
                    estimatedCost = MoneyDto(BigDecimal("100.00"), "EUR")
                ),
                OperationController.DetailDto(
                    toothNumber = 2,
                    estimatedCost = MoneyDto(BigDecimal("150.50"), "USD")
                )
            )
        )

        val expected = aPatientOperationInfo(
            details = listOf(
                aDetail(toothNumber = 1, estimatedCost = aMoney(BigDecimal("100.00"), "EUR")),
                aDetail(toothNumber = 2, estimatedCost = aMoney(BigDecimal("150.50"), "USD"))
            )
        )

        assertEquals(expected, adapter.adapt(dto))
    }
}
