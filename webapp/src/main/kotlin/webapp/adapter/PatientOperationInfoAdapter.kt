package webapp.adapter

import domain.model.PatientOperationInfo
import webapp.controller.OperationController
import webapp.controller.OperationController.Companion.toDomain
import webapp.controller.OperationController.Companion.toDto
import webapp.controller.OperationController.DetailDto

class PatientOperationInfoAdapter {

    fun adapt(patientOperationInfo: PatientOperationInfo): OperationController.PatientOperationInfoDto =
        OperationController.PatientOperationInfoDto(
            details = patientOperationInfo.details.map {
                DetailDto(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDto()
                )
            }
        )

    fun adapt(patientOperationInfoDto: OperationController.PatientOperationInfoDto): PatientOperationInfo =
        PatientOperationInfo(
            details = patientOperationInfoDto.details.map {
                domain.model.Detail(
                    toothNumber = it.toothNumber,
                    estimatedCost = it.estimatedCost.toDomain()
                )
            }
        )

}