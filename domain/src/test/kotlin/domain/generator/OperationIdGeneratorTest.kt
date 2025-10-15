package domain.generator

import domain.model.OperationId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class OperationIdGeneratorTest {

    private val generator = OperationIdGenerator()

    @Test
    fun `should generate different ids`() {
        val generatedIds = mutableSetOf<OperationId>()

        (1..100).forEach { _ ->
            generatedIds.add(generator.get())
        }

        assertEquals(100, generatedIds.size)
    }
}