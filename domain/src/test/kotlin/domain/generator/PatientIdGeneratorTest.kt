package domain.generator

import domain.model.PatientId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class PatientIdGeneratorTest {

    private val generator = PatientIdGenerator()

    @Test
    fun `should generate different ids`() {
        val generatedIds = mutableSetOf<PatientId>()

        (1..100).forEach { _ ->
            generatedIds.add(generator.get())
        }

        assertEquals(100, generatedIds.size)
    }
}