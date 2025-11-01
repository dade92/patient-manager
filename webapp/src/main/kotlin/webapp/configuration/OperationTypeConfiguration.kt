package webapp.configuration

import adapters.operationtype.JdbcOperationTypeRepository
import domain.operationtype.OperationTypeService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import webapp.adapter.OperationTypeResponseAdapter
import javax.sql.DataSource

@Configuration
class OperationTypeConfiguration {

    @Bean
    fun operationTypeService(dataSource: DataSource): OperationTypeService =
        OperationTypeService(JdbcOperationTypeRepository(dataSource))

    @Bean
    fun operationTypeResponseAdapter(): OperationTypeResponseAdapter = OperationTypeResponseAdapter()

}