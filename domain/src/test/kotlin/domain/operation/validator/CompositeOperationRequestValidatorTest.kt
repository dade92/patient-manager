package domain.operation.validator

import domain.model.OperationBuilder.aCreateOperationRequest
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

class CompositeOperationRequestValidatorTest {

    private val validator1 = mockk<OperationRequestValidator>()
    private val validator2 = mockk<OperationRequestValidator>()

    private val compositeOperationRequestValidator = CompositeOperationRequestValidator(listOf(validator1, validator2))

    @Test
    fun `validate delegates to all validators`() {
        val request = aCreateOperationRequest()
        every { validator1.validate(any()) } returns Unit
        every { validator2.validate(any()) } returns Unit

        compositeOperationRequestValidator.validate(request)
    }

    @Test
    fun `validate stops on first validator exception`() {
        val exception = IllegalArgumentException("Invalid operation")

        val request = aCreateOperationRequest()
        every { validator1.validate(request) } throws exception

        assertThrows<IllegalArgumentException> {
            compositeOperationRequestValidator.validate(request)
        }

        verify { validator2 wasNot Called }
    }
}
