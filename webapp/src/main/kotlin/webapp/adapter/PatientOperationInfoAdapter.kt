package webapp.adapter

import domain.model.PatientOperationInfo
import webapp.controller.OperationController.Companion.toDomain
import webapp.controller.OperationController.Companion.toDto

class PatientOperationInfoAdapter {

    fun adapt(patientOperationInfo: PatientOperationInfo): PatientOperationInfoDto =
        PatientOperationInfoDto(
            details = patientOperationInfo.details.map {
                DetailDto(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDto()
                )
            }
        )

    fun adapt(patientOperationInfoDto: PatientOperationInfoDto): PatientOperationInfo =
        PatientOperationInfo(
            details = patientOperationInfoDto.details.map {
                domain.model.Detail(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDomain()
                )
            }
        )

}