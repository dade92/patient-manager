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
        val savedOperationType = anOperationType(type = SURGERY)

        every { operationTypeRepository.save(OPERATION_TYPE) } returns savedOperationType

        val result = operationTypeService.save(OPERATION_TYPE)

        assertEquals(savedOperationType, result)
    }

    @Test
    fun `retrieve delegates to repository`() {
        val operationTypes = listOf(
            OPERATION_TYPE,
        )

        every { operationTypeRepository.retrieveAll() } returns operationTypes

        val result = operationTypeService.retrieve()

        assertEquals(operationTypes, result)
    }

    @Test
    fun `save propagates exception when operation type already exists`() {
        every { operationTypeRepository.save(OPERATION_TYPE) } throws OperationTypeAlreadyExistsException(SURGERY)

        assertThrows<OperationTypeAlreadyExistsException> {
            operationTypeService.save(OPERATION_TYPE)
        }
    }

    companion object {
        private val OPERATION_TYPE = anOperationType(type = SURGERY)
    }
}
