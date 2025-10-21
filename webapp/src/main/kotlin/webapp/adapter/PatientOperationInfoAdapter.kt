package webapp.adapter

import domain.model.PatientOperationInfo
import domain.model.ToothType

class PatientOperationInfoAdapter {
    fun adapt(patientOperationInfo: PatientOperationInfo): PatientOperationInfoJson =
        PatientOperationInfoJson(
            details = patientOperationInfo.details.map {
                DetailResponse(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDto(),
                    toothType = it.toothType.name
                )
            }
        )

    fun adapt(patientOperationInfoJson: PatientOperationInfoJson): PatientOperationInfo =
        PatientOperationInfo(
            details = patientOperationInfoJson.details.map {
                PatientOperationInfo.Detail(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDomain(),
                    toothType = ToothType.valueOf(it.toothType)
                )
            }
        )

}