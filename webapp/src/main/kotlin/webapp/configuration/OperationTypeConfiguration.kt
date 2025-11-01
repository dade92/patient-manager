package webapp.configuration

import adapters.operationtype.JdbcOperationTypeRepository
import domain.operationtype.OperationTypeService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import webapp.adapter.OperationTypeResponseAdapter

@Configuration
class OperationTypeConfiguration {

    @Bean
    fun operationTypeService(): OperationTypeService = OperationTypeService(JdbcOperationTypeRepository())

    @Bean
    fun operationTypeResponseAdapter() = OperationTypeResponseAdapter()

}