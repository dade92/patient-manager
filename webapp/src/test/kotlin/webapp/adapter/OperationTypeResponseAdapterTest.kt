package webapp.adapter

import domain.model.MoneyBuilder.aMoney
import domain.model.OperationTypeBuilder.anOperationType
import domain.model.PatientOperation.Type.Companion.CONSULTATION
import domain.model.PatientOperation.Type.Companion.SURGERY
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.math.BigDecimal

class OperationTypeResponseAdapterTest {

    private val adapter = OperationTypeResponseAdapter()

    @Test
    fun adapt() {
        val operationType = anOperationType(
            type = SURGERY,
            description = "Complex surgical procedure",
            estimatedBaseCost = aMoney(BigDecimal("1500.00"), "EUR")
        )

        val expected = OperationTypeResponse(
            type = SURGERY,
            description = "Complex surgical procedure",
            estimatedBaseCost = MoneyDto(BigDecimal("1500.00"), "EUR")
        )

        val actual = adapter.adapt(operationType)

        assertEquals(expected, actual)
    }

    @Test
    fun adaptAll() {
        val operationTypes = listOf(
            anOperationType(
                type = SURGERY,
                description = "Complex surgical procedure",
                estimatedBaseCost = aMoney(BigDecimal("1500.00"), "EUR")
            ),
            anOperationType(
                type = CONSULTATION,
                description = "Standard consultation",
                estimatedBaseCost = aMoney(BigDecimal("100.00"), "EUR")
            )
        )

        val expected = listOf(
            OperationTypeResponse(
                type = SURGERY,
                description = "Complex surgical procedure",
                estimatedBaseCost = MoneyDto(BigDecimal("1500.00"), "EUR")
            ),
            OperationTypeResponse(
                type = CONSULTATION,
                description = "Standard consultation",
                estimatedBaseCost = MoneyDto(BigDecimal("100.00"), "EUR")
            )
        )

        val actual = adapter.adaptAll(operationTypes)

        assertEquals(expected, actual)
    }
}
