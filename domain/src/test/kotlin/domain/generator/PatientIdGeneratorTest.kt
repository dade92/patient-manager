package domain.generator

import domain.model.PatientId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class PatientIdGeneratorTest {

    private val patientIdGenerator = PatientIdGenerator()

    @Test
    fun `should generate different ids`() {
        val generatedIds = mutableSetOf<PatientId>()

        (1..100).forEach { _ ->
            generatedIds.add(patientIdGenerator.get())
        }

        assertEquals(100, generatedIds.size)
    }
}