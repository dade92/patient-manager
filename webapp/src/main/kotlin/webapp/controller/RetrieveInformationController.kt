package webapp.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RetrieveInformationController {

    @GetMapping("/information")
    fun retrieveInformation(): String =
        buildString {
            append("Information retrieved successfully")
        }

}