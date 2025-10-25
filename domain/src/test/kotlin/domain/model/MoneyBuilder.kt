package domain.model

import domain.model.Money.Companion.EUR
import java.math.BigDecimal

object MoneyBuilder {

    fun aMoney(
        amount: BigDecimal = BigDecimal("10.00"),
        currency: String = EUR
    ) = Money(
        amount = amount,
        currency = currency
    )

}