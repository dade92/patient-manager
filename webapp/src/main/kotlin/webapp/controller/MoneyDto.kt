package webapp.controller

import java.math.BigDecimal

data class MoneyDto(
    val amount: BigDecimal,
    val currency: String
)