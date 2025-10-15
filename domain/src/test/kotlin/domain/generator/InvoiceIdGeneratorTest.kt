package domain.generator

import domain.model.InvoiceId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class InvoiceIdGeneratorTest {

    private val generator = InvoiceIdGenerator()

    @Test
    fun `should generate different ids`() {
        val generatedIds = mutableSetOf<InvoiceId>()

        (1..100).forEach { _ ->
            generatedIds.add(generator.generate())
        }

        assertEquals(100, generatedIds.size)
    }
}