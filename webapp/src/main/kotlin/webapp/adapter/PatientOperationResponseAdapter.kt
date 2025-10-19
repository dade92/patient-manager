package webapp.adapter

import domain.model.PatientOperation
import webapp.controller.OperationController.Companion.toDto
import webapp.controller.OperationController.OperationNoteResponse
import webapp.controller.OperationController.OperationResponse
import java.time.format.DateTimeFormatter

class PatientOperationResponseAdapter(
    private val patientOperationInfoAdapter: PatientOperationInfoAdapter
) {
    fun adapt(patientOperation: PatientOperation): OperationResponse =
        OperationResponse(
            id = patientOperation.id.value,
            patientId = patientOperation.patientId.value,
            type = patientOperation.type,
            description = patientOperation.description,
            executor = patientOperation.executor,
            assets = patientOperation.assets,
            additionalNotes = patientOperation.additionalNotes.map {
                OperationNoteResponse(it.content, it.creationTime.format(DATE_FORMATTER))
            },
            createdAt = patientOperation.creationDateTime.format(DATE_FORMATTER),
            updatedAt = patientOperation.lastUpdate.format(DATE_FORMATTER),
            estimatedCost = patientOperation.estimatedCost.toDto(),
            patientOperationInfo = patientOperationInfoAdapter.adapt(patientOperation.info)
        )

    companion object {
        private val DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
    }
}