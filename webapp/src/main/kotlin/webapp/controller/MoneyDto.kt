package webapp.controller

import domain.model.Money
import java.math.BigDecimal

data class MoneyDto(
    val amount: BigDecimal,
    val currency: String
)

fun MoneyDto.toDomain() = Money(amount = this.amount, currency = this.currency)
fun Money.toDto() = MoneyDto(amount = this.amount, currency = this.currency)