package domain.operationtype

import domain.exceptions.OperationTypeAlreadyExistsException
import domain.model.OperationTypeBuilder.anOperationType
import domain.model.PatientOperation.Type.Companion.SURGERY
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class OperationTypeServiceTest {

    private val operationTypeRepository = mockk<OperationTypeRepository>()
    private val operationTypeService = OperationTypeService(operationTypeRepository)

    @Test
    fun `save delegates to repository`() {
        val operationType = anOperationType(type = SURGERY)
        val savedOperationType = anOperationType(type = SURGERY)

        every { operationTypeRepository.save(operationType) } returns savedOperationType

        val result = operationTypeService.save(operationType)

        assertEquals(savedOperationType, result)
    }

    @Test
    fun `retrieve delegates to repository`() {
        val operationTypes = listOf(
            anOperationType(type = SURGERY),
            anOperationType()
        )

        every { operationTypeRepository.retrieveAll() } returns operationTypes

        val result = operationTypeService.retrieve()

        assertEquals(operationTypes, result)
    }

    @Test
    fun `save propagates exception when operation type already exists`() {
        val operationType = anOperationType(type = SURGERY)

        every { operationTypeRepository.save(operationType) } throws OperationTypeAlreadyExistsException(SURGERY)

        assertThrows<OperationTypeAlreadyExistsException> {
            operationTypeService.save(operationType)
        }
    }
}
