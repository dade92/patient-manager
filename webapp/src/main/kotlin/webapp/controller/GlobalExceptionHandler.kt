package webapp.controller

import domain.exceptions.OperationNotFoundException
import domain.exceptions.PatientNotFoundException
import domain.exceptions.validator.EstimatedAmountDifferentFromDetailsSumException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler : ResponseEntityExceptionHandler() {

    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(RuntimeException::class)
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity<ErrorResponse> {
        logger.error("An error occurred while processing the request", ex)
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse("An internal server error occurred: ${ex.message}"))
    }

    @ExceptionHandler(PatientNotFoundException::class)
    fun handlePatientNotFoundException(ex: PatientNotFoundException): ResponseEntity<ErrorResponse> {
        logger.error("Patient not found", ex)
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse("Patient not found: ${ex.message}"))
    }

    @ExceptionHandler(OperationNotFoundException::class)
    fun handleOperationNotFoundException(ex: OperationNotFoundException): ResponseEntity<ErrorResponse> {
        logger.error("Operation not found", ex)
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse("Operation not found: ${ex.message}"))
    }

    @ExceptionHandler(EstimatedAmountDifferentFromDetailsSumException::class)
    fun handleEstimatedAmountValidationException(ex: EstimatedAmountDifferentFromDetailsSumException): ResponseEntity<ErrorResponse> {
        logger.error("Validation error:", ex)
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse("Validation error: ${ex.message}"))
    }

    data class ErrorResponse(
        val message: String
    )
}
