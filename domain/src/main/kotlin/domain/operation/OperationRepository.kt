package domain.operation

import domain.model.OperationId
import domain.model.PatientId
import domain.model.PatientOperation

interface OperationRepository {
    fun save(operation: PatientOperation): PatientOperation
    fun retrieve(operationId: OperationId): PatientOperation?
    fun findByPatientId(patientId: PatientId): List<PatientOperation>
    fun addNote(operationId: OperationId, note: String): PatientOperation?
    fun addAsset(operationId: OperationId, assetName: String): PatientOperation?
}