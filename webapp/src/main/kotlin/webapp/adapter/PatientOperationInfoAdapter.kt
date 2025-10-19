package webapp.adapter

import domain.model.PatientOperationInfo

class PatientOperationInfoAdapter {
    fun adapt(patientOperationInfo: PatientOperationInfo): PatientOperationInfoResponse =
        PatientOperationInfoResponse(
            details = patientOperationInfo.details.map {
                DetailResponse(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDto()
                )
            }
        )

    fun adapt(patientOperationInfoResponse: PatientOperationInfoResponse): PatientOperationInfo =
        PatientOperationInfo(
            details = patientOperationInfoResponse.details.map {
                PatientOperationInfo.Detail(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDomain()
                )
            }
        )

}